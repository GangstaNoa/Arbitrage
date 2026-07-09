// Generic helper to merge a localStorage "overlay" of partial edits
// on top of read-only base JSON data, keyed by record id.

export function applyOverlay<T extends { id: string }>(
  base: T[],
  overlay: Record<string, Partial<T>>
): T[] {
  return base.map((item) => ({ ...item, ...(overlay[item.id] ?? {}) }));
}
