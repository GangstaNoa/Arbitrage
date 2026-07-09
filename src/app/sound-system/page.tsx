"use client";

import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import soundSystemEn from "@/data/soundSystem.json";
import soundSystemFo from "@/data/soundSystem.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";

export default function SoundSystemPage() {
  const { t } = useLanguage();
  const soundSystem = useLocalizedData(soundSystemEn, soundSystemFo);
  const [selectedTier, setSelectedTier] = useState(soundSystem.tiers[1].id);
  const [currentSystemNotes, setCurrentSystemNotes] = useLocalStorage<string>(
    `${STORAGE_KEYS.chapterNotes}:sound-system`,
    ""
  );
  const tier = soundSystem.tiers.find((tr) => tr.id === selectedTier) ?? soundSystem.tiers[1];

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          {t("soundSystem.currentSystem")}
        </h2>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">{t("soundSystem.headUnit")}</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.headUnit}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">{t("soundSystem.amp")}</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.amp}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-jarvis-dim">{t("soundSystem.speakers")}</dt>
            <dd className="text-jarvis-cyan/85">{soundSystem.currentSystem.speakers}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-jarvis-amber">{soundSystem.currentSystem.notes}</p>
        <textarea
          value={currentSystemNotes}
          onChange={(e) => setCurrentSystemNotes(e.target.value)}
          rows={2}
          placeholder={t("soundSystem.notesPlaceholder")}
          className="mt-3 w-full rounded border border-jarvis-border bg-jarvis-bg/60 p-2 text-sm text-jarvis-cyan/90 focus:border-jarvis-cyan/60 focus:outline-none"
        />
      </GlassPanel>

      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          {t("soundSystem.upgradeTiers")}
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {soundSystem.tiers.map((tr) => (
            <button
              key={tr.id}
              onClick={() => setSelectedTier(tr.id)}
              className={`rounded border px-3 py-2 text-left text-xs transition-colors ${
                selectedTier === tr.id
                  ? "border-jarvis-cyan bg-jarvis-cyan/10 text-jarvis-cyan"
                  : "border-jarvis-border text-jarvis-dim hover:border-jarvis-cyan/40"
              }`}
            >
              <div className="font-semibold">{tr.tier}</div>
              <div className="mt-0.5 text-jarvis-dim">{tr.estimateDkk} DKK</div>
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
            <Row k={t("soundSystem.headUnit")} v={tier.headUnit} />
            <Row k={t("soundSystem.amplifier")} v={tier.amp} />
            <Row k={t("soundSystem.speakers")} v={tier.speakers} />
            <Row k={t("soundSystem.subwoofer")} v={tier.subwoofer} />
          </dl>
          <div className="mt-3 rounded border border-jarvis-border/50 bg-jarvis-bg/40 p-2.5 text-xs text-jarvis-dim">
            <strong className="text-jarvis-cyan/80">{t("soundSystem.wiringNotes")}</strong>{" "}
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
