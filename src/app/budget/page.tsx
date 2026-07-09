"use client";

import { useMemo, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";
import PrintButton from "@/components/ui/PrintButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, downloadJson } from "@/lib/storage";
import { applyOverlay } from "@/lib/overlay";
import { generateId } from "@/lib/id";
import budgetBaseEn from "@/data/budget.json";
import budgetBaseFo from "@/data/budget.fo.json";
import { useLanguage, useLocalizedData } from "@/lib/i18n/LanguageContext";
import type { BudgetItem } from "@/lib/types";

export default function BudgetPage() {
  const { t } = useLanguage();
  const budgetBase = useLocalizedData(budgetBaseEn, budgetBaseFo);
  const [overlay, setOverlay] = useLocalStorage<Record<string, Partial<BudgetItem>>>(
    STORAGE_KEYS.budget,
    {}
  );
  const [extraItems, setExtraItems] = useLocalStorage<BudgetItem[]>(
    `${STORAGE_KEYS.budget}:extra`,
    []
  );
  const [newItem, setNewItem] = useState({ category: "", label: "", estimateDkk: "" });

  const items = useMemo(() => {
    const base = applyOverlay<BudgetItem>(budgetBase as BudgetItem[], overlay);
    return [...base, ...applyOverlay<BudgetItem>(extraItems, overlay)];
  }, [budgetBase, overlay, extraItems]);

  const totalEstimate = items.reduce((s, b) => s + b.estimateDkk, 0);
  const totalActual = items.reduce((s, b) => s + (b.actualDkk ?? 0), 0);
  const totalTracked = items.reduce((s, b) => s + (b.actualDkk ?? b.estimateDkk), 0);

  const updateItem = (id: string, patch: Partial<BudgetItem>) =>
    setOverlay((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const addItem = () => {
    if (!newItem.category.trim() || !newItem.label.trim()) return;
    const item: BudgetItem = {
      id: generateId("BX"),
      category: newItem.category.trim(),
      label: newItem.label.trim(),
      estimateDkk: Number(newItem.estimateDkk) || 0,
      actualDkk: null,
      notes: "",
    };
    setExtraItems((prev) => [...prev, item]);
    setNewItem({ category: "", label: "", estimateDkk: "" });
  };

  const removeExtra = (id: string) =>
    setExtraItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <GlassPanel glow className="p-4 text-center">
          <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
            {t("budget.totalEstimate")}
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-jarvis-cyan text-glow">
            {totalEstimate.toLocaleString()} DKK
          </div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
            {t("budget.actualSpent")}
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-jarvis-green">
            {totalActual.toLocaleString()} DKK
          </div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
            {t("budget.runningTotal")}
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-jarvis-amber">
            {totalTracked.toLocaleString()} DKK
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-4">
        <div className="no-print mb-3 flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase text-jarvis-dim">
              {t("budget.category")}
            </label>
            <input
              value={newItem.category}
              onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
              className="w-32 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-jarvis-dim">
              {t("budget.label")}
            </label>
            <input
              value={newItem.label}
              onChange={(e) => setNewItem((s) => ({ ...s, label: e.target.value }))}
              className="w-56 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-jarvis-dim">
              {t("budget.estimateDkk")}
            </label>
            <input
              type="number"
              value={newItem.estimateDkk}
              onChange={(e) =>
                setNewItem((s) => ({ ...s, estimateDkk: e.target.value }))
              }
              className="w-32 rounded border border-jarvis-border bg-jarvis-bg/60 px-2 py-1.5 text-sm"
            />
          </div>
          <GlowButton onClick={addItem}>{t("budget.addLineItem")}</GlowButton>
          <div className="ml-auto flex gap-2">
            <PrintButton />
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => downloadJson(`budget-${Date.now()}.json`, items)}
            >
              ⬇ {t("common.exportJson")}
            </GlowButton>
          </div>
        </div>

        <div className="print-target overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-jarvis-border text-[11px] uppercase tracking-wide text-jarvis-dim">
                <th className="py-2 pr-3">{t("budget.category")}</th>
                <th className="py-2 pr-3">{t("budget.item")}</th>
                <th className="py-2 pr-3">{t("budget.estimate")}</th>
                <th className="py-2 pr-3">{t("budget.actual")}</th>
                <th className="py-2 pr-3">{t("budget.notes")}</th>
                <th className="no-print py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => {
                const isExtra = extraItems.some((i) => i.id === b.id);
                return (
                  <tr key={b.id} className="border-b border-jarvis-border/40 align-top">
                    <td className="py-2 pr-3 text-jarvis-cyan/90">{b.category}</td>
                    <td className="py-2 pr-3">{b.label}</td>
                    <td className="py-2 pr-3">{b.estimateDkk.toLocaleString()} DKK</td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        value={b.actualDkk ?? ""}
                        placeholder="—"
                        onChange={(e) =>
                          updateItem(b.id, {
                            actualDkk: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="no-print w-24 rounded border border-jarvis-border bg-jarvis-bg/70 px-1.5 py-1 text-xs text-jarvis-cyan"
                      />
                      <span className="hidden print:inline">
                        {b.actualDkk != null ? `${b.actualDkk.toLocaleString()} DKK` : "—"}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-jarvis-dim">
                      <input
                        value={b.notes}
                        onChange={(e) => updateItem(b.id, { notes: e.target.value })}
                        className="no-print w-full rounded border border-jarvis-border bg-jarvis-bg/70 px-1.5 py-1 text-xs text-jarvis-cyan/80"
                      />
                      <span className="hidden print:inline">{b.notes}</span>
                    </td>
                    <td className="no-print py-2 pr-3">
                      {isExtra && (
                        <button
                          onClick={() => removeExtra(b.id)}
                          className="text-[11px] text-jarvis-red hover:underline"
                        >
                          {t("budget.delete")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
