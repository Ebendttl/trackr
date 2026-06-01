'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Cloud, Navigation2 } from 'lucide-react';
import { Workout } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';
import { formatPace } from '@/lib/calculations';
import MetricDisplay from './MetricDisplay';
import InlineEditForm from './InlineEditForm';

/**
 * Premium workout list card featuring hover effects and custom animations.
 */
export default function WorkoutCard({ workout }: { workout: Workout }) {
  const [editing, setEditing] = useState(false);
  const deleteWorkout = useWorkoutStore((s) => s.deleteWorkout);
  const activeWorkoutId = useWorkoutStore((s) => s.activeWorkoutId);
  const setActiveWorkout = useWorkoutStore((s) => s.setActiveWorkout);
  const addNotification = useUIStore((s) => s.addNotification);

  const isJogging = workout.type === 'jogging';
  const accentColor = isJogging ? 'var(--accent-motion)' : 'var(--accent-speed)';
  const borderClass = isJogging ? 'border-l-4 border-l-[var(--accent-motion)]' : 'border-l-4 border-l-[var(--accent-speed)]';
  const glowShadow = isJogging ? 'var(--shadow-motion)' : 'var(--shadow-speed)';
  const isActive = activeWorkoutId === workout.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteWorkout(workout.id);
    addNotification({
      type: 'info',
      title: 'Workout Deleted',
      message: workout.description,
    });
  };

  const handleCardClick = () => {
    setActiveWorkout(isActive ? null : workout.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.15 } }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onClick={handleCardClick}
      style={{
        background: 'var(--surface-raised)',
        border: isActive ? `1px solid ${accentColor}` : '1px solid var(--border-default)',
        boxShadow: isActive ? glowShadow : 'var(--shadow-card)',
      }}
      className={`p-4 rounded-2xl flex flex-col gap-3 cursor-pointer select-none transition-shadow relative overflow-hidden group ${borderClass}`}
    >
      {/* Top Details Row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <span>{isJogging ? '🏃' : '🚴'}</span>
            {workout.description}
          </h4>
          {workout.notes && (
            <p className="text-[10px] text-[var(--text-secondary)] italic font-mono truncate max-w-[220px]">
              "{workout.notes}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setEditing((e) => !e)}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] transition-colors p-1"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <hr className="border-[var(--border-subtle)] my-0.5" />

      {/* Grid containing metrics — 2x2 on mobile, 4 columns on desktop/tablet */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 items-center">
        <MetricDisplay value={workout.distance} unit="km" />
        <MetricDisplay value={workout.duration} unit="min" />

        {isJogging ? (
          <>
            <MetricDisplay value={(workout as any).cadence} unit="spm" />
            <MetricDisplay value={formatPace((workout as any).pace)} unit="/km" />
          </>
        ) : (
          <>
            <MetricDisplay value={(workout as any).elevationGain} unit="m" />
            <MetricDisplay value={Math.round((workout as any).speed)} unit="km/h" />
          </>
        )}
      </div>

      {/* Badges footer row */}
      <div className="flex items-center justify-between mt-1 select-none">
        {workout.route.length > 0 ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-[var(--accent-speed)] bg-[var(--accent-speed-dim)] border border-[var(--border-speed)] px-2 py-0.5 rounded-full font-mono">
            <Navigation2 size={8} />
            {workout.route.length} WAYPOINTS
          </div>
        ) : (
          <div />
        )}

        {workout.weather && (
          <div
            style={{
              background: 'var(--surface-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold text-[var(--text-primary)] font-mono"
            title={workout.weather.description}
          >
            <span>{workout.weather.emoji}</span>
            <span>{workout.weather.temp}°C</span>
          </div>
        )}
      </div>

      {/* Expand edit panel inside card */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <InlineEditForm workout={workout} onClose={() => setEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
