"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import StatusBadge, { statusToTone } from "@/components/ui/StatusBadge";
import GlowButton from "@/components/ui/GlowButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, downloadJson } from "@/lib/storage";
import { applyOverlay } from "@/lib/overlay";
import partsBase from "@/data/parts.json";
import type { Part, PartStatus, Priority } from "@/lib/types";

const statuses: PartStatus[] = ["needed", "ordered", "installed"];
const priorityTone: Record<Priority, "red" | "amber" | "cyan" | "dim"> = {
  critical: "red",
  high: "amber",
  medium: "cyan",
  low: "dim",
};

export default function PartsPage() {
  const [overlay, setOverlay] = useLocalStorage<Record<string, Partial<Part>>>(
    STORAGE_KEYS.partsOverlay,
    {}
  );
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [status, setStatus] = useState<PartStatus | "all">("all");

  const parts = useMemo(
    () => applyOverlay<Part>(partsBase as Part[], overlay),
    [overlay]
  );

  const systems = useMemo(
    () => ["all", ...Array.from(new Set(parts.map((p) => p.system)))],
    [parts]
  );

  const filtered = parts.filter((p) => {
    const matchesQuery = query.trim()
      ? `${p.name} ${p.system} ${p.notes}`.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesSystem = system === "all" || p.system === system;
    const matchesStatus = status === "all" || p.status === status;
    return matchesQuery && matchesSystem && matchesStatus;
  });

  const updatePart = (id: string, patch: Partial<Part>) =>
    setOverlay((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const totals = {
    needed: parts.filter((p) => p.status === "needed").length,
    ordered: parts.filter((p) => p.status === "ordered").length,
    installed: parts.filter((p) => p.status === "installed").length,
    estCost: parts.reduce((s, p) => s + p.priceEstimateDkk, 0),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Needed</div>
          <div className="font-display text-xl text-jarvis-amber">{totals.needed}</div>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Ordered</div>
          <div className="font-display text-xl text-jarvis-cyan">{totals.ordered}</div>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Installed</div>
          <div className="font-display text-xl text-jarvis-green">{totals.installed}</div>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <div className="text-[11px] text-jarvis-dim">Est. Total</div>
          <div className="font-display text-xl text-jarvis-cyan">
            {totals.estCost.toLocaleString()} DKK
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts…"
            className="w-56 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <select
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {systems.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PartStatus | "all")}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            <option value="all">all statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-xs text-jarvis-dim">{filtered.length} parts</span>
          <div className="ml-auto flex gap-2">
            <PrintButton />
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => downloadJson(`parts-${Date.now()}.json`, parts)}
            >
              ⬇ Export JSON
            </GlowButton>
          </div>
        </div>

        <div className="print-target overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-jarvis-border text-[11px] uppercase tracking-wide text-jarvis-dim">
                <th className="py-2 pr-3">Part</th>
                <th className="py-2 pr-3">System</th>
                <th className="py-2 pr-3">OEM #</th>
                <th className="py-2 pr-3">Brand</th>
                <th className="py-2 pr-3">Est. Price</th>
                <th className="py-2 pr-3">Priority</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-jarvis-border/40 align-top">
                  <td className="py-2 pr-3 text-jarvis-cyan/90">
                    {p.name}
                    {p.notes && (
                      <div className="text-[11px] text-jarvis-dim">{p.notes}</div>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-jarvis-dim">{p.system}</td>
                  <td className="py-2 pr-3 text-jarvis-dim">{p.oemNumber}</td>
                  <td className="py-2 pr-3 text-jarvis-dim">{p.recommendedBrand}</td>
                  <td className="py-2 pr-3">{p.priceEstimateDkk.toLocaleString()} DKK</td>
                  <td className="py-2 pr-3">
                    <StatusBadge tone={priorityTone[p.priority]}>{p.priority}</StatusBadge>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={p.status}
                      onChange={(e) =>
                        updatePart(p.id, { status: e.target.value as PartStatus })
                      }
                      className="no-print rounded border border-jarvis-border bg-jarvis-bg/70 px-1.5 py-0.5 text-xs text-jarvis-cyan"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="hidden print:inline">
                      <StatusBadge tone={statusToTone(p.status)}>{p.status}</StatusBadge>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
