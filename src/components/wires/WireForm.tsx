"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { generateId, nextConnectorId } from "@/lib/id";
import type { WireCategory, WireLabel, WireStatus } from "@/lib/types";

const categories: WireCategory[] = [
  "sensor",
  "injector",
  "ground",
  "power",
  "vacuum",
  "coolant",
  "fuel",
  "unknown",
];
const statuses: WireStatus[] = ["connected", "disconnected", "unknown"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WireForm({
  existingIds,
  onCreate,
}: {
  existingIds: string[];
  onCreate: (label: WireLabel) => void;
}) {
  const blank = {
    name: "",
    system: "sensor" as WireCategory,
    location: "",
    connectorShape: "",
    wireColors: "",
    connectsTo: "",
    notes: "",
    removalDate: new Date().toISOString().slice(0, 10),
    status: "disconnected" as WireStatus,
  };
  const [form, setForm] = useState(blank);
  const [photoBefore, setPhotoBefore] = useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!form.name.trim()) return;
    const label: WireLabel = {
      id: generateId("WL"),
      connectorId: nextConnectorId(existingIds),
      name: form.name.trim(),
      system: form.system,
      location: form.location.trim(),
      connectorShape: form.connectorShape.trim(),
      wireColors: form.wireColors.trim(),
      connectsTo: form.connectsTo.trim(),
      photoBefore,
      photoAfter,
      notes: form.notes.trim(),
      removalDate: form.removalDate,
      reinstalled: false,
      status: form.status,
      createdAt: new Date().toISOString(),
    };
    onCreate(label);
    setForm(blank);
    setPhotoBefore(null);
    setPhotoAfter(null);
    setOpen(false);
  };

  if (!open) {
    return (
      <GlowButton onClick={() => setOpen(true)}>+ New Connector Label</GlowButton>
    );
  }

  return (
    <div className="space-y-3 rounded border border-jarvis-cyan/40 bg-jarvis-bg/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-jarvis-cyan">
          New Connector — will be assigned {nextConnectorId(existingIds)}
        </h3>
        <button onClick={() => setOpen(false)} className="text-jarvis-dim hover:text-jarvis-red">
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="e.g. MAF sensor connector"
            className="input"
          />
        </Field>
        <Field label="System / Category">
          <select
            value={form.system}
            onChange={(e) =>
              setForm((s) => ({ ...s, system: e.target.value as WireCategory }))
            }
            className="input"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            value={form.location}
            onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
            placeholder="e.g. driver side, near intake"
            className="input"
          />
        </Field>
        <Field label="Connector Shape">
          <input
            value={form.connectorShape}
            onChange={(e) =>
              setForm((s) => ({ ...s, connectorShape: e.target.value }))
            }
            placeholder="e.g. 3-pin black rectangular"
            className="input"
          />
        </Field>
        <Field label="Wire Colors">
          <input
            value={form.wireColors}
            onChange={(e) => setForm((s) => ({ ...s, wireColors: e.target.value }))}
            placeholder="e.g. brown / grey / red"
            className="input"
          />
        </Field>
        <Field label="Connects To">
          <input
            value={form.connectsTo}
            onChange={(e) => setForm((s) => ({ ...s, connectsTo: e.target.value }))}
            placeholder="e.g. DDE main harness pin 42"
            className="input"
          />
        </Field>
        <Field label="Removal Date">
          <input
            type="date"
            value={form.removalDate}
            onChange={(e) => setForm((s) => ({ ...s, removalDate: e.target.value }))}
            className="input"
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) =>
              setForm((s) => ({ ...s, status: e.target.value as WireStatus }))
            }
            className="input"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Photo Before Removal">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) setPhotoBefore(await fileToDataUrl(file));
            }}
            className="input file:mr-2 file:rounded file:border-0 file:bg-jarvis-cyan/20 file:px-2 file:py-1 file:text-jarvis-cyan"
          />
        </Field>
        <Field label="Photo After Removal">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) setPhotoAfter(await fileToDataUrl(file));
            }}
            className="input file:mr-2 file:rounded file:border-0 file:bg-jarvis-cyan/20 file:px-2 file:py-1 file:text-jarvis-cyan"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              rows={2}
              className="input"
            />
          </Field>
        </div>
      </div>
      <GlowButton onClick={submit}>Save Connector Label</GlowButton>
      <p className="text-[10px] text-jarvis-dim">
        Photos are stored locally in your browser (localStorage). Large or many
        photos may exceed browser storage limits — keep images small.
      </p>
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(76, 79, 86, 0.9);
          background: rgba(38, 40, 44, 0.6);
          padding: 0.4rem 0.6rem;
          font-size: 0.8rem;
          color: #f2f3f5;
        }
        .input:focus {
          outline: none;
          border-color: rgba(57, 244, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-jarvis-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
