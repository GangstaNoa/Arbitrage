"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { exportAllData, downloadJson } from "@/lib/storage";

const nav = [
  {
    group: "Command",
    items: [
      { href: "/", label: "Dashboard", icon: "◈" },
      { href: "/garage", label: "3D Garage Viewer", icon: "▲" },
      { href: "/engine-bay", label: "Engine Bay", icon: "⚙" },
    ],
  },
  {
    group: "Documentation",
    items: [
      { href: "/manual", label: "Manual Chapters", icon: "📖" },
      { href: "/wires", label: "Wire Labeling", icon: "🔌" },
      { href: "/photos", label: "Photo Notes", icon: "📷" },
    ],
  },
  {
    group: "Databases",
    items: [
      { href: "/torque", label: "Torque Specs", icon: "🔧" },
      { href: "/parts", label: "Parts Database", icon: "🔩" },
      { href: "/tools", label: "Tools Database", icon: "🧰" },
      { href: "/fault-codes", label: "Fault Codes", icon: "⚠" },
    ],
  },
  {
    group: "Project",
    items: [
      { href: "/checklists", label: "Checklists", icon: "☑" },
      { href: "/budget", label: "Budget Tracker", icon: "💰" },
      { href: "/sound-system", label: "Sound System", icon: "🔊" },
      { href: "/coding-diagnostics", label: "Coding & Diagnostics", icon: "💻" },
      { href: "/restoration", label: "Restoration Planner", icon: "✨" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col overflow-y-auto bg-jarvis-panel/80 backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-jarvis-border/60 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-jarvis-cyan/60 shadow-glow">
          <span className="font-display text-lg font-bold text-jarvis-cyan text-glow">
            J
          </span>
        </div>
        <div>
          <div className="font-display text-sm font-bold tracking-widest text-jarvis-cyan text-glow">
            JARVIS X5
          </div>
          <div className="text-[10px] uppercase tracking-widest text-jarvis-dim">
            Garage OS
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 px-3 py-4">
        {nav.map((group) => (
          <div key={group.group}>
            <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-jarvis-dim/80">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-all ${
                      active
                        ? "border-l-2 border-jarvis-cyan bg-jarvis-cyan/10 text-jarvis-cyan text-glow"
                        : "border-l-2 border-transparent text-jarvis-dim hover:border-jarvis-cyan/40 hover:bg-jarvis-cyan/5 hover:text-jarvis-cyan"
                    }`}
                  >
                    <span className="w-4 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="divider-glow" />
      <div className="px-4 py-3">
        <button
          onClick={() =>
            downloadJson(`jarvis-x5-project-export-${Date.now()}.json`, exportAllData())
          }
          className="mb-2 w-full rounded border border-jarvis-cyan/40 px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-jarvis-cyan hover:bg-jarvis-cyan/10 hover:shadow-glow-sm"
        >
          ⬇ Export Project Data
        </button>
        <div className="text-[10px] leading-relaxed text-jarvis-dim">
          2009 BMW X5 E70 xDrive35d
          <br />
          VIN WBAFF01070L319611
          <br />
          <span className="text-jarvis-cyan/80">All data stored locally.</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="no-print fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded border border-jarvis-cyan/50 bg-jarvis-panel/90 text-jarvis-cyan shadow-glow-sm lg:hidden"
        aria-label="Open navigation"
      >
        ☰
      </button>

      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-jarvis-border/60 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-jarvis-border/60 shadow-panel">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded border border-jarvis-border text-jarvis-cyan"
            >
              ✕
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
