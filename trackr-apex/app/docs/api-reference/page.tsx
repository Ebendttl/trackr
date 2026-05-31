'use client';

/**
 * API Reference Page documenting Zustand stores, geodetic helpers, and custom hooks.
 */
export default function DocsApiReferencePage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        API Reference
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Complete operational spec of core libraries, Zustand stores, and custom hooks.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Zustand stores Actions
      </h2>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] flex flex-col gap-3 leading-relaxed">
        <li>
          <strong className="text-[var(--text-primary)] font-mono">useWorkoutStore()</strong>: Orchestrates activity lists, inline edit inputs, deletion stack, and debounced filters.
        </li>
        <li>
          <strong className="text-[var(--text-primary)] font-mono">useMapStore()</strong>: Tracks active waypoint arrays, updates geodesic distance calculation, and controls GIS overlay polyline state.
        </li>
        <li>
          <strong className="text-[var(--text-primary)] font-mono">useUIStore()</strong>: Governs system theme options, circular selector visibility, panel expansions, and stacking notification toasts.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Mathematical Core
      </h2>
      <div
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
        }}
        className="p-5 rounded-2xl flex flex-col gap-2 font-mono text-xs text-[var(--text-secondary)] leading-relaxed"
      >
        <p className="text-[var(--text-primary)] font-bold">// Haversine formula calculation</p>
        <p>function haversineDistance(a: Coords, b: Coords): number</p>
        <p className="text-[var(--text-primary)] font-bold mt-2">// Pace formulation</p>
        <p>function calcPace(duration: number, distance: number): number</p>
        <p className="text-[var(--text-primary)] font-bold mt-2">// Speed calculation</p>
        <p>function calcSpeed(distance: number, duration: number): number</p>
      </div>
    </article>
  );
}
