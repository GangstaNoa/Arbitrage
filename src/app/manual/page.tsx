"use client";

import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import chaptersEn from "@/data/chapters.json";
import chaptersFo from "@/data/chapters.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";
import type { DictKey } from "@/lib/i18n/dictionary";
import type { Chapter } from "@/lib/types";

const difficultyTone: Record<string, "green" | "cyan" | "amber" | "red"> = {
  Beginner: "green",
  Intermediate: "cyan",
  Advanced: "amber",
  Expert: "red",
};

export default function ManualPage() {
  const { t } = useLanguage();
  const chapters = useLocalizedData(chaptersEn, chaptersFo) as Chapter[];

  const byCategory = new Map<string, Chapter[]>();
  for (const c of chapters) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category)!.push(c);
  }

  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-sm leading-relaxed text-jarvis-ink/80">
        {t("manual.intro")}
      </p>
      {Array.from(byCategory.entries()).map(([category, list]) => (
        <div key={category}>
          <div className="mb-3 flex items-baseline gap-2 border-b border-jarvis-border/50 pb-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
              {t(`category.${category}` as DictKey)}
            </h2>
            <span className="text-[11px] text-jarvis-dim">
              {list.length} {list.length === 1 ? t("manual.chapterSingular") : t("manual.chapterPlural")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.slug} href={`/manual/${c.slug}`}>
                <GlassPanel className="h-full p-5 transition-all hover:border-jarvis-cyan/60 hover:shadow-glow">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-jarvis-dim">
                      {t("manual.chapterAbbr")} {c.number.toString().padStart(2, "0")}
                    </span>
                    <StatusBadge tone={difficultyTone[c.difficulty]}>
                      {t(`difficulty.${c.difficulty}` as DictKey)}
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
                        ✓ {c.proTips.length} {c.proTips.length === 1 ? t("manual.proTipSingular") : t("manual.proTipPlural")}
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
