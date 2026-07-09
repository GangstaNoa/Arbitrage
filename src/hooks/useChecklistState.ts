"use client";

import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

export type ChecklistState = Record<string, Record<string, boolean>>;

export function useChecklistState() {
  const [state, setState, hydrated] = useLocalStorage<ChecklistState>(
    STORAGE_KEYS.checklists,
    {}
  );

  const toggle = (checklistId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      [checklistId]: {
        ...prev[checklistId],
        [itemId]: !prev[checklistId]?.[itemId],
      },
    }));
  };

  const isChecked = (checklistId: string, itemId: string) =>
    !!state[checklistId]?.[itemId];

  return { state, toggle, isChecked, hydrated };
}
