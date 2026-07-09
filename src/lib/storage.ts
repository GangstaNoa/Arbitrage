// Thin localStorage wrapper used by all hooks. Every key is namespaced
// so the whole app's state can be exported/imported as one JSON blob.

export const STORAGE_PREFIX = "jarvis-x5-os:";

export const STORAGE_KEYS = {
  wireLabels: `${STORAGE_PREFIX}wire-labels`,
  checklists: `${STORAGE_PREFIX}checklist-state`,
  partsOverlay: `${STORAGE_PREFIX}parts-overlay`,
  budget: `${STORAGE_PREFIX}budget`,
  photoNotes: `${STORAGE_PREFIX}photo-notes`,
  maintenanceLog: `${STORAGE_PREFIX}maintenance-log`,
  chapterNotes: `${STORAGE_PREFIX}chapter-notes`,
  vehicle: `${STORAGE_PREFIX}vehicle`,
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently, data stays in memory
  }
}

export function exportAllData(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const data: Record<string, unknown> = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }
  data["exportedAt"] = new Date().toISOString();
  return data;
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
