'use client';

/**
 * Getting Started Page containing system commands to construct and launch the platform.
 */
export default function DocsGettingStartedPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Getting Started
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Set up your development environment and run TrackR APEX locally in minutes.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Prerequisites
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Ensure you have Node.js 18.17.0+ or 20.0.0+ installed along with npm.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Bootstrap Commands
      </h2>
      <div
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
        }}
        className="p-5 rounded-2xl flex flex-col gap-3 font-mono text-xs text-[var(--text-secondary)]"
      >
        <p className="text-[var(--text-primary)]"># Clone the repository</p>
        <p>git clone https://github.com/Ebendttl/trackr.git</p>
        <p className="text-[var(--text-primary)] mt-2"># Navigate to next project</p>
        <p>cd trackr/trackr-apex</p>
        <p className="text-[var(--text-primary)] mt-2"># Install all required packages</p>
        <p>npm install</p>
        <p className="text-[var(--text-primary)] mt-2"># Start local server</p>
        <p>npm run dev</p>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
        Once running, navigate to <strong className="text-[var(--text-primary)]">http://localhost:3000</strong> to open the telemetry dashboard.
      </p>
    </article>
  );
}
