# TrackR APEX — Flagship GIS Workout Analytics Platform

A world-class, privacy-first physical telemetry console engineered using **Next.js 16 (App Router)**, **TypeScript**, **Zustand**, and **Leaflet.js**. Re-imagined as an offline-first high-performance dashboard, TrackR APEX serves as an alternative to proprietary, surveillance-driven exercise suites.

> **Live Production Console**: [trackr-dun.vercel.app](https://trackr-dun.vercel.app)
> Fully integrated with **Vercel** with secure headers, CD builds, and Turbopack.

---

## 🚀 Key Architectural Improvements (APEX Migration)

- **Framework Migration**: Fully ported from legacy vanilla JS classes to a modern, type-safe **Next.js 16 + React 19** architecture.
- **State Management**: Zero-context transactional hooks powered by **Zustand stores** with automatic `localStorage` persistence middleware.
- **Form Schema Validation**: Strictly validated using **React Hook Form** coupled with custom **Zod schemas**.
- **Interactive Telemetry**: Responsive SVG count-up stats cards and three-tab **Recharts analytics dashboards** (Distance Trend, Activity Split, Pace Trends).
- **Responsive Theme Engine**: Dynamic client toggling between Void, Eclipse, Arctic, and Carbon presets.
- **GIS Route-Drawing**: Precision multi-point Leaflet path tracking with custom pulsing teardrop pins and animated polyline dashed flows.
- **Flagship Developer Portal**: Comprehensive in-app technical reference guide located directly at `/docs`.

---

## 📁 Repository Overview

```
trackr/                          ← Repository Root
├── trackr-apex/                 ← Next.js 16 Workspace
│   ├── app/                     ← Pages & Layouts (page.tsx, layout.tsx, docs/)
│   ├── components/              ← Modular Mission Control UI Panels
│   │   ├── sidebar/             ← Sidebar Zones 1-8
│   │   ├── workout/             ← Cards, forms & inline editors
│   │   ├── map/                 ← Map view wrapper, polyline layers, markers
│   │   └── ui/                  ← Popups, toast systems, selectors
│   ├── stores/                  ← State managers (workoutStore, mapStore, uiStore)
│   ├── types/                   ← TypeScript interfaces & Zod validators
│   ├── lib/                     ← Mathematical calculations & persistence layer
│   ├── hooks/                   ← Custom client hooks (geolocation, debounce)
│   ├── vercel.json              ← Secure serverless settings
│   └── tsconfig.json            ← Strict compiler controls
├── README.md                    ← THIS FILE
└── memory.md                    ← Active project memory & progress log
```

---

## 🛠️ Installation & Setup

Ensure you have **Node.js 18.17.0+** or **20.0.0+** installed.

```bash
# Navigate to the workspace
cd trackr-apex

# Install all required dependencies
npm install

# Start the dev server with live hot-reloads
npm run dev

# Build the optimized production bundle
npm run build
```

Once running, navigate to [http://localhost:3000](http://localhost:3000) to open the console.

---

## 🏅 Gamified Badging (8-Item System)

TrackR APEX features a gamified achievements tracker:

| Badge | Condition |
|---|---|
| 💯 Century Club | Log a total of 100+ km across all sessions |
| ⚡ Speed Demon | Jogging pace ≤ 4.5 min/km or Cycling speed ≥ 30 km/h |
| 🗺️ Explorer | Draw a GPS route featuring 3+ waypoints |
| ❄️ Cold Warrior | Log a workout when the temperature is below 12°C |
| 🌅 Early Bird | Complete a workout before 7:00 AM local time |
| 💧 Hydration Hero | Log 5 or more workouts in a single calendar week |
| 🗓️ Consistent | Log workouts on 3 consecutive calendar days |
| 🌧️ Rain Runner | Log a workout during active rainfall conditions |

---

## 🔒 Privacy & Open Source Justification

TrackR APEX operates fully client-side. Physical telemetry, route maps, notes, and achievement milestones are stored locally in the athlete's browser cache. We enforce zero data monetization, zero third-party analytical integrations, and zero servers.

---

## 🤝 Authors

- **Fakolujo Micheal Ayomide** (`@thefaks_officia` on Twitter)
- **Akinseinde Ebenezer Akindele** (`@Ebendttl` on Twitter)
