"use client";

import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import PrintButton from "@/components/ui/PrintButton";
import { useChecklistState } from "@/hooks/useChecklistState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Chapter } from "@/lib/types";

const difficultyTone: Record<string, "green" | "cyan" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "cyan",
  Advanced: "amber",
  Expert: "red",
};

export default function ChapterView({ chapter }: { chapter: Chapter }) {
  const { isChecked, toggle } = useChecklistState();
  const checklistId = `chapter:${chapter.slug}`;
  const [notes, setNotes] = useLocalStorage<Record<string, string>>(
    STORAGE_KEYS.chapterNotes,
    {}
  );

  const doneCount = chapter.checklist.filter((_, i) =>
    isChecked(checklistId, `item-${i}`)
  ).length;

  return (
    <GlassPanel glow className="print-target p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/manual"
            className="no-print mb-1 inline-block text-xs text-jarvis-dim hover:text-jarvis-cyan"
          >
            ← All chapters
          </Link>
          <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
            Chapter {chapter.number.toString().padStart(2, "0")} ·{" "}
            {chapter.category}
          </div>
          <h1 className="font-display text-2xl font-bold text-jarvis-cyan text-glow">
            {chapter.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={difficultyTone[chapter.difficulty]}>
            {chapter.difficulty}
          </StatusBadge>
          <PrintButton />
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-jarvis-cyan/90">
        <strong className="text-jarvis-cyan">Objective:</strong>{" "}
        {chapter.objective}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Difficulty" value={chapter.difficulty} />
        <MiniStat label="Est. Time" value={chapter.estimatedTime} />
        <MiniStat label="Tools" value={String(chapter.tools.length)} />
        <MiniStat label="Checklist" value={`${doneCount}/${chapter.checklist.length}`} />
      </div>

      {chapter.warnings.length > 0 && (
        <Block title="Warnings" tone="red">
          <ul className="list-disc space-y-1 pl-4 text-sm text-jarvis-red/90">
            {chapter.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </Block>
      )}

      {chapter.tools.length > 0 && (
        <Block title="Tools Required">
          <div className="flex flex-wrap gap-1.5">
            {chapter.tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-jarvis-border bg-jarvis-bg/50 px-2.5 py-0.5 text-[11px] text-jarvis-cyan/85"
              >
                {t}
              </span>
            ))}
          </div>
        </Block>
      )}

      {chapter.parts.length > 0 && (
        <Block title="Parts Referenced">
          <div className="flex flex-wrap gap-1.5">
            {chapter.parts.map((p) => (
              <span
                key={p}
                className="rounded-full border border-jarvis-border bg-jarvis-bg/50 px-2.5 py-0.5 text-[11px] text-jarvis-cyan/85"
              >
                {p}
              </span>
            ))}
          </div>
        </Block>
      )}

      <Block title="Step-by-Step Procedure">
        <ol className="space-y-2">
          {chapter.steps.map((s) => (
            <li key={s.order} className="flex gap-2.5 text-sm">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-jarvis-cyan/50 text-[10px] text-jarvis-cyan">
                {s.order}
              </span>
              <span className="text-jarvis-cyan/90">{s.text}</span>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Chapter Checklist">
        <ul className="space-y-1.5">
          {chapter.checklist.map((text, i) => {
            const itemId = `item-${i}`;
            const checked = isChecked(checklistId, itemId);
            return (
              <li key={itemId} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(checklistId, itemId)}
                  className="no-print mt-0.5 accent-cyan-400"
                />
                <span
                  className={
                    checked ? "text-jarvis-green line-through" : "text-jarvis-cyan/85"
                  }
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      </Block>

      <Block title="Notes">
        <textarea
          value={notes[chapter.slug] ?? ""}
          onChange={(e) =>
            setNotes((prev) => ({ ...prev, [chapter.slug]: e.target.value }))
          }
          rows={4}
          placeholder="Personal notes for this chapter — dates, part numbers used, deviations from plan…"
          className="w-full rounded border border-jarvis-border bg-jarvis-bg/60 p-2.5 text-sm text-jarvis-cyan/90 focus:border-jarvis-cyan/60 focus:outline-none"
        />
      </Block>
    </GlassPanel>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-widest text-jarvis-dim">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-jarvis-cyan">{value}</div>
    </div>
  );
}

function Block({
  title,
  children,
  tone = "cyan",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "cyan" | "red";
}) {
  return (
    <div className="mb-5">
      <h2
        className={`mb-2 font-display text-xs font-bold uppercase tracking-widest ${
          tone === "red" ? "text-jarvis-red" : "text-jarvis-cyan"
        }`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
