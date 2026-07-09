"use client";

import StatusBadge, { statusToTone } from "@/components/ui/StatusBadge";
import type { WireLabel } from "@/lib/types";

export default function WireCard({
  label,
  onUpdate,
  onDelete,
}: {
  label: WireLabel;
  onUpdate: (id: string, patch: Partial<WireLabel>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="break-inside-avoid rounded border border-jarvis-border/60 bg-jarvis-bg/50 p-3 print:border-black print:bg-white print:text-black">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-display text-sm font-bold text-jarvis-cyan text-glow print:text-black print:text-shadow-none">
            {label.connectorId}
          </div>
          <div className="text-sm text-jarvis-cyan/90 print:text-black">{label.name}</div>
        </div>
        <StatusBadge tone={statusToTone(label.status)}>{label.status}</StatusBadge>
      </div>

      <dl className="mt-2 space-y-0.5 text-[11px] text-jarvis-dim print:text-black">
        <Row k="System" v={label.system} />
        <Row k="Location" v={label.location || "—"} />
        <Row k="Shape" v={label.connectorShape || "—"} />
        <Row k="Wire Colors" v={label.wireColors || "—"} />
        <Row k="Connects To" v={label.connectsTo || "—"} />
        <Row k="Removal Date" v={label.removalDate || "—"} />
        {label.notes && <Row k="Notes" v={label.notes} />}
      </dl>

      {(label.photoBefore || label.photoAfter) && (
        <div className="no-print mt-2 grid grid-cols-2 gap-1.5">
          {label.photoBefore && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={label.photoBefore}
              alt="Before removal"
              className="h-16 w-full rounded object-cover"
            />
          )}
          {label.photoAfter && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={label.photoAfter}
              alt="After removal"
              className="h-16 w-full rounded object-cover"
            />
          )}
        </div>
      )}

      <div className="no-print mt-3 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-[11px] text-jarvis-dim">
          <input
            type="checkbox"
            checked={label.reinstalled}
            onChange={(e) => onUpdate(label.id, { reinstalled: e.target.checked })}
            className="accent-cyan-400"
          />
          Reinstalled
        </label>
        <select
          value={label.status}
          onChange={(e) =>
            onUpdate(label.id, { status: e.target.value as WireLabel["status"] })
          }
          className="rounded border border-jarvis-border bg-jarvis-bg/70 px-1.5 py-0.5 text-[11px] text-jarvis-cyan"
        >
          <option value="connected">connected</option>
          <option value="disconnected">disconnected</option>
          <option value="unknown">unknown</option>
        </select>
        <button
          onClick={() => onDelete(label.id)}
          className="text-[11px] text-jarvis-red hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="font-semibold text-jarvis-cyan/70 print:text-black">{k}:</dt>
      <dd className="truncate">{v}</dd>
    </div>
  );
}
