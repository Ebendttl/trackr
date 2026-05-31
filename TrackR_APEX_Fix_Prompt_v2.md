# TRACKR APEX — Follow-Up Implementation Prompt v1.0.2
### Fix: Layout Overlap · Onboarding Tour · Map Label Contrast · **Mobile-First Responsive Design**

> **Context for Antigravity**: This is a follow-up to the TrackR APEX build. The app is running at localhost:3000 and looks good on desktop. Four issues need to be resolved. Do not rebuild anything that is already working correctly on desktop — surgically address what's described below. The biggest new addition is a complete mobile-first responsive overhaul: the screenshots show the mobile view is broken — panels are misaligned, text is misscaled, the map is missing entirely, and the layout is not usable on small screens.

---

## FIX 1 — MOBILE-FIRST RESPONSIVE DESIGN (HIGHEST PRIORITY)

### Problem (from screenshots)
On mobile (375–430px viewport):
- The sidebar panels are misaligned and clipping out of the screen
- The stat cards are too wide and overflow their container
- The filter pills row (`ALL · JOGGING · BIKING · NEWEST`) is getting cut off at the right edge
- The map is completely hidden — users on mobile cannot see the map at all
- Font sizes are too small in some areas (labels) and too large in others (headings)
- The "NO TELEMETRY LOGGED" empty state is overlapping other content
- The layout wastes vertical space with inconsistent padding

### Design Philosophy for Mobile
TrackR APEX on mobile should feel like a **native iOS/Android fitness app** — not a shrunk desktop. Think Strava's mobile app: the map takes center stage, a bottom sheet slides up with workout data, navigation is thumb-friendly. The desktop two-column split (sidebar left, map right) **does not translate to mobile** — it must become a completely different layout paradigm on small screens.

---

### MOBILE LAYOUT ARCHITECTURE

#### Breakpoint Strategy
```css
/* Mobile-first — these are the ONLY breakpoints you need */
/* Default styles = mobile (< 768px) */
/* md: = tablet (768px–1023px) */
/* lg: = desktop (≥ 1024px) */
```

In Tailwind config, ensure:
```typescript
// tailwind.config.ts
screens: {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}
```

#### Root Layout — Mobile vs Desktop

**Mobile (< 768px): Full-screen map + sliding bottom sheet**
```
┌─────────────────────────────┐
│  Top Bar (fixed, 56px)      │  ← Logo + theme toggle + tour button
│─────────────────────────────│
│                             │
│         MAP (flex-1)        │  ← Full screen, takes all remaining height
│    (tap anywhere to log)    │
│                             │
│─────────────────────────────│
│  Bottom Sheet               │  ← Slides up from bottom, draggable
│  (collapsed: 80px peek)     │
│  (expanded: 75vh)           │
└─────────────────────────────┘
```

**Tablet (768px–1023px): Sidebar narrows, map stays visible**
```
┌──────────────┬──────────────┐
│  Sidebar     │              │
│  (320px)     │    MAP       │
│              │              │
└──────────────┴──────────────┘
```

**Desktop (≥ 1024px): Original layout preserved**
```
┌──────────────────┬──────────┐
│  Sidebar (420px) │  MAP     │
└──────────────────┴──────────┘
```

---

### MOBILE TOP BAR

Fixed at the top of the screen on mobile. Height 56px.

```tsx
// components/mobile/MobileTopBar.tsx
// Only rendered on mobile (hidden on md+)

<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 md:hidden"
  style={{ background: 'var(--surface-base)', borderBottom: '1px solid var(--border-subtle)' }}>
  
  {/* Logo + Wordmark */}
  <div className="flex items-center gap-2">
    <AnimatedLogoSVG size={24} />
    <span style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--text-primary)' }}>
      TRACKR
    </span>
    <span className="apex-badge" style={{ fontSize: 9 }}>APEX</span>
  </div>

  {/* Right controls */}
  <div className="flex items-center gap-3">
    <button aria-label="Replay tour">
      <HelpCircle size={18} color="var(--text-secondary)" />
    </button>
    <button aria-label="Change theme">
      <Palette size={18} color="var(--text-secondary)" />
    </button>
    {/* Avatar */}
    <div className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ background: 'var(--accent-motion-dim)', border: '1px solid var(--border-motion)' }}>
      <span style={{ fontSize: 12, color: 'var(--accent-motion)', fontWeight: 600 }}>N</span>
    </div>
  </div>
</header>
```

