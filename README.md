# JARVIS X5 GARAGE OS

A private, offline-first workshop command center for a **2009 BMW X5 E70 xDrive35d**
(engine M57TU2D30 / 306D5, VIN `WBAFF01070L319611`) undergoing a full engine
replacement after crankshaft/connecting rod bearing failure.

Iron Man / JARVIS-inspired dark HUD UI — cyan glow, glassmorphism panels,
animated dashboard, a 3D garage viewer, an interactive engine bay, a wire
labeling system, and full workshop-manual/database tooling. No backend, no
paid APIs, no accounts — everything runs locally in your browser and all
your data (checklists, wire labels, notes, budget edits, photos) is stored
in **localStorage** on your own device.

> ⚠️ **Safety note:** All torque specs in this app that are safety-critical
> are placeholders marked **"VERIFY IN BMW TIS"**. This software does not
> invent or guess torque values, wiring pinouts, or other safety-critical
> data. Always confirm exact values in BMW TIS/ISTA (or a qualified BMW
> technician) before final assembly.

---

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (custom `jarvis` theme + HUD utilities)
- **Three.js** via **React Three Fiber** + **drei** for the 3D garage viewer
- **localStorage** for all persistence (no database, no server)
- Static **JSON files** as the base data layer (chapters, parts, tools,
  torque specs, fault codes, etc.)

---

## Getting started

Requirements: Node.js 18.18+ (Node 20/22 recommended) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no `.env`
file, no API keys, no external services.

To build and run a production bundle locally:

```bash
npm run build
npm run start
```

Everything you enter (checklists, wire labels, notes, photo placeholders,
budget edits, coding logs, restoration tasks) is saved to your browser's
localStorage under keys prefixed `jarvis-x5-os:`. Nothing leaves your
machine. Use the **"Export Project Data"** button in the sidebar at any
time to download a full JSON backup of everything you've entered.

### Using it on an iPhone in the garage

Run `npm run dev` on a laptop on the same Wi-Fi network as your phone, then
visit `http://<your-laptop-LAN-IP>:3000` from Safari on the iPhone. The UI
is responsive down to phone width, the 3D viewer supports touch
drag/pinch-zoom, and print buttons work from the iPhone's share sheet →
Print if you need a paper copy of a chapter or checklist.

---

## Folder structure

```
src/
  app/                        # Next.js App Router pages
    page.tsx                  # Dashboard
    garage/page.tsx           # 3D Garage Viewer
    engine-bay/page.tsx       # Interactive engine bay schematic
    manual/page.tsx           # Chapter list
    manual/[slug]/page.tsx    # Individual chapter (dynamic route)
    wires/page.tsx            # Wire Labeling System
    torque/page.tsx           # Torque Spec Database
    parts/page.tsx            # Parts Database
    tools/page.tsx            # Tools Database
    fault-codes/page.tsx      # Fault Code Library
    checklists/page.tsx       # Interactive checklists
    photos/page.tsx           # Photo Notes system
    budget/page.tsx           # Budget Tracker
    sound-system/page.tsx     # Sound System Planner
    coding-diagnostics/page.tsx
    restoration/page.tsx      # Exterior/interior restoration planner
    layout.tsx, globals.css   # Root layout + HUD theme

  components/
    layout/                   # Sidebar, TopBar
    ui/                       # GlassPanel, GlowButton, StatCard, SearchBar,
                               # StatusBadge, PrintButton — the HUD kit
    jarvis/                   # JarvisAssistantPanel
    three/                    # CarViewer.tsx (React Three Fiber scene)
    engine-bay/                # Schematic + section detail panel
    manual/                    # ChapterView
    wires/                     # WireForm, WireCard

  data/                        # Static JSON — the base data layer
    vehicle.json, chapters.json, torqueSpecs.json, parts.json, tools.json,
    engineBaySections.json, garageZones.json, faultCodes.json, budget.json,
    checklists.json, soundSystem.json, maintenanceLog.json, jarvisAdvice.json

  lib/                         # storage.ts, search.ts, overlay.ts, id.ts, types.ts
  hooks/                       # useLocalStorage, useChecklistState
```

---

## How the data model works

