"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import EngineBaySchematic from "@/components/engine-bay/EngineBaySchematic";
import SectionDetail from "@/components/engine-bay/SectionDetail";
import sections from "@/data/engineBaySections.json";
import type { EngineBaySection } from "@/lib/types";

const EngineViewer = dynamic(() => import("@/components/three/EngineViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-jarvis-dim">
      Initializing 3D render engine…
    </div>
  ),
});

export default function EngineBayPage() {
  const [selected, setSelected] = useState<EngineBaySection>(
    (sections as EngineBaySection[])[0]
  );
  const [view, setView] = useState<"3d" | "schematic">("3d");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <GlassPanel className="p-4 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
            {view === "3d" ? "3D Engine Model" : "Top-Down Engine Bay Schematic"}
          </h2>
          <div className="no-print flex gap-1.5">
            <GlowButton
              size="sm"
              variant={view === "3d" ? "success" : "ghost"}
              onClick={() => setView("3d")}
            >
              3D View
            </GlowButton>
            <GlowButton
              size="sm"
              variant={view === "schematic" ? "success" : "ghost"}
              onClick={() => setView("schematic")}
            >
              Schematic
            </GlowButton>
          </div>
        </div>

        {view === "3d" ? (
          <div className="aspect-[3/4] w-full overflow-hidden rounded border border-jarvis-border/60 bg-jarvis-bg/60">
            <EngineViewer
              sections={sections as EngineBaySection[]}
              selectedId={selected.id}
              onSelect={setSelected}
            />
          </div>
        ) : (
          <EngineBaySchematic
            sections={sections as EngineBaySection[]}
            selectedId={selected.id}
            onSelect={setSelected}
          />
        )}

        <p className="mt-3 text-[11px] text-jarvis-dim">
          {view === "3d"
            ? "Drag to rotate · Scroll to zoom · Tap a glowing node to open its teardown/reinstall reference. Stylized model built from reference photos of an M57 engine, not a scanned/licensed asset — proportions are approximate."
            : "Tap any node to open its full teardown/reinstall reference. This layout is a schematic approximation, not to scale."}
        </p>
      </GlassPanel>

      <div className="lg:col-span-3">
        <SectionDetail section={selected} />
      </div>
    </div>
  );
}