---

### MOBILE MAP CONTAINER

On mobile, the map fills the entire screen behind the top bar and bottom sheet:

```tsx
// In MapContainer.tsx
<div
  id="map"
  className="fixed inset-0 z-0"
  style={{
    top: '56px',         // Below top bar
    bottom: '80px',      // Above bottom sheet peek height
  }}
/>
```

Map controls (zoom +/−, locate me) move to the **right side** of the map, vertically centered, with larger touch targets (48×48px minimum per WCAG touch target guidelines):

```tsx
// MapControls — mobile version
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 md:hidden">
  <button aria-label="Zoom in" className="map-control-btn" style={{ width: 48, height: 48 }}>
    <Plus size={20} />
  </button>
  <button aria-label="Zoom out" className="map-control-btn" style={{ width: 48, height: 48 }}>
    <Minus size={20} />
  </button>
  <button aria-label="Center on me" className="map-control-btn" style={{ width: 48, height: 48 }}>
    <LocateFixed size={20} />
  </button>
</div>
```

---

### MOBILE BOTTOM SHEET

This is the core mobile UX. The bottom sheet replaces the entire sidebar on mobile. It is draggable and snaps to two states.

```tsx
// components/mobile/BottomSheet.tsx

// Two snap points:
const PEEK_HEIGHT = 80;    // px — shows just the drag handle + quick stats
const EXPANDED_HEIGHT = Math.round(window.innerHeight * 0.75);  // 75vh

// State: 'peek' | 'expanded'
// Drag handle at the top — swipe up to expand, swipe down to collapse
```

**Visual design**:
```css
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: var(--surface-base);
  border-radius: 20px 20px 0 0;
  border-top: 1px solid var(--border-default);
  box-shadow: 0 -8px 40px rgba(0,0,0,0.6), 0 -1px 0 var(--border-subtle);
  touch-action: none;   /* required for drag gestures */
}
```

**Drag handle**:
```tsx
<div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
  onPointerDown={handleDragStart}>
  <div style={{
    width: 36, height: 4, borderRadius: 2,
    background: 'var(--border-emphasis)'
  }} />
</div>
```

**Drag implementation** using Framer Motion `useDragControls` + `useMotionValue`:
```tsx
const y = useMotionValue(0);
const controls = useDragControls();

<motion.div
  drag="y"
  dragControls={controls}
  dragConstraints={{ top: 0, bottom: EXPANDED_HEIGHT - PEEK_HEIGHT }}
  dragElastic={0.1}
  onDragEnd={(_, info) => {
    // Snap to peek or expanded based on velocity + position
    if (info.velocity.y > 300 || info.offset.y > (EXPANDED_HEIGHT - PEEK_HEIGHT) / 2) {
      setSheetState('peek');
    } else {
      setSheetState('expanded');
    }
  }}
  animate={{ y: sheetState === 'peek' ? EXPANDED_HEIGHT - PEEK_HEIGHT : 0 }}
  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
  style={{ y }}
>
```

**Bottom sheet content layout** (from top to bottom when expanded):
```
┌─────────────────────────────┐
│  ━━━  (drag handle)         │
│─────────────────────────────│
│  Stat Cards (horizontal)    │  ← Always visible at peek
│─────────────────────────────│
│  (below only when expanded) │
│  Intelligence Panel         │
│  Search + Filters           │
│  GPS Operations             │
│  Workout Feed               │
│  Achievements               │
│  Footer                     │
└─────────────────────────────┘
```

