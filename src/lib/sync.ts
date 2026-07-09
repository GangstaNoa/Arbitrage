// Thin client-side wrapper around the /api/state/[key] route, which proxies
// to Supabase server-side. Every call is best-effort: if sync isn't
// configured or the network is down, callers fall back to localStorage.

export interface RemoteState<T> {
  enabled: boolean;
  value: T | null;
  updatedAt: string | null;
}

export async function fetchRemoteState<T>(key: string): Promise<RemoteState<T> | null> {
  try {
    const res = await fetch(`/api/state/${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as RemoteState<T>;
  } catch {
    return null;
  }
}

export async function pushRemoteState<T>(
  key: string,
  value: T
): Promise<{ enabled: boolean; updatedAt: string | null } | null> {
  try {
    const res = await fetch(`/api/state/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
