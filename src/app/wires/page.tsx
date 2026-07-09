"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import PrintButton from "@/components/ui/PrintButton";
import WireForm from "@/components/wires/WireForm";
import WireCard from "@/components/wires/WireCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, downloadJson } from "@/lib/storage";
import type { WireCategory, WireLabel } from "@/lib/types";

const categories: (WireCategory | "all")[] = [
  "all",
  "sensor",
  "injector",
  "ground",
  "power",
  "vacuum",
  "coolant",
  "fuel",
  "unknown",
];

export default function WiresPage() {
  const [labels, setLabels] = useLocalStorage<WireLabel[]>(
    STORAGE_KEYS.wireLabels,
    []
  );
  const [filter, setFilter] = useState<WireCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return labels
      .filter((l) => filter === "all" || l.system === filter)
      .filter((l) =>
        query.trim()
          ? `${l.connectorId} ${l.name} ${l.location} ${l.notes}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      )
      .sort((a, b) => a.connectorId.localeCompare(b.connectorId, undefined, { numeric: true }));
  }, [labels, filter, query]);

  const addLabel = (label: WireLabel) => setLabels((prev) => [...prev, label]);
  const updateLabel = (id: string, patch: Partial<WireLabel>) =>
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const deleteLabel = (id: string) =>
    setLabels((prev) => prev.filter((l) => l.id !== id));

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <p className="text-sm text-jarvis-cyan/85">
          Log every connector before you disconnect it. Each label gets an
          auto-incrementing ID (C001, C002, …). Print the sheet below and tape
          labels near each connector, or export as JSON for backup.
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <WireForm existingIds={labels.map((l) => l.connectorId)} onCreate={addLabel} />
      </GlassPanel>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labels…"
            className="w-48 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide transition-colors ${
                  filter === c
                    ? "border-jarvis-cyan bg-jarvis-cyan/15 text-jarvis-cyan"
                    : "border-jarvis-border text-jarvis-dim hover:text-jarvis-cyan"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <PrintButton label="Print Labels" />
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadJson(`wire-labels-${Date.now()}.json`, labels)
              }
            >
              ⬇ Export JSON
            </GlowButton>
          </div>
        </div>

        <div className="print-target">
          <h2 className="mb-2 hidden font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan print:block print:text-black">
            JARVIS X5 Garage OS — Wire / Connector Labels
          </h2>
          {filtered.length === 0 ? (
            <p className="text-sm text-jarvis-dim">
              No wire labels yet. Add your first connector above.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
              {filtered.map((label) => (
                <WireCard
                  key={label.id}
                  label={label}
                  onUpdate={updateLabel}
                  onDelete={deleteLabel}
                />
              ))}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
