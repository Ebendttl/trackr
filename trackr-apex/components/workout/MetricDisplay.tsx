'use client';

/**
 * Reusable layout cell for key performance metrics with clear vertical separators.
 */
export default function MetricDisplay({
  value,
  unit,
  icon,
}: {
  value: string | number;
  unit: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-start px-2 py-0.5 first:pl-0 last:pr-0 select-none">
      <div className="flex items-baseline gap-1">
        {icon && <span className="text-xs leading-none mr-0.5">{icon}</span>}
        <span className="text-[17px] font-medium text-[var(--text-primary)] font-mono leading-none tracking-tight">
          {value}
        </span>
      </div>
      <span className="text-[9px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-1.5 font-sans leading-none">
        {unit}
      </span>
    </div>
  );
}
