import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import chapters from "@/data/chapters.json";
import type { Chapter } from "@/lib/types";

const difficultyTone: Record<string, "green" | "cyan" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "cyan",
  Advanced: "amber",
  Expert: "red",
};

export default function ManualPage() {
  const byCategory = new Map<string, Chapter[]>();
  for (const c of chapters as Chapter[]) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category)!.push(c);
  }

  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-sm leading-relaxed text-jarvis-ink/80">
        28 chapters covering the full engine replacement project, from
        first-day planning through ongoing maintenance. Each one now includes
        researched pro tips and common mistakes specific to the M57TU2D30
        (306D5) engine and E70 xDrive35d platform, not just generic steps.
      </p>
      {Array.from(byCategory.entries()).map(([category, list]) => (
        <div key={category}>
          <div className="mb-3 flex items-baseline gap-2 border-b border-jarvis-border/50 pb-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
              {category}
            </h2>
            <span className="text-[11px] text-jarvis-dim">
              {list.length} chapter{list.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.slug} href={`/manual/${c.slug}`}>
                <GlassPanel className="h-full p-5 transition-all hover:border-jarvis-cyan/60 hover:shadow-glow">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-jarvis-dim">
                      Ch. {c.number.toString().padStart(2, "0")}
                    </span>
                    <StatusBadge tone={difficultyTone[c.difficulty]}>
                      {c.difficulty}
                    </StatusBadge>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-bold text-jarvis-cyan text-glow">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-jarvis-ink/70">
                    {c.objective}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-jarvis-dim">
                    <span>⏱ {c.estimatedTime}</span>
                    {c.proTips.length > 0 && (
                      <span className="text-jarvis-green/80">
                        ✓ {c.proTips.length} pro tip{c.proTips.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
