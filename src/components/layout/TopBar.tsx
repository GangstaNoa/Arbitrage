"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import vehicle from "@/data/vehicle.json";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/garage": "3D Garage Viewer",
  "/engine-bay": "Interactive Engine Bay",
  "/manual": "Manual Chapters",
  "/wires": "Wire Labeling System",
  "/photos": "Photo Notes",
  "/torque": "Torque Spec Database",
  "/parts": "Parts Database",
  "/tools": "Tools Database",
  "/fault-codes": "Fault Code Library",
  "/checklists": "Checklists",
  "/budget": "Budget Tracker",
  "/sound-system": "Sound System Planner",
  "/coding-diagnostics": "Coding & Diagnostics",
  "/restoration": "Restoration Planner",
};

function resolveTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  const base = "/" + pathname.split("/")[1];
  return titleMap[base] ?? "JARVIS X5 GARAGE OS";
}

export default function TopBar() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="no-print sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-jarvis-border/50 bg-jarvis-bg/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="ml-8 min-w-0 flex-shrink-0 lg:ml-0">
        <h1 className="font-display text-base font-bold uppercase tracking-widest text-jarvis-cyan text-glow sm:text-lg">
          {title}
        </h1>
        <p className="hidden text-[11px] text-jarvis-dim sm:block">
          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.chassis} ·{" "}
          {vehicle.trim} · {vehicle.engineCode}
        </p>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:flex-initial">
        <SearchBar />
      </div>
    </header>
  );
}
