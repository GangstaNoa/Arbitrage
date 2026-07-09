"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import StatusBadge, { statusToTone } from "@/components/ui/StatusBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, downloadJson } from "@/lib/storage";
import { generateId } from "@/lib/id";
import chapters from "@/data/chapters.json";
import type { Chapter, PhotoNote } from "@/lib/types";

const statuses: PhotoNote["status"][] = ["planned", "in-progress", "done", "issue"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotosPage() {
  const [entries, setEntries] = useLocalStorage<PhotoNote[]>(
    STORAGE_KEYS.photoNotes,
    []
  );
  const [chapterFilter, setChapterFilter] = useState("all");
  const [form, setForm] = useState({
    chapterSlug: "",
    stepText: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
    status: "planned" as PhotoNote["status"],
  });
  const [photo, setPhoto] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) => chapterFilter === "all" || e.chapterSlug === chapterFilter
      ),
    [entries, chapterFilter]
  );

  const addEntry = () => {
    if (!form.stepText.trim()) return;
    const entry: PhotoNote = {
      id: generateId("PN"),
      chapterSlug: form.chapterSlug || null,
      stepText: form.stepText.trim(),
      photo,
      note: form.note.trim(),
      date: form.date,
      status: form.status,
    };
    setEntries((prev) => [entry, ...prev]);
    setForm({ ...form, stepText: "", note: "" });
    setPhoto(null);
  };

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Log a Photo / Note
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={form.chapterSlug}
            onChange={(e) => setForm((s) => ({ ...s, chapterSlug: e.target.value }))}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            <option value="">No chapter</option>
            {(chapters as Chapter[]).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            value={form.stepText}
            onChange={(e) => setForm((s) => ({ ...s, stepText: e.target.value }))}
            placeholder="Step / description"
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2 lg:col-span-1"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          />
          <select
            value={form.status}
            onChange={(e) =>
              setForm((s) => ({ ...s, status: e.target.value as PhotoNote["status"] }))
            }
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) setPhoto(await fileToDataUrl(file));
            }}
            className="text-xs text-jarvis-dim file:mr-2 file:rounded file:border-0 file:bg-jarvis-cyan/20 file:px-2 file:py-1.5 file:text-jarvis-cyan sm:col-span-2"
          />
          <textarea
            value={form.note}
            onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
            placeholder="Note"
            rows={1}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2 lg:col-span-3"
          />
          <GlowButton onClick={addEntry}>+ Add Entry</GlowButton>
        </div>
      </GlassPanel>

      <GlassPanel className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            <option value="all">All chapters</option>
            {(chapters as Chapter[]).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-jarvis-dim">{filtered.length} entries</span>
          <div className="ml-auto">
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => downloadJson(`photo-notes-${Date.now()}.json`, entries)}
            >
              ⬇ Export JSON
            </GlowButton>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-jarvis-dim">No photo notes logged yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 p-3"
              >
                {e.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.photo}
                    alt={e.stepText}
                    className="mb-2 h-32 w-full rounded object-cover"
                  />
                ) : (
                  <div className="mb-2 flex h-32 w-full items-center justify-center rounded border border-dashed border-jarvis-border text-[11px] text-jarvis-dim">
                    📷 No photo
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm text-jarvis-cyan/90">{e.stepText}</span>
                  <StatusBadge tone={statusToTone(e.status)}>{e.status}</StatusBadge>
                </div>
                {e.note && <p className="mt-1 text-xs text-jarvis-dim">{e.note}</p>}
                <div className="mt-2 flex items-center justify-between text-[11px] text-jarvis-dim">
                  <span>{e.date}</span>
                  <button
                    onClick={() => removeEntry(e.id)}
                    className="text-jarvis-red hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
