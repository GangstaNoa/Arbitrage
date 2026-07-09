"use client";

import { useState } from "react";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateId } from "@/lib/id";

interface CodingAction {
  id: string;
  date: string;
  action: string;
  tool: string;
  result: string;
}

const suggestedTools = [
  "ENET interface (USB-to-Ethernet, official or clone)",
  "K+DCAN USB cable (legacy fallback)",
  "Laptop with ISTA-D (diagnostics)",
  "Laptop with ISTA-P or E-Sys (coding/programming)",
  "Battery charger/maintainer (mandatory during any coding session)",
];

const commonActions = [
  "Read fault codes (baseline scan)",
  "Clear fault codes",
  "Battery registration (IBS reset)",
  "Injector correction code entry",
  "Glow plug cycle test",
  "Live data monitoring (boost, rail pressure, temps)",
  "Module coding / feature activation",
];

export default function CodingDiagnosticsPage() {
  const [log, setLog] = useLocalStorage<CodingAction[]>(
    `${STORAGE_KEYS.chapterNotes}:coding-log`,
    []
  );
  const [form, setForm] = useState({
    action: commonActions[0],
    tool: "ISTA-D",
    result: "",
  });

  const addEntry = () => {
    const entry: CodingAction = {
      id: generateId("CD"),
      date: new Date().toISOString().slice(0, 10),
      action: form.action,
      tool: form.tool,
      result: form.result.trim(),
    };
    setLog((prev) => [entry, ...prev]);
    setForm((s) => ({ ...s, result: "" }));
  };

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <p className="text-sm text-jarvis-cyan/85">
          Full step-by-step guidance lives in{" "}
          <Link href="/manual/coding-diagnostics" className="text-jarvis-cyan underline">
            Manual → Coding &amp; Diagnostics
          </Link>
          . This page is your quick-access console for interface setup and a
          running log of every coding/diagnostic action performed on this VIN.
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Recommended Toolchain
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-jarvis-cyan/85">
          {suggestedTools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-jarvis-amber">
          Always keep the battery on a maintainer during coding — an
          interrupted write can brick a module.
        </p>
      </GlassPanel>

      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Coding / Diagnostics Log
        </h2>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <select
            value={form.action}
            onChange={(e) => setForm((s) => ({ ...s, action: e.target.value }))}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm text-jarvis-cyan"
          >
            {commonActions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            value={form.tool}
            onChange={(e) => setForm((s) => ({ ...s, tool: e.target.value }))}
            placeholder="Tool used"
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm"
          />
          <input
            value={form.result}
            onChange={(e) => setForm((s) => ({ ...s, result: e.target.value }))}
            placeholder="Result / notes"
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2"
          />
          <GlowButton onClick={addEntry} className="sm:col-span-4">
            + Log Action
          </GlowButton>
        </div>
        {log.length === 0 ? (
          <p className="text-sm text-jarvis-dim">No coding actions logged yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {log.map((entry) => (
              <li
                key={entry.id}
                className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-jarvis-cyan">{entry.action}</span>
                  <span className="text-[11px] text-jarvis-dim">
                    {entry.date} · {entry.tool}
                  </span>
                </div>
                {entry.result && (
                  <p className="mt-1 text-xs text-jarvis-dim">{entry.result}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}
