'use client';

/**
 * Data Model Page displaying Zod schemas and JSON interfaces.
 */
export default function DocsDataModelPage() {
  return (
    <article className="flex flex-col gap-6 select-text">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] WebkitBackgroundClip text WebkitTextFillColor transparent mb-2">
        Data Model & Schemas
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        TypeScript interface types enforce mathematical consistency across activity fields.
      </p>

      <hr className="border-[var(--border-subtle)] my-2" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
        Workout Data Interface
      </h2>
      <div
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
        }}
        className="p-5 rounded-2xl flex flex-col gap-3 font-mono text-xs text-[var(--text-secondary)] leading-relaxed"
      >
        <pre className="overflow-x-auto">
{`interface BaseWorkout {
  id: string;             // nanoid() uniquely identified
  type: 'jogging' | 'biking';
  date: string;           // ISO format timestamp
  coords: { lat: number; lng: number };
  route: Array<{ lat: number; lng: number }>; // route trace
  distance: number;       // calculated distance in km
  duration: number;       // logged duration in minutes
  description: string;    // e.g. "Jogging on May 31"
  weather: WeatherData | null;
  notes?: string;         // optional route notes
}`}
        </pre>
      </div>

      <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider mt-2">
        Zod schemas validation
      </h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Workout metrics undergo rigorous runtime Zod validation: distance is capped at 1000km, duration is capped at 1440 minutes, and cadence is bound between 60 and 300 steps per minute.
      </p>
    </article>
  );
}
