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

interface Section {
  id: string;
  label: string;
  show: boolean;
}

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
  const checklistTotal = chapter.checklist.length;
  const checklistPct =
    checklistTotal > 0 ? Math.round((doneCount / checklistTotal) * 100) : 0;

  const sections: Section[] = [
    { id: "warnings", label: "Warnings", show: chapter.warnings.length > 0 },
    { id: "pro-tips", label: "Pro Tips", show: chapter.proTips.length > 0 },
    {
      id: "common-mistakes",
      label: "Watch Out For",
      show: chapter.commonMistakes.length > 0,
    },
    {
      id: "loadout",
      label: "Tools & Parts",
      show: chapter.tools.length > 0 || chapter.parts.length > 0,
    },
    { id: "procedure", label: "Procedure", show: chapter.steps.length > 0 },
    {
      id: "checklist",
      label: "Checklist",
      show: chapter.checklist.length > 0,
    },
    { id: "notes", label: "Notes", show: true },
  ].filter((s) => s.show);

  return (
    <GlassPanel glow className="print-target p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              href="/manual"
              className="no-print mb-2 inline-block text-xs text-jarvis-dim hover:text-jarvis-cyan"
            >
              ← All chapters
            </Link>
            <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
              Chapter {chapter.number.toString().padStart(2, "0")} ·{" "}
              {chapter.category}
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-jarvis-cyan text-glow sm:text-3xl">
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

        {/* Objective — lead paragraph, comfortable reading size */}
        <p className="mb-6 border-l-2 border-jarvis-cyan/40 pl-4 text-[15px] leading-7 text-jarvis-ink/95 sm:text-base">
          {chapter.objective}
        </p>

        {/* Quick facts */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Difficulty" value={chapter.difficulty} />
          <MiniStat label="Est. Time" value={chapter.estimatedTime} />
          <MiniStat label="Tools" value={String(chapter.tools.length)} />
          <MiniStat
            label="Checklist"
            value={`${doneCount}/${checklistTotal}`}
          />
        </div>

        {/* Jump nav */}
        {sections.length > 1 && (
          <nav
            aria-label="Jump to section"
            className="no-print mb-8 flex flex-wrap gap-1.5 border-y border-jarvis-border/50 py-3"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-jarvis-border px-3 py-1 text-[11px] uppercase tracking-wide text-jarvis-dim transition-colors hover:border-jarvis-cyan/50 hover:text-jarvis-cyan"
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}

        <div className="space-y-9">
          {chapter.warnings.length > 0 && (
            <Section id="warnings" title="Warnings" tone="red" icon="⚠">
              <BulletList items={chapter.warnings} tone="red" />
            </Section>
          )}

          {chapter.proTips.length > 0 && (
            <Section id="pro-tips" title="Pro Tips" tone="green" icon="✓">
              <BulletList items={chapter.proTips} tone="green" />
            </Section>
          )}

          {chapter.commonMistakes.length > 0 && (
            <Section
              id="common-mistakes"
              title="Watch Out For"
              tone="amber"
              icon="◆"
            >
              <BulletList items={chapter.commonMistakes} tone="amber" />
            </Section>
          )}

          {(chapter.tools.length > 0 || chapter.parts.length > 0) && (
            <Section id="loadout" title="Tools &amp; Parts" tone="cyan">
              <div className="space-y-4">
                {chapter.tools.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-[11px] uppercase tracking-widest text-jarvis-dim">
                      Tools Required
                    </div>
                    <ChipRow items={chapter.tools} />
                  </div>
                )}
                {chapter.parts.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-[11px] uppercase tracking-widest text-jarvis-dim">
                      Parts Referenced
                    </div>
                    <ChipRow items={chapter.parts} />
                  </div>
                )}
              </div>
            </Section>
          )}

          {chapter.steps.length > 0 && (
            <Section id="procedure" title="Step-by-Step Procedure" tone="cyan">
              <ol className="divide-y divide-jarvis-border/40">
                {chapter.steps.map((s) => (
                  <li key={s.order} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-jarvis-cyan/50 text-[11px] font-semibold text-jarvis-cyan">
                      {s.order}
                    </span>
                    <span className="text-[15px] leading-7 text-jarvis-ink/90">
                      {s.text}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {chapter.checklist.length > 0 && (
            <Section id="checklist" title="Chapter Checklist" tone="cyan">
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-jarvis-bg/60">
                <div
                  className="h-full rounded-full bg-jarvis-green shadow-glow-green transition-all duration-300"
                  style={{ width: `${checklistPct}%` }}
                />
              </div>
              <ul className="space-y-2.5">
                {chapter.checklist.map((text, i) => {
                  const itemId = `item-${i}`;
                  const checked = isChecked(checklistId, itemId);
                  return (
                    <li key={itemId} className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(checklistId, itemId)}
                        className="no-print mt-1 h-4 w-4 flex-shrink-0 accent-cyan-400"
                      />
                      <span
                        className={`text-[15px] leading-7 ${
                          checked
                            ? "text-jarvis-green line-through"
                            : "text-jarvis-ink/90"
                        }`}
                      >
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          <Section id="notes" title="Notes" tone="cyan">
            <textarea
              value={notes[chapter.slug] ?? ""}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [chapter.slug]: e.target.value }))
              }
              rows={5}
              placeholder="Personal notes for this chapter — dates, part numbers used, deviations from plan…"
              className="w-full rounded border border-jarvis-border bg-jarvis-bg/60 p-3 text-[15px] leading-7 text-jarvis-ink/90 focus:border-jarvis-cyan/60 focus:outline-none"
            />
          </Section>
        </div>
      </div>
    </GlassPanel>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest text-jarvis-dim">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-jarvis-cyan">{value}</div>
    </div>
  );
}

function ChipRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-jarvis-border bg-jarvis-bg/50 px-2.5 py-1 text-[12px] text-jarvis-ink/85"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const sectionTone: Record<
  "cyan" | "red" | "green" | "amber",
  { text: string; icon: string }
> = {
  cyan: { text: "text-jarvis-cyan", icon: "text-jarvis-cyan" },
  red: { text: "text-jarvis-red", icon: "text-jarvis-red" },
  green: { text: "text-jarvis-green", icon: "text-jarvis-green" },
  amber: { text: "text-jarvis-amber", icon: "text-jarvis-amber" },
};

function Section({
  id,
  title,
  children,
  tone = "cyan",
  icon,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  tone?: "cyan" | "red" | "green" | "amber";
  icon?: string;
}) {
  const t = sectionTone[tone];
  return (
    <section id={id} className="scroll-mt-24">
      <h2
        className={`mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest ${t.text}`}
      >
        {icon && <span className={t.icon}>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({
  items,
  tone,
}: {
  items: string[];
  tone: "red" | "green" | "amber";
}) {
  const dotClass = {
    red: "bg-jarvis-red",
    green: "bg-jarvis-green",
    amber: "bg-jarvis-amber",
  }[tone];

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-7 text-jarvis-ink/90">
          <span className={`mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
