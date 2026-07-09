"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { globalSearch, SearchResultType } from "@/lib/search";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { WireLabel } from "@/lib/types";

const typeLabels: Record<SearchResultType, string> = {
  chapter: "📖",
  part: "🔩",
  tool: "🛠",
  torque: "🔧",
  "fault-code": "⚠",
  wire: "🔌",
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [wireLabels] = useLocalStorage<WireLabel[]>(STORAGE_KEYS.wireLabels, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  const results = useMemo(
    () => globalSearch(query, wireLabels, language),
    [query, wireLabels, language]
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded border border-jarvis-border bg-jarvis-bg/70 px-3 py-1.5 focus-within:border-jarvis-cyan/60 focus-within:shadow-glow-sm">
        <span className="text-jarvis-cyan">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t("search.placeholder")}
          className="w-full bg-transparent text-sm text-jarvis-cyan placeholder:text-jarvis-dim focus:outline-none"
        />
      </div>
      {open && query.trim() && (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-y-auto rounded border border-jarvis-border bg-jarvis-panel/95 backdrop-blur-md shadow-panel">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-xs text-jarvis-dim">
              {t("search.noResults")}
            </div>
          ) : (
            results.map((r) => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.href}
                className="flex items-center gap-2 border-b border-jarvis-border/40 px-3 py-2 text-sm hover:bg-jarvis-cyan/10"
              >
                <span>{typeLabels[r.type]}</span>
                <div className="min-w-0">
                  <div className="truncate text-jarvis-cyan">{r.title}</div>
                  <div className="truncate text-[11px] text-jarvis-dim">
                    {r.subtitle}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
