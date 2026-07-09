import chaptersEn from "@/data/chapters.json";
import chaptersFo from "@/data/chapters.fo.json";
import partsEn from "@/data/parts.json";
import partsFo from "@/data/parts.fo.json";
import toolsEn from "@/data/tools.json";
import toolsFo from "@/data/tools.fo.json";
import torqueSpecsEn from "@/data/torqueSpecs.json";
import torqueSpecsFo from "@/data/torqueSpecs.fo.json";
import faultCodesEn from "@/data/faultCodes.json";
import faultCodesFo from "@/data/faultCodes.fo.json";
import type { Chapter, Part, Tool, TorqueSpec, FaultCode, WireLabel } from "@/lib/types";
import { dictionary, type Lang } from "@/lib/i18n/dictionary";

export type SearchResultType =
  | "chapter"
  | "part"
  | "tool"
  | "torque"
  | "fault-code"
  | "wire";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

function matches(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query.toLowerCase());
}

export function globalSearch(
  query: string,
  wireLabels: WireLabel[] = [],
  lang: Lang = "en"
): SearchResult[] {
  const q = query.trim();
  if (!q) return [];
  const results: SearchResult[] = [];
  const chapters = lang === "fo" ? chaptersFo : chaptersEn;
  const parts = lang === "fo" ? partsFo : partsEn;
  const tools = lang === "fo" ? toolsFo : toolsEn;
  const torqueSpecs = lang === "fo" ? torqueSpecsFo : torqueSpecsEn;
  const faultCodes = lang === "fo" ? faultCodesFo : faultCodesEn;
  const label = {
    manual: dictionary["search.manual"][lang],
    part: dictionary["search.part"][lang],
    tool: dictionary["search.tool"][lang],
    torqueSpec: dictionary["search.torqueSpec"][lang],
    faultCode: dictionary["search.faultCode"][lang],
    wireLabel: dictionary["search.wireLabel"][lang],
  };

  (chapters as Chapter[]).forEach((c) => {
    if (matches(`${c.title} ${c.objective} ${c.category}`, q)) {
      results.push({
        type: "chapter",
        id: c.slug,
        title: c.title,
        subtitle: `${label.manual} · ${c.category}`,
        href: `/manual/${c.slug}`,
      });
    }
  });

  (parts as Part[]).forEach((p) => {
    if (matches(`${p.name} ${p.system} ${p.notes}`, q)) {
      results.push({
        type: "part",
        id: p.id,
        title: p.name,
        subtitle: `${label.part} · ${p.system}`,
        href: `/parts`,
      });
    }
  });

  (tools as Tool[]).forEach((t) => {
    if (matches(`${t.name} ${t.purpose}`, q)) {
      results.push({
        type: "tool",
        id: t.id,
        title: t.name,
        subtitle: `${label.tool} · ${t.purpose}`,
        href: `/tools`,
      });
    }
  });

  (torqueSpecs as TorqueSpec[]).forEach((t) => {
    if (matches(`${t.component} ${t.fastener} ${t.notes}`, q)) {
      results.push({
        type: "torque",
        id: t.id,
        title: `${t.component} — ${t.fastener}`,
        subtitle: `${label.torqueSpec} · ${t.torqueValue}`,
        href: `/torque`,
      });
    }
  });

  (faultCodes as FaultCode[]).forEach((f) => {
    if (matches(`${f.code} ${f.system} ${f.description}`, q)) {
      results.push({
        type: "fault-code",
        id: f.code,
        title: `${f.code} — ${f.description}`,
        subtitle: `${label.faultCode} · ${f.system}`,
        href: `/fault-codes`,
      });
    }
  });

  wireLabels.forEach((w) => {
    if (matches(`${w.connectorId} ${w.name} ${w.location} ${w.notes}`, q)) {
      results.push({
        type: "wire",
        id: w.id,
        title: `${w.connectorId} — ${w.name}`,
        subtitle: `${label.wireLabel} · ${w.system}`,
        href: `/wires`,
      });
    }
  });

  return results.slice(0, 40);
}
