"use client";

import { useState } from "react";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateId } from "@/lib/id";
import type { Priority } from "@/lib/types";

interface RestorationTask {
  id: string;
  area: "Exterior" | "Interior" | "Paint" | "M Sport";
  text: string;
  priority: Priority;
  done: boolean;
}

const areaChapters: { area: RestorationTask["area"]; slug: string; blurb: string }[] = [
  { area: "Exterior", slug: "exterior-restoration", blurb: "Body panels, trim, rust checks" },
  { area: "Interior", slug: "interior-restoration", blurb: "Seats, dash, trim, electronics" },
  { area: "Paint", slug: "paint-correction", blurb: "Correction, polishing, protection" },
  { area: "M Sport", slug: "m-sport-conversion", blurb: "Optional M Sport aesthetic/handling package" },
];

const priorities: Priority[] = ["critical", "high", "medium", "low"];
const priorityTone: Record<Priority, "red" | "amber" | "cyan" | "dim"> = {
  critical: "red",
  high: "amber",
  medium: "cyan",
  low: "dim",
};

export default function RestorationPage() {
  const [tasks, setTasks] = useLocalStorage<RestorationTask[]>(
    `${STORAGE_KEYS.chapterNotes}:restoration-tasks`,
    []
  );
  const [form, setForm] = useState({
    area: "Exterior" as RestorationTask["area"],
    text: "",
    priority: "medium" as Priority,
  });

  const addTask = () => {
    if (!form.text.trim()) return;
    setTasks((prev) => [
      { id: generateId("RT"), ...form, text: form.text.trim(), done: false },
      ...prev,
    ]);
    setForm((s) => ({ ...s, text: "" }));
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {areaChapters.map((a) => (
          <Link key={a.slug} href={`/manual/${a.slug}`}>
            <GlassPanel className="h-full p-4 transition-all hover:border-jarvis-cyan/60 hover:shadow-glow">
              <div className="font-display text-sm font-bold text-jarvis-cyan text-glow">
                {a.area}
              </div>
              <p className="mt-1 text-xs text-jarvis-dim">{a.blurb}</p>
              <span className="mt-2 inline-block text-[11px] text-jarvis-cyan/70">
                Open chapter →
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>

      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Restoration Task Board
        </h2>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <select
            value={form.area}
            onChange={(e) =>
              setForm((s) => ({ ...s, area: e.target.value as RestorationTask["area"] }))
            }
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {areaChapters.map((a) => (
              <option key={a.area} value={a.area}>
                {a.area}
              </option>
            ))}
          </select>
          <input
            value={form.text}
            onChange={(e) => setForm((s) => ({ ...s, text: e.target.value }))}
            placeholder="Task description"
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as Priority }))}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <GlowButton onClick={addTask} className="sm:col-span-4">
            + Add Task
          </GlowButton>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-jarvis-dim">
            No restoration tasks logged yet. Add exterior, interior, paint, or M
            Sport tasks above.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="accent-cyan-400"
                  />
                  <span className={t.done ? "text-jarvis-green line-through" : "text-jarvis-cyan/90"}>
                    {t.text}
                  </span>
                  <span className="rounded-full border border-jarvis-border px-2 py-0.5 text-[10px] text-jarvis-dim">
                    {t.area}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={priorityTone[t.priority]}>{t.priority}</StatusBadge>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="text-[11px] text-jarvis-red hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}
