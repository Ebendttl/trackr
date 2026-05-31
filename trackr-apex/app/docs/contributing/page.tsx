'use client';

/**
 * Contributing Page detailing code style guidelines.
 */
export default function DocsContributingPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Contributing Guide
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Coding rules, git branch layouts, and TypeScript expectations for contributions.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        TypeScript Strict Expectations
      </h2>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] flex flex-col gap-2 leading-relaxed">
        <li>
          <strong className="text-[var(--text-primary)]">Strict Strict mode:</strong> Never use <code className="text-[var(--accent-motion)]">any</code> types. Leverage explicit schemas.
        </li>
        <li>
          <strong className="text-[var(--text-primary)]">Component structure:</strong> Every component must include detailed JSDocs explaining parameters, side effects, and states.
        </li>
        <li>
          <strong className="text-[var(--text-primary)]">Styling parameters:</strong> Maintain alignment with the custom HSL design variables within <code className="text-[var(--accent-speed)]">globals.css</code>.
        </li>
      </ul>
    </article>
  );
}
