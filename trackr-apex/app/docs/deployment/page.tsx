'use client';

/**
 * Deployment Page detailing automatic Git pushes and Vercel serverless rules.
 */
export default function DocsDeploymentPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Vercel Deployment
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Automatic production builds, branch deploys, and security headers configured for Vercel.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Vercel Setup Rules
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        The platform features continuous delivery via Vercel integration. Every merge to <strong className="text-[var(--text-primary)]">master</strong> triggers a production build.
      </p>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        vercel.json Config Schema
      </h2>
      <div
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
        }}
        className="p-5 rounded-2xl flex flex-col gap-3 font-mono text-xs text-[var(--text-secondary)] leading-relaxed"
      >
        <pre className="overflow-x-auto">
{`{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </article>
  );
}
