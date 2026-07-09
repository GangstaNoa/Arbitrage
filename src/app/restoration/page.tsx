"use client";

import { useState } from "react";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateId } from "@/lib/id";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DictKey } from "@/lib/i18n/dictionary";
import type { Priority } from "@/lib/types";

interface RestorationTask {
  id: string;
  area: "Exterior" | "Interior" | "Paint" | "M Sport";
  text: string;
  priority: Priority;
  done: boolean;
}

const areaChapters: { area: RestorationTask["area"]; slug: string }[] = [
  { area: "Exterior", slug: "exterior-restoration" },
  { area: "Interior", slug: "interior-restoration" },
  { area: "Paint", slug: "paint-correction" },
  { area: "M Sport", slug: "m-sport-conversion" },
];

const priorities: Priority[] = ["critical", "high", "medium", "low"];
const priorityTone: Record<Priority, "red" | "amber" | "cyan" | "dim"> = {
  critical: "red",
  high: "amber",
  medium: "cyan",
  low: "dim",
};

export default function RestorationPage() {
  const { t } = useLanguage();
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
                {t(`restoration.area.${a.area}` as DictKey)}
              </div>
              <p className="mt-1 text-xs text-jarvis-dim">
                {t(`restoration.blurb.${a.area}` as DictKey)}
              </p>
              <span className="mt-2 inline-block text-[11px] text-jarvis-cyan/70">
                {t("restoration.openChapter")}
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>

      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          {t("restoration.taskBoard")}
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
                {t(`restoration.area.${a.area}` as DictKey)}
              </option>
            ))}
          </select>
          <input
            value={form.text}
            onChange={(e) => setForm((s) => ({ ...s, text: e.target.value }))}
            placeholder={t("restoration.taskDescription")}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as Priority }))}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {t(`parts.priority.${p}` as DictKey)}
              </option>
            ))}
          </select>
          <GlowButton onClick={addTask} className="sm:col-span-4">
            {t("restoration.addTask")}
          </GlowButton>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-jarvis-dim">{t("restoration.noTasksYet")}</p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-2 rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="accent-cyan-400"
                  />
                  <span className={task.done ? "text-jarvis-green line-through" : "text-jarvis-cyan/90"}>
                    {task.text}
                  </span>
                  <span className="rounded-full border border-jarvis-border px-2 py-0.5 text-[10px] text-jarvis-dim">
                    {t(`restoration.area.${task.area}` as DictKey)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={priorityTone[task.priority]}>
                    {t(`parts.priority.${task.priority}` as DictKey)}
                  </StatusBadge>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-[11px] text-jarvis-red hover:underline"
                  >
                    {t("restoration.delete")}
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
