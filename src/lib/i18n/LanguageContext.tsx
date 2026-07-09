"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { dictionary, type Lang, type DictKey } from "./dictionary";

type LanguageContextValue = {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: DictKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.language);
    if (stored === "en" || stored === "fo") setLanguageState(stored);
  }, []);

  const setLanguage = (lang: Lang) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEYS.language, lang);
  };

  const t = (key: DictKey) => dictionary[key][language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/** Picks between an English and Faroese copy of a static data file based on the active language. */
export function useLocalizedData<T>(en: T, fo: T): T {
  const { language } = useLanguage();
  return language === "fo" ? fo : en;
}
