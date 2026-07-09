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
localStorage under keys prefixed `jarvis-x5-os:`. By default nothing leaves
your machine. Use the **"Export Project Data"** button in the sidebar at any
time to download a full JSON backup of everything you've entered.

### Using it on an iPhone in the garage

Run `npm run dev` on a laptop on the same Wi-Fi network as your phone, then
visit `http://<your-laptop-LAN-IP>:3000` from Safari on the iPhone. The UI
is responsive down to phone width, the 3D viewer supports touch
drag/pinch-zoom, and print buttons work from the iPhone's share sheet →
Print if you need a paper copy of a chapter or checklist.

Note that this LAN-only setup does **not** share data between devices —
your laptop's browser and your phone's browser each have their own
localStorage. See the next section if you want the same checklist/budget/
wire-label data to show up on both.

---

## Optional: deploy it + sync across devices (Supabase)

By default every browser/device has its own local copy of your data. If
you want your PC and phone to see the *same* data — and to reach the app
from a URL instead of running `npm run dev` locally every time — you can
deploy it (e.g. to [Vercel](https://vercel.com)) and back it with a free
[Supabase](https://supabase.com) project. This is entirely optional; with
none of the env vars below set, the app behaves exactly as described above.

1. **Create a Supabase project** (free tier is enough) and open the SQL
   editor. Run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
   to create the single `app_state` table sync uses.
2. **Get your credentials** from Supabase → Project Settings → API:
   the Project URL and the **`service_role`** secret key (not the
   `anon`/public key — the service role key is only ever used server-side
   here and must stay secret).
3. **Choose a passcode and a session secret.** Since the app will now be
   reachable from a public URL instead of just your home Wi-Fi, set
   `APP_PASSCODE` to a PIN/password of your choice, and `APP_SESSION_SECRET`
   to a random string (e.g. `openssl rand -hex 32`). Every device has to
   enter the passcode once; it's then remembered for 30 days via a signed,
   httpOnly cookie.
4. **Set the four env vars** — copy [`.env.example`](./.env.example) to
   `.env.local` for local testing, and add the same four vars in your
   Vercel project's Settings → Environment Variables for the deployed app:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_PASSCODE`,
   `APP_SESSION_SECRET`.
5. **Deploy to Vercel**: push this repo to GitHub, import it at
   [vercel.com/new](https://vercel.com/new), add the env vars, deploy. Visit
   the resulting URL from both your PC and your phone and enter the
   passcode on each.

How it works: none of these env vars are `NEXT_PUBLIC_*`, so the Supabase
credentials never reach the browser. Every read/write still goes through
`localStorage` first (instant, works offline), and in the background the
app mirrors each change to Supabase through its own `/api/state/[key]`
route and polls every ~15s for changes made on another device. If Supabase
or the network is unreachable, everything silently falls back to
local-only behavior — nothing breaks.

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

## 3D Garage Viewer model

`public/models/bmw-x5.glb` is a real glTF car model (converted from an
FBX source the project owner sourced and provided directly — no license
file shipped with it, so if you're forking this repo, confirm you have
rights to redistribute it, or swap it out per the steps below). It's
loaded in `src/components/three/CarViewer.tsx` via `useGLTF` and repainted
at runtime to BMW color 354 "Titanium Silver Metallic" by targeting the
model's `_091614SSUV_bodycolor` material — see `RealCarBody` in that file.

To swap in a different model:

1. Get or create a **glTF/GLB** model of an E70-style SUV and place it at
   `public/models/bmw-x5.glb` (or update `MODEL_URL` in `CarViewer.tsx`).
2. If it has a dedicated "paintable" material (a solid color with no
   texture, often named something like `bodycolor`), update the material
   name check in `RealCarBody`'s traversal to match it, so the Titanium
   Silver repaint still targets the right slot. Otherwise the model will
   render in its own baked-in colors.
3. Re-check the `garageZones.json` `position` values ([x, y, z] in meters)
   against your model's actual dimensions/origin, and the `scale`/`position`
   on the wrapping `<group>` in `RealCarBody`, so the glowing zone markers
   line up with the real geometry and the wheels sit on the grid.
4. True panel-separation "exploded view" isn't wired up for the real model
   (its body is one combined mesh) — only the zone markers spread outward
   in explode mode. To get panel-level explode, author separate named
   meshes/groups per assembly (hood, doors, bumpers) in your GLB and
   translate each on the `exploded` boolean, the way the original
   procedural version did.
5. If `bmw-x5.glb` won't load (e.g. you removed it), `CarViewer` falls back
   to a plain wireframe box via React Suspense — it won't crash the page.

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
