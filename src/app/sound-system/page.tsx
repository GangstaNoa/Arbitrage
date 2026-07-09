"use client";

import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import soundSystem from "@/data/soundSystem.json";

export default function SoundSystemPage() {
  const [selectedTier, setSelectedTier] = useState(soundSystem.tiers[1].id);
  const [currentSystemNotes, setCurrentSystemNotes] = useLocalStorage<string>(
    `${STORAGE_KEYS.chapterNotes}:sound-system`,
    ""
  );
  const tier = soundSystem.tiers.find((t) => t.id === selectedTier)!;

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Current System (As Found)
        </h2>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">Head Unit</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.headUnit}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">Amp</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.amp}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">Speakers</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.speakers}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-jarvis-amber">{soundSystem.currentSystem.notes}</p>
        <textarea
          value={currentSystemNotes}
          onChange={(e) => setCurrentSystemNotes(e.target.value)}
          rows={2}
          placeholder="Log what you actually find once you open the trunk trim / doors…"
          className="mt-3 w-full rounded border border-jarvis-border bg-jarvis-bg/60 p-2 text-sm text-jarvis-cyan/90 focus:border-jarvis-cyan/60 focus:outline-none"
        />
      </GlassPanel>

      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          Upgrade Tiers
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {soundSystem.tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`rounded border px-3 py-2 text-left text-xs transition-colors ${
                selectedTier === t.id
                  ? "border-jarvis-cyan bg-jarvis-cyan/10 text-jarvis-cyan"
                  : "border-jarvis-border text-jarvis-dim hover:border-jarvis-cyan/40"
              }`}
            >
              <div className="font-semibold">{t.tier}</div>
              <div className="mt-0.5 text-jarvis-dim">{t.estimateDkk} DKK</div>
            </button>
          ))}
        </div>

        <GlassPanel glow className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-jarvis-cyan text-glow">
              {tier.tier}
            </h3>
            <StatusBadge tone="cyan">{tier.estimateDkk} DKK</StatusBadge>
          </div>
          <dl className="space-y-1.5 text-sm">
            <Row k="Head Unit" v={tier.headUnit} />
            <Row k="Amplifier" v={tier.amp} />
            <Row k="Speakers" v={tier.speakers} />
            <Row k="Subwoofer" v={tier.subwoofer} />
          </dl>
          <div className="mt-3 rounded border border-jarvis-border/50 bg-jarvis-bg/40 p-2.5 text-xs text-jarvis-dim">
            <strong className="text-jarvis-cyan/80">Wiring notes:</strong>{" "}
            {tier.wiringNotes}
          </div>
        </GlassPanel>
      </GlassPanel>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 flex-shrink-0 text-[11px] uppercase text-jarvis-dim">{k}</dt>
      <dd className="text-jarvis-cyan/90">{v}</dd>
    </div>
  );
}
