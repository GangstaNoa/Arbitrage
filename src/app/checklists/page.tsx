"use client";

import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import PrintButton from "@/components/ui/PrintButton";
import { useChecklistState } from "@/hooks/useChecklistState";
import checklistDefs from "@/data/checklists.json";

export default function ChecklistsPage() {
  const { isChecked, toggle } = useChecklistState();
  const [activeId, setActiveId] = useState(checklistDefs[0].id);
  const active = checklistDefs.find((c) => c.id === activeId)!;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <GlassPanel className="no-print p-3 lg:col-span-1">
        <h2 className="mb-2 px-1 font-display text-xs font-bold uppercase tracking-widest text-jarvis-dim">
          Checklists
        </h2>
        <div className="space-y-1">
          {checklistDefs.map((c) => {
            const done = c.items.filter((it) => isChecked(c.id, it.id)).length;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-sm transition-colors ${
                  activeId === c.id
                    ? "bg-jarvis-cyan/10 text-jarvis-cyan"
                    : "text-jarvis-dim hover:text-jarvis-cyan"
                }`}
              >
                <span>{c.title}</span>
                <span className="text-[11px] text-jarvis-dim">
                  {done}/{c.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </GlassPanel>

      <GlassPanel glow className="print-target p-4 sm:p-5 lg:col-span-3">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-bold text-jarvis-cyan text-glow">
              {active.title}
            </h1>
            <p className="text-sm text-jarvis-dim">{active.description}</p>
          </div>
          <PrintButton />
        </div>

        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-jarvis-bg">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jarvis-blue to-jarvis-cyan transition-all"
            style={{
              width: `${
                (active.items.filter((it) => isChecked(active.id, it.id)).length /
                  active.items.length) *
                100
              }%`,
            }}
          />
        </div>

        <ul className="space-y-2">
          {active.items.map((item) => {
            const checked = isChecked(active.id, item.id);
            return (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(active.id, item.id)}
                  className="no-print mt-0.5 accent-cyan-400"
                />
                <span
                  className={
                    checked
                      ? "text-jarvis-green line-through"
                      : "text-jarvis-cyan/90"
                  }
                >
                  {item.text}
                </span>
              </li>
            );
          })}
        </ul>
      </GlassPanel>
    </div>
  );
}
