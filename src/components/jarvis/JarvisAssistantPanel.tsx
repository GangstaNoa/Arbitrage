"use client";

import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import adviceEn from "@/data/jarvisAdvice.json";
import adviceFo from "@/data/jarvisAdvice.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";

export default function JarvisAssistantPanel() {
  const { t } = useLanguage();
  const advice = useLocalizedData(adviceEn, adviceFo);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * advice.length));
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % advice.length);
    }, 9000);
    return () => clearInterval(id);
  }, [advice.length]);

  return (
    <GlassPanel glow className="relative overflow-hidden p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-jarvis-cyan to-transparent" />
      </div>
      <div className="flex items-start gap-3">
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-jarvis-cyan/60">
          <span className="absolute inset-0 animate-pulse-slow rounded-full border border-jarvis-cyan/30" />
          <span className="font-display text-lg font-bold text-jarvis-cyan text-glow">
            J
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-jarvis-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jarvis-green" />
            {t("jarvis.online")}
          </div>
          <p
            key={index}
            className="mt-1.5 animate-flicker text-sm leading-relaxed text-jarvis-cyan/90"
          >
            {advice[index]}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
