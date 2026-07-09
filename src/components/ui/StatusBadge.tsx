function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Tone = "cyan" | "green" | "amber" | "red" | "dim";

const toneClasses: Record<Tone, string> = {
  cyan: "border-jarvis-cyan/50 text-jarvis-cyan bg-jarvis-cyan/10",
  green: "border-jarvis-green/50 text-jarvis-green bg-jarvis-green/10",
  amber: "border-jarvis-amber/50 text-jarvis-amber bg-jarvis-amber/10",
  red: "border-jarvis-red/50 text-jarvis-red bg-jarvis-red/10",
  dim: "border-jarvis-dim/40 text-jarvis-dim bg-jarvis-dim/5",
};

export default function StatusBadge({
  children,
  tone = "cyan",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function statusToTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["installed", "connected", "done", "completed", "active"].includes(s))
    return "green";
  if (["ordered", "in-progress", "planned"].includes(s)) return "cyan";
  if (["needed", "unknown", "issue"].includes(s)) return "amber";
  if (["disconnected", "critical", "overdue"].includes(s)) return "red";
  return "dim";
}
