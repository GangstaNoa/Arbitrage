"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import StatusBadge from "@/components/ui/StatusBadge";
import tools from "@/data/tools.json";
import type { Tool } from "@/lib/types";

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [requiredOnly, setRequiredOnly] = useState(false);

  const filtered = useMemo(() => {
    return (tools as Tool[]).filter((t) => {
      const matchesQuery = query.trim()
        ? `${t.name} ${t.purpose} ${t.notes}`.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesQuery && (!requiredOnly || t.required);
    });
  }, [query, requiredOnly]);

  const totalEstimate = (tools as Tool[]).reduce((s, t) => s + t.priceEstimateDkk, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Total Tools</div>
          <div className="font-display text-xl text-jarvis-cyan">{tools.length}</div>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Required</div>
          <div className="font-display text-xl text-jarvis-amber">
            {(tools as Tool[]).filter((t) => t.required).length}
          </div>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Est. Total</div>
          <div className="font-display text-xl text-jarvis-cyan">
            {totalEstimate.toLocaleString()} DKK
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-56 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <label className="flex items-center gap-1.5 text-xs text-jarvis-dim">
            <input
              type="checkbox"
              checked={requiredOnly}
              onChange={(e) => setRequiredOnly(e.target.checked)}
              className="accent-cyan-400"
            />
            Required only
          </label>
          <span className="text-xs text-jarvis-dim">{filtered.length} tools</span>
          <div className="ml-auto">
            <PrintButton />
          </div>
        </div>

        <div className="print-target overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-jarvis-border text-[11px] uppercase tracking-wide text-jarvis-dim">
                <th className="py-2 pr-3">Tool</th>
                <th className="py-2 pr-3">Size</th>
                <th className="py-2 pr-3">Required?</th>
                <th className="py-2 pr-3">Purpose</th>
                <th className="py-2 pr-3">Est. Price</th>
                <th className="py-2 pr-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-jarvis-border/40 align-top">
                  <td className="py-2 pr-3 text-jarvis-cyan/90">{t.name}</td>
                  <td className="py-2 pr-3 text-jarvis-dim">{t.size}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge tone={t.required ? "amber" : "dim"}>
                      {t.required ? "Required" : "Optional"}
                    </StatusBadge>
                  </td>
                  <td className="py-2 pr-3 text-jarvis-dim">{t.purpose}</td>
                  <td className="py-2 pr-3">{t.priceEstimateDkk.toLocaleString()} DKK</td>
                  <td className="py-2 pr-3 text-jarvis-dim">{t.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