**In peek state**: Only drag handle + stat cards row visible (80px total). The stat cards use a compact horizontal layout:

```tsx
// Compact stats row for peek state
<div className="flex justify-around px-4 pb-3">
  {[
    { icon: '🔥', value: totalWorkouts, label: 'WORKOUTS' },
    { icon: '🗺️', value: `${totalKm}km`, label: 'DISTANCE' },
    { icon: '⏱️', value: `${totalMin}min`, label: 'DURATION' },
  ].map(stat => (
    <div key={stat.label} className="flex flex-col items-center">
      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
        {stat.label}
      </span>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 16, color: 'var(--text-primary)', fontWeight: 500 }}>
        {stat.value}
      </span>
    </div>
  ))}
</div>
```

**In expanded state**: Full scrollable content. The content area below the stat cards is `overflow-y: auto` with `-webkit-overflow-scrolling: touch` for smooth iOS scroll.

**Log Workout FAB (Floating Action Button)**:
On mobile, instead of clicking the map directly, add a prominent FAB that activates GPS logging mode:

```tsx
// Floating action button — centered at the map bottom, above the bottom sheet peek
<motion.button
  className="fixed z-30 md:hidden"
  style={{
    bottom: PEEK_HEIGHT + 16,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--accent-motion)',
    boxShadow: '0 4px 20px rgba(124,106,247,0.5), 0 0 0 0 rgba(124,106,247,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  }}
  whileTap={{ scale: 0.92 }}
  animate={{
    boxShadow: [
      '0 4px 20px rgba(124,106,247,0.5), 0 0 0 0 rgba(124,106,247,0.3)',
      '0 4px 20px rgba(124,106,247,0.5), 0 0 0 12px rgba(124,106,247,0)',
    ]
  }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
  onClick={activateSinglePointMode}
  aria-label="Log workout"
>
  <Plus size={24} color="white" strokeWidth={2.5} />
</motion.button>
```

The FAB pulses gently when no workouts exist yet to draw attention to it.

---

### MOBILE STAT CARDS

On desktop: 3-column grid, each card is a tall block.
On mobile: horizontal compact row inside the bottom sheet peek (shown above).
On mobile expanded: same compact row — do NOT revert to the tall desktop cards. They waste too much vertical space on mobile.

---

### MOBILE TYPOGRAPHY SCALE

The current mobile rendering has inconsistent font sizes. Apply this corrected scale:

```css
/* globals.css — add after existing :root */
@media (max-width: 767px) {
  html { font-size: 56.25%; }   /* 9px base instead of 10px — prevents overflow */

  /* Identity bar */
  .trackr-wordmark { font-size: 17px; }
  .apex-badge { font-size: 9px; padding: 2px 6px; }

  /* Panel headings */
  .panel-heading { font-size: 11px; letter-spacing: 0.08em; }

  /* Stat values */
  .stat-value { font-size: 15px; }
  .stat-label { font-size: 9px; }

  /* Filter pills */
  .filter-pill { font-size: 11px; padding: 5px 10px; }

  /* Workout cards — on mobile these are full-width */
  .workout-card { padding: 14px 16px; border-radius: 12px; }
  .workout-metric-value { font-size: 18px; }
  .workout-metric-unit { font-size: 8px; }

  /* Search input */
  .search-input { font-size: 14px; height: 40px; }
}
```

---

### MOBILE FILTER PILLS ROW

The current `ALL · JOGGING · BIKING` + `NEWEST` row overflows on mobile because it's trying to fit in a single flex row. Fix:

