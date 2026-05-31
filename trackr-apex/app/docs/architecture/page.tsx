'use client';

/**
 * System Architecture Page rendering vector flowchart representing client telemetry layers.
 */
export default function DocsArchitecturePage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        System Architecture
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        TrackR APEX leverages an offline-first, client-driven telemetry framework designed for Next.js App Router.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      {/* SVG System Diagram */}
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest font-mono">
          Interactive Component Topology
        </span>
        <div
          style={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
          }}
          className="p-6 flex items-center justify-center"
        >
          <svg viewBox="0 0 600 350" className="w-full max-w-[500px]" fill="none">
            {/* Box: Client Interface */}
            <rect x="20" y="20" width="160" height="70" rx="10" fill="var(--surface-overlay)" stroke="var(--border-motion)" strokeWidth="1.5" />
            <text x="35" y="55" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">Next.js UI Engine</text>
            <text x="35" y="70" fill="var(--text-tertiary)" fontSize="10" fontFamily="sans-serif">React 18 App Layer</text>

            {/* Box: Map Layer */}
            <rect x="220" y="20" width="160" height="70" rx="10" fill="var(--surface-overlay)" stroke="var(--border-speed)" strokeWidth="1.5" />
            <text x="235" y="55" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">Leaflet core</text>
            <text x="235" y="70" fill="var(--text-tertiary)" fontSize="10" fontFamily="sans-serif">GIS Vector Mapper</text>

            {/* Box: State */}
            <rect x="20" y="160" width="160" height="70" rx="10" fill="var(--surface-overlay)" stroke="var(--border-emphasis)" strokeWidth="1.5" />
            <text x="35" y="195" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">Zustand Store</text>
            <text x="35" y="210" fill="var(--text-tertiary)" fontSize="10" fontFamily="sans-serif">In-Memory Flux State</text>

            {/* Box: Cache Layer */}
            <rect x="220" y="160" width="160" height="70" rx="10" fill="var(--surface-overlay)" stroke="var(--border-emphasis)" strokeWidth="1.5" />
            <text x="235" y="195" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">localStorage</text>
            <text x="235" y="210" fill="var(--text-tertiary)" fontSize="10" fontFamily="sans-serif">Persistent Cache</text>

            {/* Box: External API */}
            <rect x="420" y="90" width="160" height="70" rx="10" fill="var(--surface-overlay)" stroke="var(--accent-life)" strokeWidth="1.5" />
            <text x="435" y="125" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">Open-Meteo API</text>
            <text x="435" y="140" fill="var(--text-tertiary)" fontSize="10" fontFamily="sans-serif">JSON Weather service</text>

            {/* Path links */}
            <path d="M180 55 H220" stroke="var(--border-emphasis)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M100 90 V160" stroke="var(--border-emphasis)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M180 195 H220" stroke="var(--border-emphasis)" strokeWidth="1.5" />
            <path d="M380 55 H450 V90" stroke="var(--border-emphasis)" strokeWidth="1.5" />
            <path d="M180 195 H220" stroke="var(--border-emphasis)" strokeWidth="1.5" />

            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-secondary)" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-4">
        Component Hierarchy
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        The layout splits into a scrollable sidebar on the left and a full-height Leaflet wrapper on the right. State changes coordinate via Zustand triggers, updating coordinate polylines, badge indicators, and dynamic telemetry counts.
      </p>
    </article>
  );
}
