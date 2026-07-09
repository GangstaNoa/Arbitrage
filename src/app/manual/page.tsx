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
    <div className="space-y-6">
      {Array.from(byCategory.entries()).map(([category, list]) => (
        <div key={category}>
          <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-jarvis-dim">
            {category}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.slug} href={`/manual/${c.slug}`}>
                <GlassPanel className="h-full p-4 transition-all hover:border-jarvis-cyan/60 hover:shadow-glow">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-jarvis-dim">
                      Ch. {c.number.toString().padStart(2, "0")}
                    </span>
                    <StatusBadge tone={difficultyTone[c.difficulty]}>
                      {c.difficulty}
                    </StatusBadge>
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-jarvis-cyan text-glow">
                    {c.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-jarvis-dim">
                    {c.objective}
                  </p>
                  <p className="mt-2 text-[11px] text-jarvis-dim">
                    ⏱ {c.estimatedTime}
                  </p>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
