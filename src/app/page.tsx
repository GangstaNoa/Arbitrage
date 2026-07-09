"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import JarvisAssistantPanel from "@/components/jarvis/JarvisAssistantPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useChecklistState } from "@/hooks/useChecklistState";
import { STORAGE_KEYS } from "@/lib/storage";
import { applyOverlay } from "@/lib/overlay";
import { generateId } from "@/lib/id";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";

import vehicleEn from "@/data/vehicle.json";
import vehicleFo from "@/data/vehicle.fo.json";
import partsBaseEn from "@/data/parts.json";
import partsBaseFo from "@/data/parts.fo.json";
import toolsBaseEn from "@/data/tools.json";
import toolsBaseFo from "@/data/tools.fo.json";
import torqueSpecsEn from "@/data/torqueSpecs.json";
import torqueSpecsFo from "@/data/torqueSpecs.fo.json";
import checklistDefsEn from "@/data/checklists.json";
import checklistDefsFo from "@/data/checklists.fo.json";
import budgetBaseEn from "@/data/budget.json";
import budgetBaseFo from "@/data/budget.fo.json";
import maintenanceLogBaseEn from "@/data/maintenanceLog.json";
import maintenanceLogBaseFo from "@/data/maintenanceLog.fo.json";
import type {
  Part,
  Tool,
  BudgetItem,
  MaintenanceLogEntry,
  WireLabel,
} from "@/lib/types";

