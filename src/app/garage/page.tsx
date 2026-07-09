"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import zones from "@/data/garageZones.json";
import type { GarageZone } from "@/lib/types";

const CarViewer = dynamic(() => import("@/components/three/CarViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-jarvis-dim">
      Initializing 3D render engine…
    </div>
  ),
});

export default function GaragePage() {
  const [exploded, setExploded] = useState(false);
  const [orderMode, setOrderMode] = useState(false);
  const [orderIndex, setOrderIndex] = useState(1);
  const [selected, setSelected] = useState<GarageZone | null>(null);

  const sortedZones = useMemo(
    () => [...(zones as GarageZone[])].sort((a, b) => a.disassemblyOrder - b.disassemblyOrder),
    []
  );

  const currentOrderZone = sortedZones.find((z) => z.disassemblyOrder === orderIndex);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <GlassPanel className="relative h-[60vh] overflow-hidden lg:col-span-2 lg:h-[75vh]">
        <div className="no-print absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <GlowButton
            size="sm"
            variant={exploded ? "success" : "ghost"}
            onClick={() => setExploded((v) => !v)}
          >
            {exploded ? "Exploded View: ON" : "Exploded View"}
          </GlowButton>
          <GlowButton
            size="sm"
            variant={orderMode ? "success" : "ghost"}
            onClick={() => {
              setOrderMode((v) => !v);
              setOrderIndex(1);
            }}
          >
            {orderMode ? "Disassembly Mode: ON" : "Disassembly Order Mode"}
          </GlowButton>
        </div>

        {orderMode && (
          <div className="no-print absolute right-3 top-3 z-10 flex items-center gap-2 rounded border border-jarvis-cyan/40 bg-jarvis-panel/90 px-3 py-2 backdrop-blur">
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => setOrderIndex((i) => Math.max(1, i - 1))}
            >
              ◀
            </GlowButton>
            <span className="min-w-[7rem] text-center text-xs text-jarvis-cyan">
              Step {orderIndex} / {sortedZones.length}
            </span>
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() =>
                setOrderIndex((i) => Math.min(sortedZones.length, i + 1))
              }
            >
              ▶
            </GlowButton>
          </div>
        )}

        <CarViewer
          zones={zones as GarageZone[]}
          exploded={exploded}
          orderMode={orderMode}
          currentOrderIndex={orderMode ? orderIndex : null}
          onZoneSelect={setSelected}
          selectedZoneId={selected?.id ?? null}
        />

        <div className="no-print absolute bottom-3 left-3 right-3 z-10 rounded border border-jarvis-border/60 bg-jarvis-bg/80 px-3 py-2 text-[11px] text-jarvis-dim backdrop-blur">
          Drag to rotate · Pinch/scroll to zoom · Tap a glowing node to open its
          chapter. Model repainted to BMW 354 Titanium Silver Metallic to match
          this car.
        </div>
      </GlassPanel>

      <div className="space-y-4">
        {orderMode && currentOrderZone && (
          <GlassPanel glow className="p-4">
            <div className="text-[11px] uppercase tracking-widest text-jarvis-amber">
              Disassembly Step {orderIndex}
            </div>
            <div className="mt-1 font-display text-lg font-bold text-jarvis-cyan">
              {currentOrderZone.name}
            </div>
            <p className="mt-1 text-sm text-jarvis-dim">{currentOrderZone.description}</p>
            <Link href={`/manual/${currentOrderZone.chapterSlug}`}>
              <GlowButton size="sm" className="mt-3">
                Open Chapter →
              </GlowButton>
            </Link>
          </GlassPanel>
        )}

        {selected && !orderMode && (
          <GlassPanel glow className="p-4">
            <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
              Selected Zone
            </div>
            <div className="mt-1 font-display text-lg font-bold text-jarvis-cyan">
              {selected.name}
            </div>
            <p className="mt-1 text-sm text-jarvis-dim">{selected.description}</p>
            <Link href={`/manual/${selected.chapterSlug}`}>
              <GlowButton size="sm" className="mt-3">
                Open Chapter →
              </GlowButton>
            </Link>
          </GlassPanel>
        )}

        <GlassPanel className="p-4">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
            All Zones
          </h2>
          <ul className="max-h-[50vh] space-y-1.5 overflow-y-auto">
            {sortedZones.map((z) => (
              <li key={z.id}>
                <button
                  onClick={() => setSelected(z)}
                  className={`flex w-full items-center justify-between rounded border px-2.5 py-1.5 text-left text-xs transition-colors ${
                    selected?.id === z.id
                      ? "border-jarvis-cyan/60 bg-jarvis-cyan/10 text-jarvis-cyan"
                      : "border-jarvis-border/50 text-jarvis-dim hover:border-jarvis-cyan/40 hover:text-jarvis-cyan"
                  }`}
                >
                  <span>{z.name}</span>
                  <span className="text-jarvis-dim">#{z.disassemblyOrder}</span>
                </button>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
