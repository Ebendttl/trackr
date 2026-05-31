# TRACKR APEX — Antigravity Implementation Prompt
### Complete Specification for a World-Class GIS Workout Analytics Platform

---

> **Context for Antigravity**: You are rebuilding TrackR Elite — a GIS-powered workout tracker currently built with vanilla JS/Leaflet — into a world-class, production-grade **Next.js 14** application (App Router). The existing app logs jogging and biking workouts on a dark map with GPS route drawing, live weather data, Chart.js analytics, and achievement badges. You are not refining it — you are **reinventing it from scratch** with a completely different visual identity, architecture, and feature set. The bar is: someone opens this app and immediately thinks it belongs next to Strava, Arc, and Linear in terms of design quality.

---

## PART 1 — TECH STACK & ARCHITECTURE

### Core Stack
- **Framework**: Next.js 14 (App Router, Server Components where appropriate)
- **Language**: TypeScript (strict mode, no `any`)
- **Styling**: Tailwind CSS v3 + CSS custom properties for the design token system
- **Animation**: Framer Motion v11 for all UI transitions; CSS keyframes for map overlays
- **Map Engine**: `react-leaflet` v4 + Leaflet.js with CartoDB Dark Matter tiles (keep the dark map — it's the soul of the product)
- **Charts**: Recharts (not Chart.js — integrates cleanly with React)
- **State Management**: Zustand v4 (lightweight, DevTools-friendly)
- **Forms**: React Hook Form + Zod for all validation
- **Icons**: Lucide React (consistent, tree-shakeable)
- **Fonts**:
  - Display/Hero: **"DM Serif Display"** — for headings, numbers, workout stats
  - Body/UI: **"Geist"** — clean, modern, Vercel's own font, excellent legibility
  - Monospace/Data: **"JetBrains Mono"** — for metric values, coordinates, pace/speed readouts
- **Persistence**: localStorage with a custom Zustand middleware (same approach, better DX)
- **Weather API**: Open-Meteo (free, no key needed — keep it)
- **Build/Deploy**: Vercel (keep existing CI/CD)
- **Testing**: Vitest + React Testing Library
- **Documentation**: Automatically generated with `typedoc` + a hand-crafted `/docs` route

---

## PART 2 — VISUAL IDENTITY & DESIGN SYSTEM

### Design Philosophy: "Mission Control"
The aesthetic is **precision instrumentation** — think NASA ground control meets elite sports analytics. Every element communicates data with surgical clarity. Dark, authoritative, built for athletes who take their training seriously. Not flashy for the sake of it; impressive because it's *right*.

### Color System — CSS Custom Properties
Define these in `globals.css` and expose them to Tailwind via `theme.extend.colors`:

```css
:root {
  /* Surface hierarchy */
  --surface-void: #020408;        /* Page background — almost black with blue undertone */
  --surface-base: #080d17;        /* Sidebar and primary panels */
  --surface-raised: #0d1525;      /* Cards, elevated containers */
  --surface-overlay: #141e30;     /* Modals, dropdowns, tooltips */
  --surface-glass: rgba(13,21,37,0.75); /* Frosted glass effect */

  /* Accent system — two accent axes */
  --accent-motion: #7c6af7;       /* Purple-indigo — jogging, primary actions */
  --accent-motion-dim: rgba(124,106,247,0.15);
  --accent-motion-glow: rgba(124,106,247,0.35);

  --accent-speed: #00d4c8;        /* Cyan-teal — biking, data highlights */
  --accent-speed-dim: rgba(0,212,200,0.12);
  --accent-speed-glow: rgba(0,212,200,0.3);

  --accent-energy: #f59e0b;       /* Amber — PRs, achievements, warnings */
  --accent-energy-dim: rgba(245,158,11,0.15);

  --accent-life: #22d3ee;         /* Sky blue — weather, live indicators */
  --accent-danger: #ef4444;       /* Red — delete, danger */

  /* Typography */
  --text-primary: #f0f4ff;        /* Slightly blue-white — never pure white */
  --text-secondary: #8892a4;      /* Cool gray */
  --text-tertiary: #4a5568;       /* Dimmed labels */
  --text-accent: #a78bfa;         /* Purple for links, interactive hints */

  /* Border system */
  --border-subtle: rgba(255,255,255,0.04);
  --border-default: rgba(255,255,255,0.08);
  --border-emphasis: rgba(255,255,255,0.16);
  --border-motion: rgba(124,106,247,0.3);
  --border-speed: rgba(0,212,200,0.25);

  /* Glow / Shadow */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.8);
  --shadow-motion: 0 0 20px rgba(124,106,247,0.2), 0 0 60px rgba(124,106,247,0.05);
  --shadow-speed: 0 0 20px rgba(0,212,200,0.2), 0 0 60px rgba(0,212,200,0.05);
  --shadow-float: 0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4);

  /* Metrics */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;
}
```

### Dynamic Theming
Implement a `ThemeProvider` context that allows users to switch between:
1. **Void** (default) — the deep dark system above
2. **Eclipse** — warmer dark, charcoal + copper accents (`--accent-motion: #d97706; --accent-speed: #fb923c`)
3. **Arctic** — cold light mode, white surfaces + ice-blue accents (for outdoor daytime use)
4. **Carbon** — pure black OLED theme, maximum contrast

Persist the selected theme in localStorage. Add a theme selector as a radial menu triggered by clicking a palette icon in the top-right of the sidebar. Animate theme transitions with a 300ms CSS transition on all custom properties using:
```css
*, *::before, *::after {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}
```

---

## PART 3 — LAYOUT ARCHITECTURE

### Overall Layout
**Two-column split** — sidebar left (420px fixed), map right (flex-1). On mobile, stack vertically with map on top (350px) and sidebar below (scrollable).

The sidebar is NOT a boring list panel. It is a **command center** — structured into clear mission zones with intentional visual hierarchy.

### Sidebar Zones (top to bottom)

**Zone 1 — Identity Bar** (60px)
- Logo: a custom SVG icon — a stylised route/path that resolves into a "T" shape. Render it as an animated SVG that draws itself on first load (stroke-dashoffset animation, 800ms).
- Wordmark: "TRACKR" in DM Serif Display, tracking 0.15em, gradient text from `--accent-motion` to `--accent-speed`
- "APEX" badge: monospace caps, 10px, border radius pill, background `--accent-energy-dim`, text `--accent-energy`
- Right side: avatar circle (initials from user's stored name) + theme toggle icon

**Zone 2 — Mission Stats** (auto height)
Three stat cards in a row. Each card:
- Background: `--surface-raised`
- A thin top border in the relevant accent color (3px, full width, `border-radius: 0 0 0 0` at top)
- Large number in JetBrains Mono, 32px, `--text-primary`
- Label in Geist, 10px uppercase tracking-widest, `--text-tertiary`
- Subtle count-up animation when values change (use Framer Motion's `animate` with a spring)
- Cards: 🔥 Workouts | 🗺️ Distance km | ⏱️ Duration min

**Zone 3 — Intelligence Panel** (collapsible)
A Recharts area chart showing the last 7 workouts. Styled to look like a performance telemetry readout:
- Background: `--surface-base` (matches the sidebar — chart floats in the space)
- Grid lines: barely visible (`--border-subtle`)
- Area fill: gradient from `--accent-motion-dim` to transparent
- Line stroke: `--accent-motion`, 2px
- Custom tooltip: dark frosted glass card with workout name + distance + date
- X-axis labels: JetBrains Mono, 10px, `--text-tertiary`
- No Y-axis — cleaner
- Animate the line drawing in on mount using `animationBegin` and `animationDuration`

**Zone 4 — Control Deck** (search + filters)
NOT a boring form. A slick "filter bar" with:
- Search input: `--surface-overlay` background, no visible border until focus (then `--border-motion`), magnifier icon left
- Type toggle: three pill buttons (All / Jogging / Biking) — selected state has the workout-type accent color background at 15% opacity with colored border. NOT a dropdown.
- Sort: a compact icon button that cycles through sort modes on click, showing the current mode as a label

**Zone 5 — GPS Ops Panel** (collapsible)
Redesign the route drawing section. It should look like a mission panel:
- Header: "GPS OPERATIONS" in monospace caps, small tracking
- Two modes clearly shown with status indicators (dot with pulsing ring = active mode)
- "SINGLE POINT" mode and "ROUTE TRACE" mode
- When Route Trace is active: show a live telemetry readout — waypoints count, accumulated distance, a miniaturized polyline preview (SVG rendered within the panel)

**Zone 6 — Workout Feed** (flex-1, scrollable)
This is where workout cards live. Each card is a premium component (see Part 4).

**Zone 7 — Achievements** (collapsible)
Badges panel — redesigned (see Part 5).

**Zone 8 — Footer**
- "Clear All" button: only shows when workouts exist. Styled as a subtle text link with a trash icon, not a big red button. Confirm with a single inline confirmation (text changes to "Are you sure? Tap again" for 3 seconds).
- Copyright: minimal, bottom of sidebar.

---

## PART 4 — WORKOUT CARDS

This is where the magic happens. Workout cards should feel like they were designed by a team who obsesses over Vercel's dashboard and Linear's issue cards.

### Card Structure
```
┌─────────────────────────────────────────────────┐
│ [TYPE ACCENT BAR — 3px left border]             │
│ 🏃 Jogging · May 31                     [✏] [×] │
│ ──────────────────────────────────────────────  │
│  15.3    42:00    185     4'45"                 │
│  km      min      spm     /km                  │
│                                          ⛅ 24° │
│ [GPS Route Badge if applicable]                 │
└─────────────────────────────────────────────────┘
```

### Card Design Specs
- **Background**: `--surface-raised`
- **Border**: 1px `--border-default` on all sides; left border 3px `--accent-motion` (jogging) or `--accent-speed` (biking)
- **Corner radius**: `--radius-lg` (16px)
- **Shadow**: `--shadow-card`
- **Hover**: `transform: translateY(-2px)`, box-shadow adds workout-type glow, border-left glows brighter
- **Transition**: Framer Motion `whileHover` and `whileTap`

### Metric Grid
The 4 stats (distance, duration, cadence/elevation, pace/speed) are displayed in a clean 4-column grid. Each metric:
- **Value**: JetBrains Mono, 22px, `--text-primary`, font-weight 500
- **Unit**: Geist, 9px, uppercase, `--text-tertiary`, letter-spacing 0.1em
- Subtle vertical separator lines between metrics (`--border-subtle`)

### Card Entry Animation
Cards entering the list use Framer Motion `AnimatePresence`:
```
initial: { opacity: 0, x: -20, scale: 0.96 }
animate: { opacity: 1, x: 0, scale: 1 }
exit: { opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.15 } }
```

### Inline Edit Mode
When the pencil is clicked, the card smoothly expands (Framer Motion `layout` prop) to reveal the edit form. The metrics morph into editable inputs in place. "Save" button: accent color. "Cancel": ghost. No modal, no separate page.

### GPS Route Badge
If the workout has a drawn route, show a pill badge: `ROUTE · 3 WAYPOINTS` in monospace, cyan accent. Clicking it focuses the map on that route.

### Weather Badge
Bottom-right of card: `⛅ 24°C` — subtle, frosted glass pill.

---

## PART 5 — ACHIEVEMENTS SYSTEM (REDESIGNED)

Don't show a locked grid. Show an **achievement progress dashboard**:

### Layout
A 2×2 grid of achievement cards. Each card:
- **Locked**: dark surface, icon at 15% opacity, progress bar at 0%, status "LOCKED"
- **Unlocked**: glowing border (workout-type accent), icon at full opacity with drop-shadow, a timestamp "Unlocked May 31", animated confetti on first unlock

### Achievements (keep existing 4, expand to 8)
Add 4 new achievements:
- 🌅 **Early Bird** — Log a workout before 7am (parse date from stored workouts)
- 💧 **Hydration Hero** — Log 5 workouts in a single week
- 🗓️ **Consistent** — Log workouts on 3 consecutive days
- 🌧️ **Rain Runner** — Log a workout when weather code indicates rain

### Unlock Animation
When an achievement unlocks for the first time:
1. The badge card pulses with a glow (CSS `@keyframes` box-shadow animation)
2. A Framer Motion toast notification slides in from the bottom-right: "🏅 Achievement Unlocked: Explorer"
3. The badge icon animates with a scale bounce

---

## PART 6 — MAP EXPERIENCE

The map is the hero. Make it breathtaking.

### Map Styling
- Tile layer: CartoDB Dark Matter (keep it)
- Add a subtle vignette overlay around the map edges using a CSS radial gradient on a pointer-events-none div
- Sidebar border-right: a subtle 1px glowing line using `--border-motion`

### Custom Markers
Redesign markers completely:
- **Jogging**: A glowing purple teardrop marker with a running figure SVG icon inside
- **Biking**: A glowing cyan teardrop marker with a bicycle SVG icon inside
- Both markers pulse with a gentle radial glow animation (CSS keyframes on a pseudo-element)
- On hover: marker scales up 1.15x, popup appears

### Route Polylines
- **Saved routes**: 2.5px solid line in workout accent color, with a subtle outer glow using a wider, more transparent duplicate line beneath
- **Drawing mode (active)**: dashed line, animated dash-offset (the dashes "flow" along the path), color `--accent-motion`
- **Waypoint dots**: small filled circles at each waypoint click

### Map Popups
Dark frosted glass popups:
- Background: `--surface-glass` with `backdrop-filter: blur(12px)`
- Border: 1px `--border-default`
- Left accent bar matching workout type
- Content: workout name, distance, date, weather badge
- A "Fly to route" button if the workout has a drawn route

### Map Controls
- Zoom in/out: custom styled buttons (not default Leaflet) — dark glass, rounded, `--text-primary` icons
- A "Center on me" button with a pulsing ring animation (like the iOS location button)
- A "Fit all workouts" button that calls `map.fitBounds()`

---

## PART 7 — WORKOUT FORM (REDESIGNED)

The form appears when the user clicks on the map. It slides in from the left as a panel overlay ON the sidebar (not replacing the list — it floats above it).

### Form Design
- Background: `--surface-overlay` with `backdrop-filter: blur(16px)`
- Border: 1px `--border-default`
- Shadow: `--shadow-float`
- Corner radius: `--radius-xl`
- Entry animation: Framer Motion, slides in from y: 20, fades in, spring easing

### Form Fields (styled)
Each field:
- Label: 10px uppercase monospace, `--text-tertiary`, tracking-widest
- Input: `--surface-raised` background, no visible border at rest, `--border-motion` focus ring, `--text-primary` text, JetBrains Mono font for number inputs
- The cadence/elevation swap (jogging vs biking) uses a smooth `AnimatePresence` crossfade — NOT a jarring show/hide

### Type Selector
NOT a dropdown. Two large toggle buttons:
```
[🏃 JOGGING]  [🚴 BIKING]
```
The selected one has the workout accent color as background (15% opacity) + colored border. Transition is animated.

### GPS Pre-fill Indicator
When the form opens after using Route Drawing mode, show a status pill:
`📍 GPS ROUTE DETECTED · 4.7 km pre-filled` — subtle animation, auto-dismisses after 4s.

### Submit Button
Full-width, solid accent color background, "LOG WORKOUT →" in caps. On loading (during weather fetch), show a spinner and "FETCHING TELEMETRY..." text. On success, the button briefly shows "✓ LOGGED" before the form closes.

---

## PART 8 — PERFORMANCE DASHBOARD (EXPANDED)

Expand the analytics into a dedicated collapsible panel with three sub-tabs:

### Tab 1 — Distance Trend
Recharts Area chart, last 7 workouts, gradient fill

### Tab 2 — Activity Split
Recharts Pie/Donut chart — jogging vs biking split by distance. Animated on mount. Custom legend.

### Tab 3 — Pace Analysis
Recharts Line chart — pace over all jogging workouts (or speed for biking). Identifies PRs with a star marker on the chart.

### All Charts
- Background: transparent (float in the panel)
- Custom styled tooltips: dark glass card
- Accent colors: `--accent-motion` for jogging data, `--accent-speed` for biking data
- Recharts `ResponsiveContainer` for full width

---

## PART 9 — SEARCH, FILTER & SORT (REFINED)

### Real-time Search
Debounced (300ms) full-text search across workout name, date string, and type. Matching text is highlighted in workout cards using `<mark>` with CSS: `background: --accent-motion-dim; color: --text-accent`.

### Filter Pills
Three pill buttons: "All", "Jogging", "Biking". Jogging pill: purple when active. Biking pill: cyan when active. Animated with Framer Motion `layoutId` for a sliding indicator background (the "magic motion" pill effect that slides between buttons).

### Sort
A compact popover (Framer Motion, scale from origin) with 4 sort options shown as a vertical list.

### Empty State
When no workouts match the filter/search, show a beautiful empty state:
- A subtle SVG illustration of an empty route
- Heading: "No workouts found"
- Body: "Adjust your filters or hit the map to start logging"
- A CTA button: "Clear Filters"

---

## PART 10 — NOTIFICATIONS & FEEDBACK SYSTEM

Build a global toast/notification system using Zustand:

- **Position**: bottom-right, stacked
- **Types**: success (green), info (blue), achievement (amber with badge icon), error (red)
- **Design**: dark glass cards, subtle left border accent, auto-dismiss after 4s
- **Animation**: Framer Motion slide-in from right + fade out

Trigger notifications for:
- New workout logged ("Jogging logged — 15.3 km")
- Achievement unlocked ("🏅 Explorer unlocked!")
- Weather fetch failure ("Weather unavailable — workout saved")
- Form validation errors (inline on fields, not toast)
- Workout deleted ("Workout deleted · Undo" with a 4-second undo button)

---

## PART 11 — DOCUMENTATION (GRANT SUBMISSION QUALITY)

This app needs documentation that would impress a grant committee, an open-source community, and a team of senior engineers simultaneously.

### `/docs` Route
Build a dedicated `/docs` page within the Next.js app. It should be as beautiful as the app itself — same dark theme, same design language. Structure:

```
/docs
  /overview          — What TrackR APEX is, why it exists, who it's for
  /architecture      — System architecture diagram (drawn in SVG, matches the app's style)
  /getting-started   — Installation, environment setup, first run
  /data-model        — TypeScript interface definitions with explanations
  /api-reference     — All functions, hooks, Zustand stores (auto-generated with TypeDoc)
  /features          — Each feature documented with screenshots (use placeholder img tags)
  /configuration     — All environment variables, theme tokens, config options
  /deployment        — Vercel setup, environment variables, CI/CD pipeline
  /contributing      — Code style, PR process, branch naming, commit conventions
  /changelog         — Semantic versioning changelog (v1.0.0 launch entry)
  /roadmap           — Future features: social sharing, Strava sync, AI coaching
  /license           — ISC license with attribution
  /grant-appendix    — Technical specification document suitable for grant applications
```

### Grant Appendix (`/docs/grant-appendix`)
This page renders a beautifully formatted technical document with:
- **Abstract**: 200-word summary of TrackR APEX as an open-source civic technology project for community health
- **Problem Statement**: Why existing workout trackers fail independent athletes (privacy, cost, vendor lock-in)
- **Technical Innovation**: What is architecturally novel (offline-first, privacy-preserving, open data stack)
- **Impact Metrics**: Potential reach, accessibility benefits, open-source ecosystem contribution
- **Architecture Overview**: System diagram (SVG)
- **Technology Justification**: Why each tech choice was made (Next.js for SSR + edge, Leaflet for open maps, Open-Meteo for free weather)
- **Privacy Commitment**: All data stored locally, no accounts, no tracking, no third-party data sales
- **Sustainability Plan**: Open-source maintenance model, community contributions, Vercel free tier
- **Team Credentials**: Brief bios of Micheal Ayomide and Ebenezer Akindele with GitHub and Twitter links
- **Budget Breakdown** (if applicable — leave as a placeholder table)
- **References**: Open-Meteo API documentation, Leaflet.js OSS license, Next.js documentation

### README.md (Rewrite)
The README should be a flagship open-source README. Include:
- Animated GIF placeholder (note where to insert it)
- Badges: Build status, License, Vercel deployment, TypeScript
- Feature highlight table with emojis
- Architecture diagram (Mermaid syntax)
- Full installation guide
- Environment variables table
- Contributing guide with code examples
- Roadmap section
- Screenshots section with placeholder `![alt](screenshot.png)`
- Full credits and acknowledgments

---

## PART 12 — TYPESCRIPT DATA MODEL

Replace vanilla JS classes with strict TypeScript interfaces and Zod schemas:

```typescript
// types/workout.ts

export type WorkoutType = 'jogging' | 'biking';

export interface Coords {
  lat: number;
  lng: number;
}

export interface WeatherData {
  temp: number;
  emoji: string;
  description: string;
  code: number;
}

export interface BaseWorkout {
  id: string;                    // nanoid() — replace Date.now() slice
  type: WorkoutType;
  date: string;                  // ISO string
  coords: Coords;                // Primary click point
  route: Coords[];               // Drawn route waypoints ([] if none)
  distance: number;              // km
  duration: number;              // minutes
  description: string;           // Auto-generated: "Jogging on May 31"
  weather: WeatherData | null;
  notes?: string;                // Optional free text (new feature)
}

export interface JoggingWorkout extends BaseWorkout {
  type: 'jogging';
  cadence: number;               // step/min
  pace: number;                  // min/km
}

export interface BikingWorkout extends BaseWorkout {
  type: 'biking';
  elevationGain: number;         // meters
  speed: number;                 // km/h
}

export type Workout = JoggingWorkout | BikingWorkout;

// Zod schema for form validation
export const joggingSchema = z.object({
  distance: z.number().positive().max(500),
  duration: z.number().positive().max(1440),
  cadence: z.number().positive().min(60).max(300),
});

export const bikingSchema = z.object({
  distance: z.number().positive().max(1000),
  duration: z.number().positive().max(1440),
  elevationGain: z.number().min(0).max(10000),
});
```

---

## PART 13 — ZUSTAND STORE ARCHITECTURE

```typescript
// stores/workoutStore.ts
interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  clearAll: () => void;
  
  // UI state
  activeWorkoutId: string | null;
  setActiveWorkout: (id: string | null) => void;
  pendingDeleteId: string | null;   // for undo functionality
  
  // Filter/Sort state
  filterType: 'all' | 'jogging' | 'biking';
  setFilterType: (type: 'all' | 'jogging' | 'biking') => void;
  sortMode: 'date-desc' | 'date-asc' | 'distance-desc' | 'duration-desc';
  setSortMode: (mode: WorkoutStore['sortMode']) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Computed (derived)
  filteredWorkouts: Workout[];      // derived from workouts + filter + sort + search
  totalStats: { count: number; distance: number; duration: number };
}

// stores/mapStore.ts
interface MapStore {
  drawingMode: boolean;
  toggleDrawingMode: () => void;
  routePoints: Coords[];
  addRoutePoint: (coord: Coords) => void;
  clearRoute: () => void;
  completeRoute: () => void;       // triggers form open with pre-filled distance
  pendingFormCoords: Coords | null;
  setPendingFormCoords: (coords: Coords | null) => void;
}

// stores/uiStore.ts
interface UIStore {
  theme: 'void' | 'eclipse' | 'arctic' | 'carbon';
  setTheme: (theme: UIStore['theme']) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  isFormOpen: boolean;
  setFormOpen: (open: boolean) => void;
  achievementsPanel: boolean;
  analyticsPanel: boolean;
  togglePanel: (panel: 'achievements' | 'analytics') => void;
}
```

---

## PART 14 — ANIMATIONS & MICRO-INTERACTIONS

Every interaction should have intentional motion. Use Framer Motion throughout:

### Page Load Sequence
Staggered entrance animation (controlled with `staggerChildren`):
1. Logo draws itself (SVG stroke-dashoffset, 600ms)
2. Stats cards fade in from below, 50ms apart
3. Analytics panel slides in
4. Controls deck appears
5. Workout cards stagger in from the left
6. Map tiles load (already handled by Leaflet)

### Map Click → Form Open
1. A pulse ring expands from the click point on the map (CSS animation on a Leaflet marker)
2. The form slides in from the bottom of the sidebar (y: 40 → 0, fade in, spring)
3. If route mode is active, the telemetry panel updates live

### Form Submit
1. Button shows loading spinner
2. "FETCHING TELEMETRY..." text animation
3. On success: button turns green momentarily, then form slides out
4. New workout card slides into the list with the `AnimatePresence` animation
5. Stats counters animate up to their new values (Framer Motion `animate` with spring)

### Achievement Unlock
1. Card border pulses (CSS box-shadow animation)
2. Icon bounces (Framer Motion `keyframes` on scale)
3. Toast notification slides in from bottom-right

### Hover States
Every interactive element: cursor pointer, smooth color/opacity transitions (150ms ease-out), no jarring jumps.

---

## PART 15 — ACCESSIBILITY

Build it to WCAG 2.1 AA compliance:
- All interactive elements: focus-visible ring (use CSS `:focus-visible`, not `:focus`)
- Proper ARIA labels on icon-only buttons
- Semantic HTML: `<nav>`, `<main>`, `<aside>`, `<article>` for workout cards
- Keyboard navigation: Tab through all controls, Enter to submit forms, Escape to close
- Reduced motion: wrap all Framer Motion animations in `useReducedMotion()` and provide simplified alternatives
- Color contrast: all text passes 4.5:1 minimum against its background
- Screen reader: map interactions have ARIA live regions announcing "New workout point set at [lat, lng]"

---

## PART 16 — PERFORMANCE

- `next/dynamic` with `{ ssr: false }` for ALL map-related components (Leaflet requires browser)
- Route-based code splitting (App Router handles this automatically)
- `React.memo` on WorkoutCard and MetricDisplay components
- Debounce search input (300ms)
- `useMemo` for filtered/sorted workout list
- Images: none (pure SVG icons) — no image optimization needed
- Fonts: next/font for Geist and JetBrains Mono; Google Fonts CDN for DM Serif Display

---

## PART 17 — PROJECT STRUCTURE

```
trackr-apex/
├── app/
│   ├── layout.tsx                    ← Root layout, ThemeProvider, font setup
│   ├── page.tsx                      ← Main app shell (sidebar + map)
│   ├── globals.css                   ← Design tokens + Tailwind imports
│   └── docs/
│       ├── layout.tsx                ← Docs layout with sidebar nav
│       ├── page.tsx                  ← /docs overview
│       ├── architecture/page.tsx
│       ├── getting-started/page.tsx
│       ├── data-model/page.tsx
│       ├── api-reference/page.tsx
│       ├── features/page.tsx
│       ├── configuration/page.tsx
│       ├── deployment/page.tsx
│       ├── contributing/page.tsx
│       ├── changelog/page.tsx
│       ├── roadmap/page.tsx
│       └── grant-appendix/page.tsx
├── components/
│   ├── sidebar/
│   │   ├── Sidebar.tsx               ← Main sidebar shell
│   │   ├── IdentityBar.tsx           ← Logo + wordmark + theme toggle
│   │   ├── MissionStats.tsx          ← Three stat cards
│   │   ├── IntelligencePanel.tsx     ← Recharts analytics
│   │   ├── ControlDeck.tsx           ← Search + filter pills + sort
│   │   ├── GPSOpsPanel.tsx           ← Route drawing controls
│   │   ├── WorkoutFeed.tsx           ← Scrollable card list
│   │   ├── AchievementsPanel.tsx
│   │   └── Footer.tsx
│   ├── workout/
│   │   ├── WorkoutCard.tsx           ← Individual workout card
│   │   ├── WorkoutForm.tsx           ← Floating form overlay
│   │   ├── MetricDisplay.tsx         ← Reusable metric cell
│   │   ├── InlineEditForm.tsx        ← In-card edit mode
│   │   └── WorkoutEmptyState.tsx
│   ├── map/
│   │   ├── MapContainer.tsx          ← Dynamic import wrapper
│   │   ├── MapCore.tsx               ← react-leaflet setup
│   │   ├── WorkoutMarker.tsx         ← Custom marker component
│   │   ├── RoutePolyline.tsx         ← Saved route renderer
│   │   ├── DrawingPolyline.tsx       ← Active drawing renderer
│   │   └── MapControls.tsx           ← Custom zoom/location buttons
│   ├── ui/
│   │   ├── Toast.tsx                 ← Global notification system
│   │   ├── ThemeSelector.tsx         ← Radial theme menu
│   │   ├── Badge.tsx                 ← Reusable pill badge
│   │   ├── AnimatedCounter.tsx       ← Count-up number animation
│   │   ├── TypeToggle.tsx            ← Jogging/Biking toggle
│   │   ├── FilterPills.tsx           ← Magic motion filter pills
│   │   ├── CollapsiblePanel.tsx      ← Reusable accordion
│   │   └── ConfirmAction.tsx         ← Inline two-tap confirm
│   └── docs/
│       ├── DocLayout.tsx
│       ├── DocNav.tsx
│       └── CodeBlock.tsx             ← Syntax highlighted code blocks
├── hooks/
│   ├── useGeolocation.ts             ← Browser geolocation with error handling
│   ├── useWeather.ts                 ← Open-Meteo API hook
│   ├── useAchievements.ts            ← Achievement evaluation logic
│   ├── useDebounce.ts                ← Search debounce
│   └── useMapRef.ts                  ← Shared Leaflet map instance ref
├── stores/
│   ├── workoutStore.ts
│   ├── mapStore.ts
│   └── uiStore.ts
├── types/
│   ├── workout.ts                    ← All workout types + Zod schemas
│   ├── weather.ts
│   └── achievements.ts
├── lib/
│   ├── calculations.ts               ← Pace, speed, distance math
│   ├── weather.ts                    ← Open-Meteo API client
│   ├── achievements.ts               ← Achievement evaluation logic
│   ├── persistence.ts                ← LocalStorage read/write with type safety
│   ├── wmo-codes.ts                  ← WMO weather code → emoji/description
│   └── route-utils.ts                ← Geodetic distance, route bounding box
├── public/
│   ├── trackr-logo.svg               ← New SVG logo
│   └── og-image.png                  ← Open Graph image
├── styles/
│   └── leaflet-overrides.css         ← Custom Leaflet popup/marker styles
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── typedoc.json
├── vercel.json
├── memory.md                         ← Living dev state tracker (keep this)
└── README.md                         ← Full flagship README
```

---

## PART 18 — IMPLEMENTATION PRIORITIES

Build in this order so you always have a working app:

**Phase 1 — Foundation** (must do first)
1. Next.js setup with TypeScript, Tailwind, all dependencies installed
2. Design token system in `globals.css`
3. Zustand stores (workoutStore, mapStore, uiStore)
4. TypeScript types and Zod schemas
5. Persistence middleware (localStorage)

**Phase 2 — Core Functionality**
6. Map container (dynamic import, CartoDB tiles, geolocation)
7. Map click handler → form open
8. WorkoutForm (both types, React Hook Form + Zod validation)
9. Workout creation logic (weather fetch, calculations, store update)
10. WorkoutCard rendering

**Phase 3 — UI Polish**
11. Sidebar layout: all 8 zones
12. IdentityBar with animated SVG logo
13. MissionStats with count-up animation
14. FilterPills with magic motion indicator
15. WorkoutCard hover states + Framer Motion animations
16. Notification toast system

**Phase 4 — Advanced Features**
17. Route drawing mode (multi-waypoint, live distance, minimap preview)
18. IntelligencePanel (all 3 Recharts tabs)
19. AchievementsPanel (all 8 achievements + unlock animation)
20. Dynamic theming (ThemeProvider + 4 themes)
21. InlineEditForm (in-card edit with Framer Motion layout)
22. Undo delete functionality

**Phase 5 — Documentation**
23. All `/docs` pages
24. Grant Appendix page
25. README rewrite
26. TypeDoc configuration and output

---

## PART 19 — ENVIRONMENT & CONFIGURATION

```env
# .env.local
NEXT_PUBLIC_APP_NAME=TrackR APEX
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
NEXT_PUBLIC_OPEN_METEO_BASE=https://api.open-meteo.com/v1/forecast
NEXT_PUBLIC_DEFAULT_ZOOM=13
NEXT_PUBLIC_ROUTE_LINE_WEIGHT=2.5
```

Expose all of these in a `/docs/configuration` page with a table showing name, type, default, and description.

---

## PART 20 — VERCEL DEPLOYMENT

Update `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## FINAL NOTES FOR ANTIGRAVITY

1. **Never** use `any` in TypeScript — if you're unsure of a type, use `unknown` and narrow it.
2. **Every** new component gets a JSDoc comment block explaining what it does, its props, and any side effects.
3. **Framer Motion** should be used for all transitions — do not mix CSS transitions with Framer Motion on the same property.
4. **The map must be `dynamic` imported** — Leaflet will crash SSR if you don't.
5. **localStorage** must be read inside a `useEffect` or `typeof window !== 'undefined'` guard — Next.js SSR will error otherwise.
6. **Recharts** must be inside a `ResponsiveContainer` — charts without it break on resize.
7. Workout cards in the list must use `AnimatePresence` from Framer Motion so deletions animate correctly.
8. The `useReducedMotion()` hook from Framer Motion must wrap all animation definitions — always respect user preferences.
9. All external API calls (Open-Meteo) must have proper error handling — the app must function even when weather fails.
10. The entire app must be **keyboard navigable** and screen-reader accessible.

**The goal is not a refactor. It is a reimagination.**
Every component, every interaction, every pixel should make someone say:
*"I can't believe this is a free, open-source workout tracker."*

---

*Prompt authored for TrackR APEX — v1.0.0*
*Authors: Fakolujo Micheal Ayomide & Akinseinde Ebenezer Akindele*
*Prompt designed for Antigravity AI implementation*