export default function DashboardPage() {
  const { t } = useLanguage();
  const vehicle = useLocalizedData(vehicleEn, vehicleFo);
  const partsBase = useLocalizedData(partsBaseEn, partsBaseFo);
  const toolsBase = useLocalizedData(toolsBaseEn, toolsBaseFo);
  const torqueSpecs = useLocalizedData(torqueSpecsEn, torqueSpecsFo);
  const checklistDefs = useLocalizedData(checklistDefsEn, checklistDefsFo);
  const budgetBase = useLocalizedData(budgetBaseEn, budgetBaseFo);
  const maintenanceLogBase = useLocalizedData(maintenanceLogBaseEn, maintenanceLogBaseFo);

  const [partsOverlay] = useLocalStorage<Record<string, Partial<Part>>>(
    STORAGE_KEYS.partsOverlay,
    {}
  );
  const [budgetOverlay] = useLocalStorage<Record<string, Partial<BudgetItem>>>(
    STORAGE_KEYS.budget,
    {}
  );
  const [wireLabels] = useLocalStorage<WireLabel[]>(STORAGE_KEYS.wireLabels, []);
  const [maintenanceLog, setMaintenanceLog] = useLocalStorage<
    MaintenanceLogEntry[]
  >(STORAGE_KEYS.maintenanceLog, maintenanceLogBase as MaintenanceLogEntry[]);
  const { state: checklistState, toggle, isChecked } = useChecklistState();

  const parts = useMemo(
    () => applyOverlay<Part>(partsBase as Part[], partsOverlay),
    [partsBase, partsOverlay]
  );
  const budget = useMemo(
    () => applyOverlay<BudgetItem>(budgetBase as BudgetItem[], budgetOverlay),
    [budgetBase, budgetOverlay]
  );

  const partsNeeded = parts.filter((p) => p.status === "needed").length;
  const partsOrdered = parts.filter((p) => p.status === "ordered").length;
  const partsInstalled = parts.filter((p) => p.status === "installed").length;
  const toolsRequired = (toolsBase as Tool[]).filter((t) => t.required).length;

  const totalEstimate = budget.reduce((sum, b) => sum + b.estimateDkk, 0);
  const totalActual = budget.reduce(
    (sum, b) => sum + (b.actualDkk ?? b.estimateDkk),
    0
  );

  const criticalPartsNeeded = parts.filter(
    (p) => p.priority === "critical" && p.status !== "installed"
  ).length;
  const torqueUnverified = (torqueSpecs as { torqueValue: string }[]).filter(
    (t) => t.torqueValue.startsWith("VERIFY IN BMW TIS")
  ).length;

  const nextTasks = useMemo(() => {
    const tasks: { checklistId: string; itemId: string; checklistTitle: string; text: string }[] =
      [];
    for (const cl of checklistDefs) {
      for (const item of cl.items) {
        if (!checklistState[cl.id]?.[item.id]) {
          tasks.push({ checklistId: cl.id, itemId: item.id, checklistTitle: cl.title, text: item.text });
        }
        if (tasks.length >= 10) break;
      }
      if (tasks.length >= 10) break;
    }
    return tasks;
  }, [checklistState, checklistDefs]);

  const [newLog, setNewLog] = useState({ title: "", details: "", mileageKm: "" });

  const addLogEntry = () => {
    if (!newLog.title.trim()) return;
    const entry: MaintenanceLogEntry = {
      id: generateId("ML"),
      date: new Date().toISOString().slice(0, 10),
      title: newLog.title.trim(),
      details: newLog.details.trim(),
      mileageKm: newLog.mileageKm ? Number(newLog.mileageKm) : null,
    };
    setMaintenanceLog((prev) => [entry, ...prev]);
    setNewLog({ title: "", details: "", mileageKm: "" });
  };

  const warnings: { text: string; tone: "amber" | "red" }[] = [
    {
      text: t("dashboard.torqueUnverifiedWarning").replace("{n}", String(torqueUnverified)),
      tone: "red",
    },
  ];
  if (criticalPartsNeeded > 0) {
    warnings.push({
      text: t("dashboard.criticalPartsWarning").replace("{n}", String(criticalPartsNeeded)),
      tone: "amber",
    });
  }
  if (wireLabels.length === 0) {
    warnings.push({
      text: t("dashboard.noWireLabelsWarning"),
      tone: "amber",
    });
  }

  return (
    <div className="space-y-5">
      <JarvisAssistantPanel />

      {/* Project status */}
      <GlassPanel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
              {t("dashboard.projectStatus")}
            </div>
            <div className="mt-1 font-display text-xl font-bold text-jarvis-cyan text-glow">
              {vehicle.status}
            </div>
            <div className="mt-1 text-sm text-jarvis-dim">
              {t("dashboard.currentPhase")}{" "}
              <span className="text-jarvis-cyan">{vehicle.currentPhase}</span>
            </div>
          </div>
          <StatusBadge tone="cyan">{vehicle.progressPercent}{t("dashboard.percentComplete")}</StatusBadge>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-jarvis-bg">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jarvis-blue to-jarvis-cyan shadow-glow-sm transition-all"
            style={{ width: `${vehicle.progressPercent}%` }}
          />
        </div>
      </GlassPanel>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label={t("dashboard.totalEstCost")} value={`${totalEstimate.toLocaleString()} DKK`} sub={`${t("dashboard.actual")}: ${totalActual.toLocaleString()} DKK`} />
        <StatCard label={t("dashboard.partsNeeded")} value={partsNeeded} tone="amber" />
        <StatCard label={t("dashboard.partsOrdered")} value={partsOrdered} tone="cyan" />
        <StatCard label={t("dashboard.partsInstalled")} value={partsInstalled} tone="green" />
        <StatCard label={t("dashboard.requiredTools")} value={toolsRequired} />
        <StatCard label={t("dashboard.wireLabelsLogged")} value={wireLabels.length} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Next tasks */}
        <GlassPanel className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
              {t("dashboard.next10Tasks")}
            </h2>
            <Link href="/checklists" className="text-xs text-jarvis-dim hover:text-jarvis-cyan">
              {t("dashboard.viewAllChecklists")}
            </Link>
          </div>
          {nextTasks.length === 0 ? (
            <p className="text-sm text-jarvis-dim">{t("dashboard.allTasksComplete")}</p>
          ) : (
            <ul className="space-y-2">
              {nextTasks.map((task, i) => (
                <li
                  key={`${task.checklistId}-${i}`}
                  className="flex items-start gap-2.5 rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-cyan-400"
                    onChange={() => toggle(task.checklistId, task.itemId)}
                  />
                  <div>
                    <div className="text-jarvis-cyan/90">{task.text}</div>
                    <div className="text-[11px] text-jarvis-dim">{task.checklistTitle}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>

        {/* Warnings */}
        <GlassPanel className="p-4">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-red">
            {t("dashboard.warnings")}
          </h2>
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li
                key={i}
                className={`rounded border px-3 py-2 text-xs leading-relaxed ${
                  w.tone === "red"
                    ? "border-jarvis-red/40 bg-jarvis-red/10 text-jarvis-red"
                    : "border-jarvis-amber/40 bg-jarvis-amber/10 text-jarvis-amber"
                }`}
              >
                {w.text}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>

      {/* Maintenance log */}
      <GlassPanel className="p-4">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          {t("dashboard.maintenanceLog")}
        </h2>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            value={newLog.title}
            onChange={(e) => setNewLog((s) => ({ ...s, title: e.target.value }))}
            placeholder={t("dashboard.entryTitlePlaceholder")}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-2 focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <input
            value={newLog.mileageKm}
            onChange={(e) => setNewLog((s) => ({ ...s, mileageKm: e.target.value }))}
            placeholder={t("dashboard.mileagePlaceholder")}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm focus:border-jarvis-cyan/60 focus:outline-none"
          />
          <GlowButton size="sm" onClick={addLogEntry}>
            {t("dashboard.addEntry")}
          </GlowButton>
          <input
            value={newLog.details}
            onChange={(e) => setNewLog((s) => ({ ...s, details: e.target.value }))}
            placeholder={t("dashboard.detailsPlaceholder")}
            className="rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm sm:col-span-4 focus:border-jarvis-cyan/60 focus:outline-none"
          />
        </div>
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {maintenanceLog.map((entry) => (
            <li
              key={entry.id}
              className="rounded border border-jarvis-border/50 bg-jarvis-bg/40 px-3 py-2 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-jarvis-cyan">{entry.title}</span>
                <span className="text-[11px] text-jarvis-dim">
                  {entry.date}
                  {entry.mileageKm ? ` · ${entry.mileageKm.toLocaleString()} km` : ""}
                </span>
              </div>
              {entry.details && (
                <p className="mt-1 text-xs text-jarvis-dim">{entry.details}</p>
              )}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
