"use client";

import type { EngineBaySection } from "@/lib/types";

type SystemTag = "cooling" | "turbo" | "fuel" | "electrical" | "drivetrain";

const systemColor: Record<SystemTag, string> = {
  cooling: "#2d8fff",
  turbo: "#39f4ff",
  fuel: "#ffb020",
  electrical: "#28ffb0",
  drivetrain: "#a3a6ac",
};

const systemLabel: Record<SystemTag, string> = {
  cooling: "Cooling",
  turbo: "Turbo / Intake",
  fuel: "Fuel",
  electrical: "Electrical",
  drivetrain: "Drivetrain / Mounts",
};

// Maps each interactive section id to a system tag, purely for marker coloring.
const sectionSystem: Record<string, SystemTag> = {
  battery: "electrical",
  "ecu-box": "electrical",
  intake: "turbo",
  "maf-sensor": "turbo",
  "map-sensor": "turbo",
  "glow-plug-controller": "electrical",
  injectors: "fuel",
  "fuel-rail": "fuel",
  turbochargers: "turbo",
  "vacuum-lines": "turbo",
  "coolant-hoses": "cooling",
  radiator: "cooling",
  intercooler: "cooling",
  fan: "cooling",
  "engine-mounts": "drivetrain",
  "transmission-bellhousing": "drivetrain",
  "grounding-straps": "electrical",
  "wiring-harness": "electrical",
};

// Illustrative background silhouettes giving the diagram real shape context —
// approximate positions, not to scale. Rendered under the interactive markers.
function BackgroundShapes() {
  return (
    <>
      {/* Front crash structure / bumper beam */}
      <rect x="22" y="2" width="56" height="2.5" rx="1" fill="#3a3d43" opacity="0.6" />

      {/* Radiator pack */}
      <rect x="24" y="5" width="52" height="7" rx="1.5" fill={systemColor.cooling} opacity="0.16" stroke={systemColor.cooling} strokeWidth="0.4" strokeOpacity="0.5" />
      {/* Intercooler */}
      <rect x="30" y="13" width="40" height="5" rx="1.5" fill={systemColor.turbo} opacity="0.14" stroke={systemColor.turbo} strokeWidth="0.35" strokeOpacity="0.45" />
      {/* Fan shroud */}
      <circle cx="50" cy="23" r="9" fill={systemColor.cooling} opacity="0.08" stroke={systemColor.cooling} strokeWidth="0.3" strokeOpacity="0.3" />

      {/* Coolant hose runs, radiator -> engine block */}
      <path d="M 32 18 Q 30 28, 36 36" fill="none" stroke={systemColor.cooling} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="0" />
      <path d="M 68 18 Q 70 28, 64 36" fill="none" stroke={systemColor.cooling} strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Turbochargers */}
      <circle cx="44" cy="40" r="4.2" fill={systemColor.turbo} opacity="0.18" stroke={systemColor.turbo} strokeWidth="0.4" strokeOpacity="0.5" />
      <circle cx="57" cy="41" r="5.4" fill={systemColor.turbo} opacity="0.18" stroke={systemColor.turbo} strokeWidth="0.4" strokeOpacity="0.5" />

      {/* Vacuum line hints */}
      <path d="M 44 44 L 42 49" stroke={systemColor.turbo} strokeWidth="0.3" strokeDasharray="0.8,0.8" strokeOpacity="0.5" fill="none" />
      <path d="M 57 46 L 46 55" stroke={systemColor.turbo} strokeWidth="0.3" strokeDasharray="0.8,0.8" strokeOpacity="0.5" fill="none" />

      {/* Engine block (dominant central mass) */}
      <rect x="28" y="33" width="44" height="38" rx="4" fill="#3a3d43" opacity="0.5" stroke="#5a5d64" strokeWidth="0.4" />
      <text x="50" y="68" textAnchor="middle" fontSize="2.6" fill="#7c7f86" letterSpacing="0.1">
        M57TU2D30 · 306D5
      </text>

      {/* Wiring harness squiggle across the block */}
      <path
        d="M 40 50 Q 45 46, 50 50 T 60 50"
        fill="none"
        stroke={systemColor.electrical}
        strokeWidth="0.4"
        strokeOpacity="0.5"
      />

      {/* Engine mounts */}
      <rect x="18" y="72" width="7" height="6" rx="1" fill={systemColor.drivetrain} opacity="0.25" stroke={systemColor.drivetrain} strokeWidth="0.35" strokeOpacity="0.5" />
      <rect x="75" y="72" width="7" height="6" rx="1" fill={systemColor.drivetrain} opacity="0.25" stroke={systemColor.drivetrain} strokeWidth="0.35" strokeOpacity="0.5" />

      {/* Grounding strap hint */}
      <path d="M 63 76 L 66 79 L 64 81 L 68 84" fill="none" stroke={systemColor.electrical} strokeWidth="0.35" strokeOpacity="0.5" />

      {/* Transmission bellhousing (tapering toward firewall) */}
      <path
        d="M 38 78 L 62 78 L 56 94 L 44 94 Z"
        fill={systemColor.drivetrain}
        opacity="0.15"
        stroke={systemColor.drivetrain}
        strokeWidth="0.4"
        strokeOpacity="0.45"
      />

      {/* ECU box */}
      <rect x="50" y="83" width="16" height="8" rx="1.2" fill={systemColor.electrical} opacity="0.14" stroke={systemColor.electrical} strokeWidth="0.35" strokeOpacity="0.45" />
      {/* Battery */}
      <rect x="70" y="80" width="16" height="11" rx="1.2" fill={systemColor.electrical} opacity="0.16" stroke={systemColor.electrical} strokeWidth="0.35" strokeOpacity="0.5" />
      <rect x="73" y="79" width="2.2" height="2" fill={systemColor.electrical} opacity="0.6" />
      <rect x="81" y="79" width="2.2" height="2" fill={systemColor.electrical} opacity="0.6" />
    </>
  );
}