```tsx
// On mobile: two rows
// Row 1: ALL · JOGGING · BIKING (full width, evenly spaced)
// Row 2: Sort button (right-aligned)

<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
  {/* Type filter pills */}
  <div className="flex w-full">
    {['ALL', 'JOGGING', 'BIKING'].map(type => (
      <button key={type}
        className="flex-1 py-2 text-xs font-semibold tracking-wider transition-all"
        style={{
          background: activeFilter === type.toLowerCase()
            ? type === 'JOGGING' ? 'var(--accent-motion-dim)' : 'var(--accent-speed-dim)'
            : 'transparent',
          color: activeFilter === type.toLowerCase()
            ? type === 'JOGGING' ? 'var(--accent-motion)' : 'var(--accent-speed)'
            : 'var(--text-tertiary)',
          border: '1px solid',
          borderColor: activeFilter === type.toLowerCase()
            ? type === 'JOGGING' ? 'var(--border-motion)' : 'var(--border-speed)'
            : 'var(--border-subtle)',
          borderRadius: 8,
        }}>
        {type}
      </button>
    ))}
  </div>

  {/* Sort — right-aligned on its own row on mobile */}
  <div className="flex justify-end">
    <SortPopover />
  </div>
</div>
```

---

### MOBILE WORKOUT CARDS

On mobile, cards are full-width and slightly more compact. The metric grid changes from 4 columns to 2×2:

```tsx
// Mobile: 2×2 grid instead of 4 columns
<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
  <MetricDisplay value={workout.distance} unit="km" icon="📍" />
  <MetricDisplay value={workout.duration} unit="min" icon="⏱️" />
  {workout.type === 'jogging'
    ? <MetricDisplay value={workout.cadence} unit="spm" icon="👟" />
    : <MetricDisplay value={workout.elevationGain} unit="m↑" icon="⛰️" />
  }
  <MetricDisplay value={workout.type === 'jogging' ? workout.pace : workout.speed}
    unit={workout.type === 'jogging' ? '/km' : 'km/h'} icon="⚡" />
</div>
```

---

### MOBILE WORKOUT FORM

On mobile, the workout form becomes a **modal bottom sheet** that slides up from the very bottom of the screen (above the keyboard):

```tsx
// MobileWorkoutForm.tsx
// Triggers when user taps the FAB or taps the map

<AnimatePresence>
  {isFormOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 md:hidden"
        style={{ background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeForm}
      />

      {/* Form sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'var(--surface-overlay)',
          borderRadius: '20px 20px 0 0',
          border: '1px solid var(--border-default)',
          padding: '20px 20px 40px',   /* 40px bottom padding for iPhone home bar */
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-4">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-emphasis)' }} />
        </div>

        {/* Form content — same fields, but stacked vertically in single column */}
        {/* TypeToggle, then Distance, Duration, Cadence/Elevation in single column */}
        {/* Submit button: full-width, 52px height, easy thumb target */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

All form inputs on mobile must have `font-size: 16px` minimum — below 16px causes iOS Safari to auto-zoom the page on input focus, which is disorienting.

```css
/* Prevent iOS zoom on input focus */
@media (max-width: 767px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
```

---

### MOBILE ONBOARDING TOUR (Mobile-Adapted)

The desktop onboarding uses `getBoundingClientRect()` tooltips beside elements. On mobile, replace positional tooltips with **full-screen step cards** that slide in from the bottom — same content, different presentation:

```tsx
// On mobile: steps appear as bottom sheet cards (not floating tooltips)
// The backdrop dims everything, the step card slides up from the bottom

// Mobile step card: 
// - Fixed at bottom of screen
// - Slides up with spring animation
// - Same content (icon, title, body, progress dots, controls)
// - For steps that highlight an element: the element gets the spotlight box-shadow
//   and the card appears at the bottom

<motion.div
  className="fixed bottom-0 left-0 right-0 z-[10000] md:hidden"
  style={{
    background: 'var(--surface-overlay)',
    borderRadius: '20px 20px 0 0',
    border: '1px solid var(--border-emphasis)',
    padding: '24px 24px 40px',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,106,247,0.2)',
  }}
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
>
  {/* Same inner content as desktop tooltip */}
  {/* But with larger touch targets for Prev/Next buttons: min 48px height */}
