'use client';

/**
 * Changelog Page tracking development versions.
 */
export default function DocsChangelogPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Changelog
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Version tracking milestones and features of the TrackR APEX platform.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--text-primary)] font-mono">v1.0.0</span>
          <span className="text-[9px] font-black text-[var(--accent-speed)] border border-[var(--border-speed)] bg-[var(--accent-speed-dim)] px-2 py-0.5 rounded-full font-mono">
            LAUNCH
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] font-mono">May 31, 2026</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Complete Next.js framework migration. Rebuilt all mapping systems, injected live Open-Meteo telemetry, created Recharts analytics views, established in-place calibration editors, and integrated Zod schemas.
        </p>
      </div>
    </article>
  );
}
