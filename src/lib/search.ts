import chapters from "@/data/chapters.json";
import parts from "@/data/parts.json";
import tools from "@/data/tools.json";
import torqueSpecs from "@/data/torqueSpecs.json";
import faultCodes from "@/data/faultCodes.json";
import type { Chapter, Part, Tool, TorqueSpec, FaultCode, WireLabel } from "@/lib/types";

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
  wireLabels: WireLabel[] = []
): SearchResult[] {
  const q = query.trim();
  if (!q) return [];
  const results: SearchResult[] = [];

  (chapters as Chapter[]).forEach((c) => {
    if (matches(`${c.title} ${c.objective} ${c.category}`, q)) {
      results.push({
        type: "chapter",
        id: c.slug,
        title: c.title,
        subtitle: `Manual · ${c.category}`,
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
        subtitle: `Part · ${p.system}`,
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
        subtitle: `Tool · ${t.purpose}`,
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
        subtitle: `Torque Spec · ${t.torqueValue}`,
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
        subtitle: `Fault Code · ${f.system}`,
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
        subtitle: `Wire Label · ${w.system}`,
        href: `/wires`,
      });
    }
  });

  return results.slice(0, 40);
}
