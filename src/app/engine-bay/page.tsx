"use client";

import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import EngineBaySchematic from "@/components/engine-bay/EngineBaySchematic";
import SectionDetail from "@/components/engine-bay/SectionDetail";
import sectionsEn from "@/data/engineBaySections.json";
import sectionsFo from "@/data/engineBaySections.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";
import type { EngineBaySection } from "@/lib/types";

export default function EngineBayPage() {
  const { t } = useLanguage();
  const sectionsData = useLocalizedData(sectionsEn, sectionsFo);
  const sections = sectionsData as EngineBaySection[];
  const [selectedId, setSelectedId] = useState(sections[0].id);
  const selected = sections.find((s) => s.id === selectedId) ?? sections[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <GlassPanel className="p-4 lg:col-span-2">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          {t("engineBay.schematicTitle")}
        </h2>
        <EngineBaySchematic
          sections={sections}
          selectedId={selected.id}
          onSelect={(s) => setSelectedId(s.id)}
        />
        <p className="mt-3 text-[11px] text-jarvis-dim">{t("engineBay.hint")}</p>
      </GlassPanel>

      <div className="lg:col-span-3">
        <SectionDetail section={selected} />
      </div>
    </div>
  );
}
