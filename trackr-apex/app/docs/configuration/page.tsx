'use client';

/**
 * Configuration Page mapping process environment values.
 */
export default function DocsConfigurationPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Configuration variables
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Process settings and process environment mappings inside Next.js layout configurations.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Environment mappings (.env.local)
      </h2>
      <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse mt-2">
        <thead>
          <tr className="border-b border-[var(--border-default)]">
            <th className="py-2 font-bold text-[var(--text-primary)] font-mono uppercase">Variable</th>
            <th className="py-2 font-bold text-[var(--text-primary)] font-mono uppercase">Type</th>
            <th className="py-2 font-bold text-[var(--text-primary)] font-mono uppercase">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="py-3 font-mono text-[var(--text-accent)]">NEXT_PUBLIC_APP_NAME</td>
            <td>string</td>
            <td>&quot;TrackR APEX&quot;</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="py-3 font-mono text-[var(--text-accent)]">NEXT_PUBLIC_MAP_TILE_URL</td>
            <td>string</td>
            <td className="truncate max-w-[200px]">CartoDB Dark Matter (no tile auth)</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="py-3 font-mono text-[var(--text-accent)]">NEXT_PUBLIC_DEFAULT_ZOOM</td>
            <td>number</td>
            <td>13</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="py-3 font-mono text-[var(--text-accent)]">NEXT_PUBLIC_ROUTE_LINE_WEIGHT</td>
            <td>number</td>
            <td>2.5</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
