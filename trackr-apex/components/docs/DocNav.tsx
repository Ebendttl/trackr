'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { path: '/docs', label: 'Overview' },
  { path: '/docs/architecture', label: 'System Architecture' },
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/data-model', label: 'Data Model & Schemas' },
  { path: '/docs/api-reference', label: 'API Reference' },
  { path: '/docs/features', label: 'Features Walkthrough' },
  { path: '/docs/configuration', label: 'Configuration variables' },
  { path: '/docs/deployment', label: 'Vercel Deployment' },
  { path: '/docs/contributing', label: 'Contributing Guide' },
  { path: '/docs/changelog', label: 'Changelog' },
  { path: '/docs/roadmap', label: 'Roadmap & Backlog' },
  { path: '/docs/grant-appendix', label: 'Grant Appendix spec' },
];

/**
 * Shared sidebar navigation component for the developer docs system.
 */
export default function DocNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-64 p-6 shrink-0 border-r border-[var(--border-subtle)] h-screen overflow-y-auto select-none bg-[var(--surface-base)]">
      <div className="flex items-center gap-2 mb-8 px-2">
        <span className="text-base font-extrabold bg-gradient-to-r from-[var(--accent-motion)] to-[var(--accent-speed)] WebkitBackgroundClip text WebkitTextFillColor transparent font-mono">
          TRACKR APEX
        </span>
        <span className="text-[9px] font-black text-[var(--accent-speed)] border border-[var(--border-speed)] bg-[var(--accent-speed-dim)] px-2 py-0.5 rounded-full font-mono">
          DOCS
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest font-mono px-2 mb-2">
          Documentation
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--surface-overlay)' : 'transparent',
                borderColor: isActive ? 'var(--border-motion)' : 'transparent',
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg border hover:border-[var(--border-default)] hover:text-[var(--text-primary)] transition-all"
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] px-2">
        <Link
          href="/"
          className="text-xs font-bold text-[var(--accent-motion)] hover:text-[var(--text-primary)] uppercase tracking-wider font-mono transition-colors"
        >
          ← Main Console
        </Link>
      </div>
    </nav>
  );
}