</motion.div>
```

For the map step (Step 6) on mobile: since the map fills the full screen, briefly animate the bottom sheet to close, show the map with a pulsing circle overlay in the center, then show the step card from the bottom after 300ms.

---

### TABLET RESPONSIVE (768px–1023px)

The sidebar narrows to 320px. Stat cards shrink but remain in 3-column grid. All font sizes scale down by ~10%. The map remains visible. No bottom sheet — the desktop sidebar layout is used but compressed.

```css
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar { flex-basis: 320px; width: 320px; padding: 1.5rem 1.8rem; }
  .stat-value { font-size: 18px; }
  .workout-metric-value { font-size: 16px; }
  .panel-heading { font-size: 11px; }
}
```

---

### TOUCH INTERACTIONS

All clickable/tappable elements on mobile must meet these requirements:
- Minimum tap target: **48×48px** (use padding to expand the tappable area without affecting visual size)
- Active state: brief scale-down feedback (`transform: scale(0.96)`, 100ms) using Framer Motion `whileTap`
- No hover-only states — on mobile, hover states must double as focus states
- Swipe gestures: the workout list supports swipe-left to reveal delete button (use Framer Motion `drag="x"` with `dragConstraints`)

```tsx
// Swipe-to-delete on workout cards (mobile only)
<motion.div
  drag="x"
  dragConstraints={{ left: -80, right: 0 }}
  dragElastic={0.1}
  className="relative md:drag-none"
>
  <WorkoutCardContent />
  {/* Revealed on swipe-left: */}
  <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center"
    style={{ background: 'var(--accent-danger)' }}>
    <Trash2 size={20} color="white" />
  </div>
</motion.div>
```

---

### MOBILE-SPECIFIC CSS UTILITIES

Add these to `globals.css`:

```css
/* Safe area insets — critical for iPhone with home bar */
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-top { padding-top: env(safe-area-inset-top); }

