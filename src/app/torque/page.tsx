"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import torqueSpecsEn from "@/data/torqueSpecs.json";
import torqueSpecsFo from "@/data/torqueSpecs.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";
import type { TorqueSpec } from "@/lib/types";

export default function TorquePage() {
  const { t } = useLanguage();
  const torqueSpecsData = useLocalizedData(torqueSpecsEn, torqueSpecsFo);
  const torqueSpecs = torqueSpecsData as TorqueSpec[];
  const [query, setQuery] = useState("");
  const [component, setComponent] = useState("all");

  const components = useMemo(
    () => ["all", ...Array.from(new Set(torqueSpecs.map((t) => t.component)))],
    [torqueSpecs]
  );

  const filtered = useMemo(() => {
    return torqueSpecs.filter((t) => {
      const matchesComponent = component === "all" || t.component === component;
      const matchesQuery = query.trim()
        ? `${t.component} ${t.fastener} ${t.notes}`.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesComponent && matchesQuery;
    });
  }, [torqueSpecs, query, component]);

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <p className="text-sm text-jarvis-amber">
          ⚠ {t("torque.verifyBanner")}
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("torque.searchPlaceholder")}
            className="w-64 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {components.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? t("common.all") : c}
              </option>
            ))}
          </select>
          <span className="text-xs text-jarvis-dim">{filtered.length} {t("torque.specsCount")}</span>
          <div className="ml-auto">
            <PrintButton />
          </div>
        </div>

        <div className="print-target overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-jarvis-border text-[11px] uppercase tracking-wide text-jarvis-dim">
                <th className="py-2 pr-3">{t("torque.component")}</th>
                <th className="py-2 pr-3">{t("torque.fastener")}</th>
                <th className="py-2 pr-3">{t("torque.torque")}</th>
                <th className="py-2 pr-3">{t("torque.angle")}</th>
                <th className="py-2 pr-3">{t("torque.notes")}</th>
                <th className="py-2 pr-3">{t("torque.source")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-jarvis-border/40 align-top">
                  <td className="py-2 pr-3 text-jarvis-cyan/90">{t.component}</td>
                  <td className="py-2 pr-3">{t.fastener}</td>
                  <td className="py-2 pr-3 font-semibold text-jarvis-amber">
                    {t.torqueValue}
                  </td>
                  <td className="py-2 pr-3 text-jarvis-dim">{t.angle ?? "—"}</td>
                  <td className="py-2 pr-3 text-jarvis-dim">{t.notes}</td>
                  <td className="py-2 pr-3 text-[11px] text-jarvis-red">{t.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