export default function EngineBaySchematic({
  sections,
  selectedId,
  onSelect,
}: {
  sections: EngineBaySection[];
  selectedId: string | null;
  onSelect: (section: EngineBaySection) => void;
}) {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-jarvis-border/60 bg-jarvis-bg/60 hud-grid-bg">
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
          {/* Vehicle / engine bay outline with fender arch hints */}
          <rect x="15" y="3" width="70" height="94" rx="10" fill="none" stroke="#4c4f56" strokeWidth="0.6" />
          <path d="M 15 30 Q 8 30, 8 22 Q 8 14, 15 14" fill="none" stroke="#4c4f56" strokeWidth="0.4" opacity="0.6" />
          <path d="M 85 30 Q 92 30, 92 22 Q 92 14, 85 14" fill="none" stroke="#4c4f56" strokeWidth="0.4" opacity="0.6" />
          <line x1="15" y1="76" x2="85" y2="76" stroke="#4c4f56" strokeWidth="0.3" strokeDasharray="1,1.5" />

          <BackgroundShapes />

          <text x="50" y="9.5" textAnchor="middle" fontSize="2.6" fill="#39f4ff" opacity="0.7" letterSpacing="0.15">
            FRONT
          </text>
          <text x="50" y="96" textAnchor="middle" fontSize="2.6" fill="#39f4ff" opacity="0.7" letterSpacing="0.15">
            FIREWALL
          </text>
        </svg>

        {sections.map((s) => {
          const active = s.id === selectedId;
          const tone = systemColor[sectionSystem[s.id] ?? "drivetrain"];
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span
                className="block rounded-full border-2 transition-all"
                style={{
                  width: active ? 16 : 11,
                  height: active ? 16 : 11,
                  borderColor: tone,
                  backgroundColor: active ? tone : `${tone}b3`,
                  boxShadow: active
                    ? `0 0 10px ${tone}, 0 0 3px ${tone}`
                    : `0 0 4px ${tone}80`,
                }}
              />
              <span
                className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded border bg-jarvis-bg/95 px-1.5 py-0.5 text-[9px] opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  borderColor: active ? tone : `${tone}80`,
                  color: tone,
                  opacity: active ? 1 : undefined,
                }}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {(Object.keys(systemLabel) as SystemTag[]).map((tag) => (
          <div key={tag} className="flex items-center gap-1.5 text-[10px] text-jarvis-dim">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: systemColor[tag] }}
            />
            {systemLabel[tag]}
          </div>
        ))}
      </div>
    </div>
  );
}
