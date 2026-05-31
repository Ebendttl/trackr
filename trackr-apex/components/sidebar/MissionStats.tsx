'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const stats = [
  { key: 'count' as const, icon: '🔥', label: 'Workouts', unit: '' },
  { key: 'distance' as const, icon: '🗺️', label: 'Distance', unit: 'km' },
  { key: 'duration' as const, icon: '⏱️', label: 'Duration', unit: 'min' },
];

/**
 * Zone 2 — Mission Stats
 * Three animated stat cards showing aggregate workout metrics.
 */
export default function MissionStats() {
  const workouts = useWorkoutStore((s) => s.workouts);

  const values = useMemo(() => {
    const distance = workouts.reduce((sum, w) => sum + w.distance, 0);
    const duration = workouts.reduce((sum, w) => sum + w.duration, 0);
    return {
      count: workouts.length,
      distance: parseFloat(distance.toFixed(1)),
      duration,
    };
  }, [workouts]);

  return (
    <div className="mission-stats grid grid-cols-3 gap-2 py-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
          style={{
            background: 'var(--surface-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            borderTop: `3px solid var(--accent-motion)`,
            boxShadow: 'var(--shadow-card)',
            padding: '12px 8px 10px',
          }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-lg mb-1">{stat.icon}</span>
          <span
            style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '22px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1 }}
          >
            <AnimatedCounter value={values[stat.key]} />
          </span>
          {stat.unit && (
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
              {stat.unit}
            </span>
          )}
          <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
