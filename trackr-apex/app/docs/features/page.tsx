'use client';

/**
 * Features Page walkthrough documenting high-fidelity systems.
 */
export default function DocsFeaturesPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Features Walkthrough
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Detailed breakdown of GIS route tracing, weather APIs, and gamified achievement structures.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        🗺️ GIS Route Drawing Engine
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Trace continuous paths on the dark map grid. A dashed animated polyline flows along waypoints, updating distance calculations dynamically before submitting the workout forms.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        🌦️ Live Weather Badges
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Workout entries trigger asynchronous telemetry fetches to Open-Meteo. Current weather indicators, temperatures, and descriptions are cached and displayed dynamically.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        🏅 Achievements
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        A 2x2 achievements dashboard tracks milestones. Unlocks trigger pop-up notifications, sound pulses, and spring badge glows.
      </p>
    </article>
  );
}
