"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import torqueSpecs from "@/data/torqueSpecs.json";
import type { TorqueSpec } from "@/lib/types";

export default function TorquePage() {
  const [query, setQuery] = useState("");
  const [component, setComponent] = useState("all");

  const components = useMemo(
    () => ["all", ...Array.from(new Set((torqueSpecs as TorqueSpec[]).map((t) => t.component)))],
    []
  );

  const filtered = useMemo(() => {
    return (torqueSpecs as TorqueSpec[]).filter((t) => {
      const matchesComponent = component === "all" || t.component === component;
      const matchesQuery = query.trim()
        ? `${t.component} ${t.fastener} ${t.notes}`.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesComponent && matchesQuery;
    });
  }, [query, component]);

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <p className="text-sm text-jarvis-amber">
          ⚠ All values marked <strong>VERIFY IN BMW TIS</strong> are
          placeholders. Do not torque any safety-critical fastener to a guessed
          value — confirm the exact spec (and angle stage, if applicable) in
          BMW TIS before use.
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search component, fastener, notes…"
            className="w-64 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {components.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-jarvis-dim">{filtered.length} specs</span>
          <div className="ml-auto">
            <PrintButton />
          </div>
        </div>

        <div className="print-target overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-jarvis-border text-[11px] uppercase tracking-wide text-jarvis-dim">
                <th className="py-2 pr-3">Component</th>
                <th className="py-2 pr-3">Fastener</th>
                <th className="py-2 pr-3">Torque</th>
                <th className="py-2 pr-3">Angle</th>
                <th className="py-2 pr-3">Notes</th>
                <th className="py-2 pr-3">Source</th>
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
