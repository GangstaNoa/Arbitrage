import GlassPanel from "./GlassPanel";

export default function StatCard({
  label,
  value,
  sub,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "cyan" | "amber" | "red" | "green";
}) {
  const toneText: Record<string, string> = {
    cyan: "text-jarvis-cyan",
    amber: "text-jarvis-amber",
    red: "text-jarvis-red",
    green: "text-jarvis-green",
  };
  return (
    <GlassPanel className="p-4">
      <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl font-bold text-glow ${toneText[tone]}`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-jarvis-dim">{sub}</div>}
    </GlassPanel>
  );
}