/* Bottom sheet and FAB must respect the safe area */
.bottom-sheet { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
.mobile-fab { bottom: calc(80px + 16px + env(safe-area-inset-bottom)); }

/* Prevent scroll bounce on iOS (body level) */
body { overscroll-behavior: none; }

/* Full viewport height that accounts for mobile browser UI */
.full-dvh { height: 100dvh; }   /* dvh = dynamic viewport height, avoids mobile browser bar issues */
```

---

### RESPONSIVE COMPONENT MATRIX

This table summarizes what changes at each breakpoint for every major component:

| Component | Mobile (<768px) | Tablet (768–1023px) | Desktop (≥1024px) |
|---|---|---|---|
| Root layout | Stacked: topbar + fullscreen map + bottom sheet | Two-column: narrow sidebar + map | Two-column: 420px sidebar + map |
| Sidebar | **Hidden** — replaced by bottom sheet | Visible, 320px | Visible, 420px |
| Top bar | **Visible** (fixed, 56px) | Hidden | Hidden |
| Bottom sheet | **Visible** (peek 80px / expanded 75vh) | Hidden | Hidden |
| Stat cards | Horizontal compact row in bottom sheet | 3-col grid, compact | 3-col grid, full |
| Workout cards | Full-width, 2×2 metric grid | Full-width, 4-col metric grid | Full-width, 4-col metric grid |
| Filter pills | Two rows (type row + sort row) | Single row | Single row |
| Workout form | Modal bottom sheet, single column | Sidebar panel | Sidebar panel overlay |
| Map controls | Right side, 48px touch targets | Right side, 40px | Right side, 36px |
| FAB (+) | **Visible** (centered above bottom sheet) | Hidden | Hidden |
| Onboarding | Bottom sheet step cards | Desktop tooltips | Desktop tooltips |
| Swipe-to-delete | **Active** on workout cards | Disabled | Disabled |

---

## FIX 2 — SIDEBAR LAYOUT OVERFLOW & OVERLAPPING SECTIONS (DESKTOP)

### Problem
The sidebar panels (Intelligence Panel, GPS Operations, Achievements, Footer) are overlapping each other instead of stacking cleanly.

### Root Cause
Missing `min-height: 0` on the workout feed flex child, and `max-height` CSS transitions on collapsible panels that bleed into siblings.

### Fix Specification

**Sidebar container**:
```css
display: flex;
flex-direction: column;
height: 100vh;
height: 100dvh;   /* fallback for mobile too */
overflow-y: auto;
overflow-x: hidden;
scroll-behavior: smooth;
scrollbar-width: thin;
scrollbar-color: rgba(124,106,247,0.3) transparent;
```

**Collapsible panels** — replace ALL `max-height` CSS transitions with Framer Motion:
```tsx
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      key="panel-content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

**Workout Feed**:
```css
flex: 1 1 auto;
min-height: 0;       /* THE critical fix */
overflow-y: auto;
```

**Footer**: `flex-shrink: 0; margin-top: auto;` — scrolls with content, not sticky.

**Verified flex column order**:
```
sidebar (flex col, 100dvh, overflow-y: auto)
  ├── IdentityBar        (flex-shrink: 0)
  ├── MissionStats       (flex-shrink: 0)
  ├── IntelligencePanel  (flex-shrink: 0) ← Framer Motion height
  ├── ControlDeck        (flex-shrink: 0)
  ├── GPSOpsPanel        (flex-shrink: 0) ← Framer Motion height
  ├── WorkoutFeed        (flex: 1 1 auto, min-height: 0, overflow-y: auto)
  ├── AchievementsPanel  (flex-shrink: 0) ← Framer Motion height
  └── Footer             (flex-shrink: 0, margin-top: auto)
```

---

## FIX 3 — ONBOARDING TOUR

### Overview
Step-by-step first-visit tour. 8 steps. Auto-triggers on first load (800ms delay). Persistent "replay" button in the header.

Add to `uiStore.ts`:
```typescript
hasCompletedOnboarding: boolean;   // persisted in localStorage
isOnboardingActive: boolean;
currentOnboardingStep: number;
startOnboarding: () => void;
nextStep: () => void;
prevStep: () => void;
skipOnboarding: () => void;
completeOnboarding: () => void;
```

### The 8 Steps
```typescript
const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TrackR APEX',
    body: 'Your personal mission control for every run and ride. Built for athletes who take their training seriously. Let\'s show you around — it only takes 60 seconds.',
    target: 'center',
    position: 'center',
    icon: 'Zap',
  },
  {
    id: 'stats',
    title: 'Your Command Center',
    body: 'Your total workouts, distance, and duration update here in real-time every time you log a session. Watch these numbers grow.',
    target: '.mission-stats',
    position: 'bottom',   // on mobile: always bottom sheet card
    icon: 'BarChart3',
  },
  {
    id: 'intelligence',
    title: 'Performance Intelligence',
    body: 'Tap any tab to visualize your distance trends, activity split, or pace evolution over time.',
    target: '.intelligence-panel',
    position: 'bottom',
    icon: 'TrendingUp',
  },
  {
    id: 'filters',
    title: 'Find Any Workout Instantly',
    body: 'Search by name, filter by type, or sort by distance and duration. The filter pills update your list in real-time.',
    target: '.control-deck',
    position: 'bottom',
    icon: 'SlidersHorizontal',
  },
  {
    id: 'gps',
    title: 'GPS Logging Modes',
    body: 'Two ways to log: tap anywhere on the map for a single-location workout, or activate Route Trace to draw your exact path.',
    target: '.gps-ops-panel',
    position: 'bottom',
    icon: 'Route',
  },
  {
    id: 'map',
    title: 'Your Training Ground',
    body: 'This is where it all happens. Tap anywhere on the map to pin a workout location. Your routes appear as glowing trail lines.',
    target: '#map',
    position: 'center',
    icon: 'Map',
  },
  {
    id: 'achievements',
    title: 'Unlock Achievements',
    body: 'Hit milestones to unlock badges — from the Century Club (100km total) to the Cold Warrior (training below 12°C).',
    target: '.achievements-panel',
    position: 'bottom',
    icon: 'Trophy',
  },
  {
    id: 'finish',
    title: "You're Ready. Let's Go.",
    body: 'Tap anywhere on the map (or hit the + button on mobile) to log your first workout. Your first entry is waiting.',
    target: 'center',
    position: 'center',
    icon: 'Play',
  },
];
```

### Spotlight Effect
```css
/* Applied dynamically to the target element */
.onboarding-spotlight {
  box-shadow: 0 0 0 9999px rgba(2, 4, 8, 0.85) !important;
  border-radius: 12px;
  position: relative;
  z-index: 9999;
  pointer-events: none;
}
```

### Tooltip Card (Desktop)
```tsx
<motion.div
  className="fixed z-[10000] hidden md:block"
  style={{ width: 320, /* positioned via getBoundingClientRect() */ }}
  initial={{ opacity: 0, scale: 0.92, y: 8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
>
  {/* Icon circle + title + body + progress pills + Prev/Next/Skip */}
</motion.div>
```

### Progress Indicator (expanding pill dots)
```tsx
{steps.map((_, i) => (
  <motion.div
    key={i}
    animate={{ width: i === currentStep ? 20 : 6 }}
    style={{
      height: 6, borderRadius: 3,
      background: i === currentStep
        ? 'var(--accent-motion)'
        : i < currentStep ? 'rgba(124,106,247,0.4)' : 'var(--border-default)',
    }}
    transition={{ duration: 0.3 }}
  />
))}
```

### Controls Row
- Left: "SKIP TOUR" text button (12px, `--text-tertiary`)
- Right: Back (ghost) + Next/Finish (accent filled on last step)
- All buttons: min 48px height on mobile, 36px on desktop

### Replay Button
Small `?` icon in `IdentityBar` and `MobileTopBar`. On click: `setCurrentStep(0); setOnboardingActive(true)`.

---

## FIX 4 — MAP LABEL CONTRAST

Switch to **Stadia Maps Alidade Smooth Dark** — near-white labels, no API key required:

```typescript
// In MapCore.tsx
L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
  {
    attribution: '© Stadia Maps © OpenMapTiles © OpenStreetMap',
    maxZoom: 20,
  }
).addTo(map);
```

```env
# .env.local
NEXT_PUBLIC_MAP_TILE_URL=https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
```

If Stadia is unavailable, fallback to CartoDB two-layer approach:
```typescript
// Base (no labels)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { ... }).addTo(map);
// Labels only (brightness-boosted via CSS)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
  { pane: 'overlayPane' }).addTo(map);
// In CSS: .leaflet-overlay-pane img { filter: brightness(2.2) contrast(1.1); }
```

---

## IMPLEMENTATION ORDER

1. **Fix 1 (Mobile)** — Start with the root layout restructure. Add `MobileTopBar`, `BottomSheet`, and `MobileWorkoutForm` components. Update `MapContainer` with mobile positioning. Add the FAB. Fix the filter pills row. Update the responsive CSS. This is the biggest change but must come first since onboarding positioning depends on the final layout.

2. **Fix 4 (Map Labels)** — One-line tile URL swap. Zero risk.

3. **Fix 2 (Desktop Layout Overlap)** — Fix the sidebar flex stack. Confirm panels stack without overlapping on both desktop and tablet.

4. **Fix 3 (Onboarding Tour)** — Implement last. The mobile version uses bottom sheet cards. The desktop version uses positional tooltips. Both use the same step data array.

---

## WHAT NOT TO CHANGE

- Existing WorkoutCard design, animations, and inline edit functionality
- Color design tokens and theme system
- Zustand store structure (only add the onboarding fields)
- Framer Motion animations on workout cards
- The Recharts analytics charts
- The achievement badge designs

---

*TrackR APEX — Patch v1.0.2*
*Fixes: Mobile-First Responsive · Sidebar Layout · Onboarding Tour · Map Label Contrast*
