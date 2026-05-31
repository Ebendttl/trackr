'use client';

/**
 * Flagship Docs Page — Project Overview and Mission statement.
 */
export default function DocsOverviewPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Overview
      </h1>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
        Welcome to the **TrackR APEX** developer portal. This documentation suite houses the complete specifications, structural data models, technical Innovation statements, and build details for a world-class GIS Workout Analytics platform.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Why TrackR APEX exists
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Modern exercise suites suffer from vendor lock-in, heavy subscription pricing models, and direct commercial surveillance. TrackR APEX serves as an alternative—a 100% free, offline-first, open-source dashboard built using React, Next.js, and Leaflet.js to put performance telemetry directly in the athlete's hands.
      </p>

      <div
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
        }}
        className="p-5 rounded-2xl flex flex-col gap-3 mt-4"
      >
        <span className="text-[10px] font-bold text-[var(--accent-speed)] uppercase tracking-widest font-mono">
          Core Tenets
        </span>
        <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] flex flex-col gap-2 leading-relaxed">
          <li>
            <strong className="text-[var(--text-primary)]">Strict Privacy Commitment:</strong> All data is persisted inside local browser storage. No cloud databases, no trackers.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Precision Instrumentation:</strong> Inspired by telemetry cockpits, layouts communicate geodetic stats with absolute clarity.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Extensible Architecture:</strong> Clean state management powered by Zustand makes extending activity types seamless.
          </li>
        </ul>
      </div>
    </article>
  );
}
