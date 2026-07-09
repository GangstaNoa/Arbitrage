"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { fetchRemoteState, pushRemoteState } from "@/lib/sync";

const SYNC_POLL_MS = 15000;
const PUSH_DEBOUNCE_MS = 600;

function syncedAtKey(key: string) {
  return `${key}__syncedAt`;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncEnabled = useRef(true);

  useEffect(() => {
    const local = readStorage<T>(key, initialValue);
    setValue(local);
    setHydrated(true);

    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const reconcile = async (seedIfEmpty: boolean) => {
      const remote = await fetchRemoteState<T>(key);
      if (cancelled || !remote) return;
      if (!remote.enabled) {
        syncEnabled.current = false;
        return;
      }
      const lastSyncedAt = readStorage<string | null>(syncedAtKey(key), null);
      if (remote.value === null) {
        if (seedIfEmpty) {
          const current = readStorage<T>(key, initialValue);
          const pushed = await pushRemoteState(key, current);
          if (pushed?.updatedAt) writeStorage(syncedAtKey(key), pushed.updatedAt);
        }
        return;
      }
      if (!lastSyncedAt || (remote.updatedAt && remote.updatedAt > lastSyncedAt)) {
        writeStorage(key, remote.value);
        if (remote.updatedAt) writeStorage(syncedAtKey(key), remote.updatedAt);
        if (!cancelled) setValue(remote.value);
      }
    };

    reconcile(true);
    pollTimer = setInterval(() => {
      if (document.visibilityState === "visible") reconcile(false);
    }, SYNC_POLL_MS);

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        writeStorage(key, resolved);

        if (syncEnabled.current) {
          if (pushTimer.current) clearTimeout(pushTimer.current);
          pushTimer.current = setTimeout(async () => {
            const pushed = await pushRemoteState(key, resolved);
            if (!pushed) return;
            if (!pushed.enabled) {
              syncEnabled.current = false;
              return;
            }
            if (pushed.updatedAt) writeStorage(syncedAtKey(key), pushed.updatedAt);
          }, PUSH_DEBOUNCE_MS);
        }

        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
