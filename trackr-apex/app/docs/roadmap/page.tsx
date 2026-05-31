'use client';

/**
 * Roadmap Page.
 */
export default function DocsRoadmapPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Roadmap & Backlog
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Feature pipeline outlining future modules, social sync nodes, and analytical additions.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] flex flex-col gap-3 leading-relaxed">
        <li>
          <strong className="text-[var(--text-primary)]">Strava Integration API:</strong> Bidirectional coordinate parsing to directly mirror activities.
        </li>
        <li>
          <strong className="text-[var(--text-primary)]">Social Export Nodes:</strong> Generate premium visual cards with embedded statistics and vector maps.
        </li>
        <li>
          <strong className="text-[var(--text-primary)]">AI Telemetry Coach:</strong> Local model parsing logs to provide pace suggestions and performance trends.
        </li>
      </ul>
    </article>
  );
}
