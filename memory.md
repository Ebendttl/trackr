# TrackR APEX — Project Memory & Progress Log

> **Purpose**: This file is a source of truth for all development decisions, current
> feature state, file structure, known issues, and next steps. It is updated
> every time a meaningful change is made to the project to prevent AI hallucination.

---

## 🌐 Deployment

| Platform | URL | Status |
|---|---|---|
| **Vercel (Primary)** | `trackr-dun.vercel.app` | ✅ Live & Active |

- **Auto-deploy**: Every push to `master` on GitHub → Vercel auto-builds & deploys.
- **Vercel Config**: Root-level Vercel integration built for `trackr-apex/` via `vercel.json` config.
- **Build command**: `npm run build` → outputs to `.next/`.
- **GitHub policy**: **NO automatic git push**. All changes remain local until the user explicitly commands a push.

---

## 📁 Project Structure (APEX)

```
trackr/                          ← repo root
├── trackr-apex/                 ← Next.js 16 Workspace
│   ├── app/                     ← App Router Pages
│   │   ├── docs/                ← Flagship Developer Portal
│   │   ├── globals.css          ← Core design tokens & tailwind styles
│   │   ├── layout.tsx           ← Main HTML shell & SEO tags
│   │   └── page.tsx             ← Mission Control dashboard page
│   ├── components/
│   │   ├── sidebar/             ← Sidebar UI zones 1-8
│   │   ├── workout/             ← Cards, forms & empty states
│   │   ├── map/                 ← Leaflet dynamic map wrapper & components
│   │   ├── docs/                ← Docs navigation sidebars
│   │   └── ui/                  ← Toast, badge, and selector elements
│   ├── stores/                  ← Zustand state managers (workout, map, ui)
│   ├── types/                   ← TypeScript interfaces & Zod schemas
│   ├── lib/                     ← Pure calculations, achievements, and persistence
│   ├── hooks/                   ← Custom client hooks (geolocation, debounce)
│   ├── next.config.ts           ← Suppressed SSR webpack fallbacks
│   ├── vercel.json              ← Secure headers & build commands
│   ├── tsconfig.json            ← Strict type checking configurations
│   └── package.json             ← React 19 / Next 16 dependencies
├── README.md                    ← Root-level platform descriptions
└── memory.md                    ← THIS FILE — project state tracker
```

---

## 🛠️ Tech Stack (APEX)

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 (App Router) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 & custom HSL design tokens |
| **Map Engine** | React-Leaflet v5.0.0 & Leaflet core |
| **State Management**| Zustand v5.0.14 with localStorage persistence |
| **Form Validation** | React Hook Form & Zod v4 validation |
| **Analytics** | Recharts v3.8.1 responsive telemetry |
| **Animations** | Framer Motion v12.40.0 spring nodes |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts — Geist Sans, Geist Mono, DM Serif Display |

---

## ✅ Phase 1 Achievements (Completed)

### 1. Unified Design Tokens (`app/globals.css`)
- Implemented HSL custom CSS variables representing Void, Eclipse, Arctic, and Carbon themes.
- Added smooth background and border transitions.
- Created premium vector animation styles (SVG paths drawing, pulsing map waypoints).

### 2. Strict Telemetry State (`stores/` & `types/`)
- Rebuilt data models inside strict TypeScript types (`Workout`, `Coords`, `WeatherData`, `Achievement`).
- Integrated dynamic `localStorage` caching middleware with browser fallback safety.
- Handled state transitions in Zustand stores: `workoutStore`, `mapStore`, and `uiStore`.

### 3. Leaflet GIS Engine (`components/map/`)
- Dynamic SSR-safe wrapper around map elements (`next/dynamic`).
- Implemented standard and dynamic multi-point routing options.
- Designed flowing neon waypoint dashes and custom gradient-teardrop icons.

### 4. Interactive Sidebar (`components/sidebar/`)
- Stacked 8 bespoke control zones:
  1. **Identity Bar**: Self-drawing SVG brand asset & custom theme switch dropdown.
  2. **Mission Stats**: Aggregate counts featuring spring count-up counters.
  3. **Intelligence Panel**: Three-tab interactive Recharts dashboards.
  4. **Control Deck**: Debounced search and sliding layout filters.
  5. **GPS Operations**: Multi-point routing coordinates trace manager.
  6. **Workout Feed**: Dynamic popout list with card entrance/exit transitions.
  7. **Achievements Panel**: Unlocked badge milestones.
  8. **Footer**: Dangerous clearing toggles with two-tap locks.

### 5. Flagship Developer Portal (`app/docs/`)
- Developed a comprehensive `/docs` portal detailing:
  - System architecture component topology (rendered in pure responsive vector tags).
  - Type structures & Zod validation boundaries.
  - Vercel deployments, configuration values, and contributing rules.
  - Grant Proposal abstract justifying privacy commitments.

---

## ⚠️ Known Limitations / Mitigations

- **Leaflet SSR Warning**: Standard dynamic client-side imports prevent Next.js from throwing node-environment window reference errors on compilation.
- **Zod coercions**: Handled by custom React Hook Form bindings, parsing numbers safely using Zod validation.

---

## 🎯 Next Steps / Backlog

- [ ] Connect custom domains to Vercel dashboard.
- [ ] Implement local backup export/import (JSON/CSV).
- [ ] Connect Strava coordinate imports.

---

*Last updated: May 31, 2026 after successful compilation of Next.js production build.*
