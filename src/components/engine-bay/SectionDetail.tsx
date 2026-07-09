"use client";

import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import { useChecklistState } from "@/hooks/useChecklistState";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";
import type { EngineBaySection, TorqueSpec } from "@/lib/types";
import torqueSpecsEn from "@/data/torqueSpecs.json";
import torqueSpecsFo from "@/data/torqueSpecs.fo.json";

export default function SectionDetail({
  section,
}: {
  section: EngineBaySection;
}) {
  const { t } = useLanguage();
  const { isChecked, toggle } = useChecklistState();
  const checklistId = `engine-bay:${section.id}`;
  const torqueSpecs = useLocalizedData(torqueSpecsEn, torqueSpecsFo);

  const specs = (torqueSpecs as TorqueSpec[]).filter((t) =>
    section.torqueSpecRefs.includes(t.id)
  );

  return (
    <GlassPanel glow className="print-target p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
            {t("engineBay.sectionLabel")}
          </div>
          <h2 className="font-display text-xl font-bold text-jarvis-cyan text-glow">
            {section.name}
          </h2>
        </div>
        <PrintButton />
      </div>

      <p className="mb-4 border-l-2 border-jarvis-cyan/40 pl-3 text-[14px] leading-relaxed text-jarvis-ink/90">
        {section.description}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2">
        <div className="flex aspect-video flex-col items-center justify-center gap-1 rounded border border-dashed border-jarvis-border/70 text-[11px] text-jarvis-dim">
          <span className="text-lg">📷</span>
          {t("engineBay.photoBefore")}
        </div>
        <div className="flex aspect-video flex-col items-center justify-center gap-1 rounded border border-dashed border-jarvis-border/70 text-[11px] text-jarvis-dim">
          <span className="text-lg">📷</span>
          {t("engineBay.photoAfter")}
        </div>
      </div>

      <Section title={t("engineBay.removalSteps")}>
        <ol className="list-decimal space-y-1.5 pl-4 text-[14px] leading-relaxed text-jarvis-ink/90">
          {section.removalSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section title={t("engineBay.inspectionPoints")}>
        <ul className="list-disc space-y-1.5 pl-4 text-[14px] leading-relaxed text-jarvis-ink/90">
          {section.inspectionPoints.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("engineBay.torqueSpecs")}>
        {specs.length === 0 ? (
          <p className="text-sm text-jarvis-dim">{t("engineBay.noTorqueSpecs")}</p>
        ) : (
          <div className="space-y-1.5">
            {specs.map((spec) => (
              <div
                key={spec.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-jarvis-amber/30 bg-jarvis-amber/5 px-2.5 py-1.5 text-[13px]"
              >
                <span className="text-jarvis-ink/90">{spec.fastener}</span>
                <span className="font-semibold text-jarvis-amber">
                  {spec.torqueValue}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={t("engineBay.commonMistakes")} tone="red">
        <ul className="list-disc space-y-1.5 pl-4 text-[14px] leading-relaxed text-jarvis-ink/90">
          {section.commonMistakes.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("engineBay.reconnectChecklist")}>
        <ul className="space-y-2">
          {section.reconnectChecklist.map((text, i) => {
            const itemId = `item-${i}`;
            const checked = isChecked(checklistId, itemId);
            return (
              <li key={itemId} className="flex items-start gap-2 text-[14px]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(checklistId, itemId)}
                  className="mt-0.5 accent-cyan-400 no-print"
                />
                <span
                  className={checked ? "text-jarvis-green line-through" : "text-jarvis-ink/90"}
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>
    </GlassPanel>
  );
}

function Section({
  title,
  children,
  tone = "cyan",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "cyan" | "red";
}) {
  return (
    <div className="mb-4">
      <h3
        className={`mb-1.5 font-display text-xs font-bold uppercase tracking-widest ${
          tone === "red" ? "text-jarvis-red" : "text-jarvis-cyan"
        }`}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
