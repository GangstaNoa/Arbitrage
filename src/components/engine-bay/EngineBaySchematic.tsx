"use client";

import type { EngineBaySection } from "@/lib/types";

export default function EngineBaySchematic({
  sections,
  selectedId,
  onSelect,
}: {
  sections: EngineBaySection[];
  selectedId: string | null;
  onSelect: (section: EngineBaySection) => void;
}) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-jarvis-border/60 bg-jarvis-bg/60 hud-grid-bg">
      {/* Vehicle outline (top-down, front at top) */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      >
        <rect
          x="15"
          y="3"
          width="70"
          height="94"
          rx="10"
          fill="none"
          stroke="#1c5a72"
          strokeWidth="0.6"
        />
        <line x1="15" y1="24" x2="85" y2="24" stroke="#1c5a72" strokeWidth="0.3" strokeDasharray="1,1.5" />
        <line x1="15" y1="76" x2="85" y2="76" stroke="#1c5a72" strokeWidth="0.3" strokeDasharray="1,1.5" />
        <text x="50" y="10" textAnchor="middle" fontSize="3" fill="#39f4ff" opacity="0.6">
          FRONT
        </text>
        <text x="50" y="96" textAnchor="middle" fontSize="3" fill="#39f4ff" opacity="0.6">
          FIREWALL
        </text>
      </svg>

      {sections.map((s) => {
        const active = s.id === selectedId;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span
              className={`block h-3 w-3 rounded-full border transition-all ${
                active
                  ? "scale-150 border-jarvis-green bg-jarvis-green shadow-glow-green"
                  : "border-jarvis-cyan bg-jarvis-cyan/70 shadow-glow-sm animate-pulse-slow group-hover:scale-125"
              }`}
            />
            <span
              className={`pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded border px-1.5 py-0.5 text-[9px] opacity-0 transition-opacity group-hover:opacity-100 ${
                active
                  ? "border-jarvis-green/60 text-jarvis-green opacity-100"
                  : "border-jarvis-cyan/50 text-jarvis-cyan"
              } bg-jarvis-bg/90`}
            >
              {s.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