- **Static JSON files** in `src/data/` are the read-only "factory" data
  (chapters, parts catalog, tool catalog, torque spec table, etc.). Edit
  these files directly and redeploy to change the base content.
- **localStorage "overlays"** hold anything you edit at runtime (part
  status, budget actuals, checklist checkmarks, wire labels, photo notes,
  chapter notes, restoration tasks). See `src/lib/overlay.ts` and
  `src/hooks/useLocalStorage.ts`. This means you can safely update the JSON
  files later without wiping your in-progress checklist/budget state, since
  they're stored separately.

---

## How to add more manual chapters

Open `src/data/chapters.json` and append a new object matching the
`Chapter` type in `src/lib/types.ts`:

```json
{
  "slug": "my-new-chapter",
  "number": 29,
  "title": "My New Chapter",
  "category": "Reference",
  "objective": "...",
  "difficulty": "Intermediate",
  "estimatedTime": "2 hours",
  "tools": ["..."],
  "parts": ["..."],
  "warnings": ["..."],
  "steps": [{ "order": 1, "text": "..." }],
  "checklist": ["..."]
}
```

The chapter list page (`/manual`) and the dynamic route
(`/manual/[slug]`) both read straight from this file — no other code
changes needed. `generateStaticParams` in
`src/app/manual/[slug]/page.tsx` picks up new slugs automatically.

To add torque specs referenced from an Engine Bay section, add a row to
`src/data/torqueSpecs.json` and reference its `id` in the relevant
section's `torqueSpecRefs` array in `src/data/engineBaySections.json`.
**Always use `"VERIFY IN BMW TIS"` for the `torqueValue`/`angle` fields
unless you have personally confirmed the exact spec.**

---

## How to add a real 3D model later

The current 3D Garage Viewer (`src/components/three/CarViewer.tsx`) draws
a stylized, geometry-only SUV (boxes + cylinders) so the app works
out-of-the-box with zero external assets and zero copyrighted content.

To swap in a real model:

1. Get or create a **glTF/GLB** model of an E70-style SUV (no copyrighted
   badges/logos — build your own or use a licensed/generic asset). Place it
   at `public/models/x5.glb`.
2. Install the loader helper (already available via `@react-three/drei`):
   `useGLTF` from `@react-three/drei`.
3. In `CarViewer.tsx`, replace the `<CarBody />` component with something
   like:

   ```tsx
   import { useGLTF } from "@react-three/drei";

   function CarBody() {
     const { scene } = useGLTF("/models/x5.glb");
     return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
   }
   ```

4. Re-check the `garageZones.json` `position` values ([x, y, z] in meters)
   against your model's actual dimensions/origin and adjust so the glowing
   zone markers line up with the real geometry.
5. For an "exploded view" with a real model, either author separate
   named meshes/groups per assembly in your GLB (engine, hood, bumper,
   etc.) and translate each on the `exploded` boolean, or keep the current
   marker-explode behavior (zone markers spread outward) which already
   works with any body mesh.

---

## Wire Labeling System

Every connector you log gets an auto-incrementing ID (`C001`, `C002`, …).
Fields: name, system/category, location, connector shape, wire colors,
connects-to, before/after photos (stored as local data URLs), notes,
removal date, reinstalled checkbox, and status (connected/disconnected/
unknown). Use **Print Labels** to print a sheet you can cut and tape near
each connector, and **Export JSON** to back up your label set.

Photos are stored as base64 in localStorage — browsers cap local storage
around 5–10MB total, so keep photos small/compressed if you're logging a
lot of connectors.

---

## Print / export

Every database and documentation page (chapters, checklists, torque specs,
parts, tools, fault codes, wire labels, budget) has a **Print** button that
prints only that panel's content (via a `.print-target` CSS rule — the
sidebar/nav/chrome are hidden automatically). Most list pages also have an
**Export JSON** button for that dataset, and the sidebar has a global
**Export Project Data** button that downloads everything you've entered
across the whole app as one JSON file.

---

## Customizing the vehicle / project info

Edit `src/data/vehicle.json` (name, VIN, current phase, progress percent,
status text) and `src/data/jarvisAdvice.json` (the rotating assistant tips
shown on the dashboard).
