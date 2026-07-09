"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import vehicle from "@/data/vehicle.json";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DictKey } from "@/lib/i18n/dictionary";

const titleKeyMap: Record<string, DictKey> = {
  "/": "title.dashboard",
  "/garage": "title.garage",
  "/engine-bay": "title.engineBay",
  "/manual": "title.manual",
  "/wires": "title.wires",
  "/photos": "title.photos",
  "/torque": "title.torque",
  "/parts": "title.parts",
  "/tools": "title.tools",
  "/fault-codes": "title.faultCodes",
  "/checklists": "title.checklists",
  "/budget": "title.budget",
  "/sound-system": "title.soundSystem",
  "/coding-diagnostics": "title.codingDiagnostics",
  "/restoration": "title.restoration",
};

function resolveTitleKey(pathname: string): DictKey {
  if (titleKeyMap[pathname]) return titleKeyMap[pathname];
  const base = "/" + pathname.split("/")[1];
  return titleKeyMap[base] ?? "title.fallback";
}

export default function TopBar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const title = t(resolveTitleKey(pathname));

  return (
    <header className="no-print sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-jarvis-border/50 bg-jarvis-bg/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="ml-8 min-w-0 flex-shrink-0 lg:ml-0">
        <h1 className="font-display text-base font-bold uppercase tracking-widest text-jarvis-cyan text-glow sm:text-lg">
          {title}
        </h1>
        <p className="hidden text-[11px] text-jarvis-dim sm:block">
          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.chassis} ·{" "}
          {vehicle.trim} · {vehicle.engineCode}
        </p>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:flex-initial">
        <div
          className="flex items-center rounded border border-jarvis-border/60 text-[11px] uppercase tracking-wide"
          role="group"
          aria-label={t("lang.toggleLabel")}
        >
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 transition-colors ${
              language === "en"
                ? "bg-jarvis-cyan/15 text-jarvis-cyan"
                : "text-jarvis-dim hover:text-jarvis-cyan"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("fo")}
            className={`px-2 py-1 transition-colors ${
              language === "fo"
                ? "bg-jarvis-cyan/15 text-jarvis-cyan"
                : "text-jarvis-dim hover:text-jarvis-cyan"
            }`}
          >
            FO
          </button>
        </div>
        <SearchBar />
      </div>
    </header>
  );
}
