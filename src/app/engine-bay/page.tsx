"use client";

import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import EngineBaySchematic from "@/components/engine-bay/EngineBaySchematic";
import SectionDetail from "@/components/engine-bay/SectionDetail";
import sections from "@/data/engineBaySections.json";
import type { EngineBaySection } from "@/lib/types";

export default function EngineBayPage() {
  const [selected, setSelected] = useState<EngineBaySection>(
    (sections as EngineBaySection[])[0]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <GlassPanel className="p-4 lg:col-span-2">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Top-Down Engine Bay Schematic
        </h2>
        <EngineBaySchematic
          sections={sections as EngineBaySection[]}
          selectedId={selected.id}
          onSelect={setSelected}
        />
        <p className="mt-3 text-[11px] text-jarvis-dim">
          Tap any node to open its full teardown/reinstall reference. This
          layout is a schematic approximation, not to scale.
        </p>
      </GlassPanel>

      <div className="lg:col-span-3">
        <SectionDetail section={selected} />
      </div>
    </div>
  );
}
