'use client';
import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';

const options = [
  { value: 'all' as const, label: 'All' },
  { value: 'jogging' as const, label: 'Jogging' },
  { value: 'biking' as const, label: 'Biking' },
];

/**
 * Filter pills with smooth sliding layout animation.
 */
export default function FilterPills() {
  const { filterType, setFilterType } = useWorkoutStore();

  return (
    <div className="flex gap-1 p-1 bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg relative overflow-hidden w-full md:w-auto">
      {options.map((opt) => {
        const isActive = filterType === opt.value;
        const activeBgClass =
          opt.value === 'jogging'
            ? 'var(--accent-motion-dim)'
            : opt.value === 'biking'
            ? 'var(--accent-speed-dim)'
            : 'var(--border-emphasis)';
        const activeBorderClass =
          opt.value === 'jogging'
            ? 'var(--accent-motion)'
            : opt.value === 'biking'
            ? 'var(--accent-speed)'
            : 'var(--text-secondary)';

        return (
          <button
            key={opt.value}
            onClick={() => setFilterType(opt.value)}
            style={{
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
            }}
            className="flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer select-none"
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterGlow"
                style={{
                  background: activeBgClass,
                  border: `1px solid ${activeBorderClass}`,
                }}
                className="absolute inset-0 rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
