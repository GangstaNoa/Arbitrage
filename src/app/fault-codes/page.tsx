"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import faultCodes from "@/data/faultCodes.json";
import type { FaultCode } from "@/lib/types";

export default function FaultCodesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return (faultCodes as FaultCode[]).filter((f) =>
      query.trim()
        ? `${f.code} ${f.system} ${f.description} ${f.commonCauses.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
        : true
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <p className="text-sm text-jarvis-amber">
          ⚠ These descriptions are general references for common OBD-II/BMW
          fault codes on this platform. Always confirm exact meaning, freeze
          frame data, and repair guidance in ISTA for this specific vehicle
          before ordering parts.
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fault codes…"
            className="w-64 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <span className="text-xs text-jarvis-dim">{filtered.length} codes</span>
          <div className="ml-auto">
            <PrintButton />
          </div>
        </div>

        <div className="print-target space-y-2">
          {filtered.map((f) => (
            <div
              key={f.code}
              className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display font-bold text-jarvis-cyan text-glow">
                  {f.code}
                </span>
                <span className="rounded-full border border-jarvis-border px-2 py-0.5 text-[11px] text-jarvis-dim">
                  {f.system}
                </span>
              </div>
              <p className="mt-1 text-sm text-jarvis-cyan/90">{f.description}</p>
              <div className="mt-1.5 text-xs text-jarvis-dim">
                <strong className="text-jarvis-cyan/70">Common causes:</strong>{" "}
                {f.commonCauses.join(", ")}
              </div>
              {f.notes && (
                <div className="mt-1 text-xs text-jarvis-amber">{f.notes}</div>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
