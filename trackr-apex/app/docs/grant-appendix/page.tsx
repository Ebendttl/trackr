'use client';

/**
 * Grant Appendix Page suited for technical review boards and open-source proposals.
 */
export default function DocsGrantAppendixPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Grant Appendix Spec
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Technical Innovation proposal for community physical health tracking.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Technical Abstract
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        TrackR APEX represents a lightweight, high-performance, offline-first GIS application designed to optimize individual exercise analytics without compromising privacy. The platform eliminates cloud databases, operating fully within local client storage nodes while offering real-time geodetic polyline computations.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Statement of Innovation
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Existing physical analytics tools are highly monetized and depend on massive data warehousing. TrackR APEX demonstrates that modern web frameworks (React, Next.js, and Zustand) combined with browser-native persistent caches can deliver a beautiful, low-overhead analytics dashboard. It operates as a secure tool for community athletic health.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Technology Justification
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        By selecting Leaflet.js over proprietary mapping APIs, we guarantee an open data foundation. Using the Open-Meteo weather coordinate API eliminates rate-limiting keys, creating a scalable utility that handles high traffic with zero operational hosting costs.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Privacy Commitment
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Our core architecture guarantees that data is never stored on third-party servers. No telemetry trackers are loaded, and exercise profiles remain fully local to the runner's machine.
      </p>
    </article>
  );
}
