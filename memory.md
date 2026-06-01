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
## ✅ Phase 2 Achievements (Completed)

### 1. Mobile-First Responsive Overhaul (`components/mobile/`, `components/map/`)
- **MobileTopBar**: Fixed header containing logo, tour trigger, and theme selector.
- **BottomSheet**: Fixed bottom container with spring snapping. Peek state shows key stats; expanded state displays full control zones.
- **MobileFAB**: Centered floating action button with pulse animation when zero workouts logged to draw user interaction.
- **MapContainer**: Fixed viewport positioning on mobile, rendering perfectly below the topbar and above the bottomsheet peek zone.
- **MapControls**: Zoom, bounds, and locate buttons repositioned to the right vertical center on mobile with 48x48px WCAG-compliant touch targets.
- **Responsive Stacking**: `ControlDeck` stacks filters and sort buttons vertically on mobile to prevent layout overflow.
- **Responsive Metrics**: `WorkoutCard` metrics grid switches to 2x2 layout on mobile and 4-column layout on desktop/tablet.
- **Mobile Workout Form**: Renders as a fixed slide-up bottom sheet modal with full-screen backdrop dims on mobile, and standard inline cards on desktop/tablet.

### 2. Desktop Sidebar Flex Overlap Stabilization (`components/sidebar/Sidebar.tsx`)
- Structured sidebar layout to prevent child bleeding and layout overlapping.
- Applied `flex-shrink: 0` to all static zones and gave `WorkoutFeed` `flex: 1 1 auto + min-height: 0 + overflow-y: auto`, enabling correct list wrapping and scroll behavior inside a nested column.

### 3. Interactive Onboarding Tour (`components/ui/OnboardingTour.tsx`)
- Implemented an 8-step interactive tour detailing the platform's core GIS mechanics, stats, analytics panels, and achievements system.
- Bifurcated layout: Positional tooltip nodes anchored to DOM targets on desktop; animated modal cards sliding up from bottom on mobile.
- Spotlight overlay applied dynamically via high-contrast box shadows.
- Integrated automatic first-visit launch delayed by 800ms and saved preference persistence via localStorage.

### 4. High-Contrast GIS Map tiles (`components/map/MapCore.tsx`)
- Migrated default map tiles to `Stadia Maps Alidade Smooth Dark` for highly legible labels and zero requirement for API keys.
- Applied custom canvas filter overlays inside CSS to boost fallback layers' brightness.### 5. Onboarding Dialog Positioning & Overflow Clamping (`Patch v1.0.3`)
- Implemented robust runtime tooltip height measurement using React `ref` and requestAnimationFrame to avoid flash / layout shifts during transitions.
- Designed dynamic viewport edge collision clamping system (`tourPositioning.ts`) with a 16px safe margin, auto-flipping dialogs vertically when encountering bottom-edge collisions.
- Restructured `OnboardingTour.tsx` steps to reference lightweight system emojis (`iconEmoji`) instead of heavy icon components to simplify render loops.
- Locked dialog boundaries with `max-height` and `overflow-y: auto` safety nets, resolving clipping bugs on smaller desktop screens.
- Added dynamic smooth auto-scroll to focus target elements prior to showing onboarding steps on mobile/tablet viewports.

### 6. Onboarding Tour Replay Execution (`Patch v1.0.4`)
- Implemented `replayOnboarding` action in `uiStore.ts` to reset step counter to `0` and force-activate the tour viewport mask.
- Avoided side-effects to `hasCompletedOnboarding` inside replay action, ensuring auto-start remains cleanly suppressed upon page reloads.
- Wired both desktop and mobile tour help buttons (`?` / `HelpCircle`) in `IdentityBar.tsx` and `MobileTopBar.tsx` to execute `replayOnboarding()`, allowing explicit, infinite user-triggered tour repeats.

---

## ⚠️ Known Limitations / Mitigations

- **Leaflet SSR Warning**: Standard dynamic client-side imports prevent Next.js from throwing node-environment window reference errors on compilation.
- **Zod coercions**: Handled by custom React Hook Form bindings, parsing numbers safely using Zod validation.

---

## ✅ Patch v1.0.6 (Completed — June 1, 2026)

### Fix 1 — Welcome Button Redesign (`components/sidebar/WelcomeBanner.tsx`)
- Created `WelcomeBanner` component (full glowing shimmer CTA for first-visit users).
- Created `TourReplayPill` named export (compact 28px pill for returning users).
- State-aware: banner shown when `!hasCompletedOnboarding`; pill shown when `hasCompletedOnboarding`.
- Wired `TourReplayPill` into `IdentityBar.tsx` (desktop) and `MobileTopBar.tsx` (mobile), replacing raw `HelpCircle` button.
- Added `WelcomeBanner` as first item in `Sidebar.tsx` scroll zone.
- Added `@keyframes welcome-shimmer` + `.welcome-shimmer` class to `globals.css`.

### Fix 2 — Tour Rendering Black Screen (`components/ui/OnboardingTour.tsx`)
- Wrapped entire tour output in `createPortal(_, document.body)` — escapes sidebar `overflow:hidden` / `transform` stacking context that was clipping the fixed-position dialog.
- Added 300ms fallback timer that forces `isPositioned = true` with centered coordinates if `requestAnimationFrame` measurement fails.
- Added `key={step.id}` on both mobile and desktop `motion.div` wrappers — forces Framer Motion remount on each step so entrance animation always fires fresh.
- Removed `visibility` guard on mobile bottom-sheet branch — sheet is always bottom-anchored and needs no measurement delay.
- Added `mounted` SSR guard using `useEffect(() => setMounted(true), [])` before `createPortal` is called.

### Fix 3 — Map Location Search (`components/map/MapSearchPanel.tsx`)
- Created `lib/geocoding.ts` — Nominatim search (OSM, free, no API key required).
- Created `lib/routing.ts` — OSRM route fetch (free public API, returns distance/duration/geometry).
- Created `components/map/MapSearchPanel.tsx`:
  - Dual input panel (start + end) with debounced Nominatim autocomplete (400ms).
  - Inline `SearchInput` and `AutocompleteDropdown` sub-components.
  - Custom Leaflet `divIcon` markers: 🏃 green start, 🏁 amber end.
  - Draws dashed purple `L.polyline` route on map via OSRM geometry.
  - Route summary strip shows distance (km) and a **LOG →** button.
  - Swap button (`ArrowUpDown`) to reverse start/end.
  - Empty-state hint when no input entered.
  - Mounted in `MapCore.tsx` alongside `MapControls`.

---

## ⚠️ Known Limitations / Mitigations

- **Leaflet SSR Warning**: Standard dynamic client-side imports prevent Next.js from throwing node-environment window reference errors on compilation.
- **Zod coercions**: Handled by custom React Hook Form bindings, parsing numbers safely using Zod validation.
- **Nominatim rate limit**: 1 req/s per Nominatim policy — debounce (400ms) + minimum 3-char threshold keeps usage well within limits.

---

## 🎯 Next Steps / Backlog

- [ ] Connect custom domains to Vercel dashboard.
- [ ] Implement local backup export/import (JSON/CSV).
- [ ] Connect Strava coordinate imports.
- [ ] Wire OSRM routing profile (`foot`/`bike`) to selected workout type in the form.

---

*Last updated: June 1, 2026 after successful integration of Patch v1.0.6.*
