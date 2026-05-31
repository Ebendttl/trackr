'use client';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Navigation } from 'lucide-react';

/**
 * High-fidelity empty state showing a futuristic mapping grid pattern overlay.
 */
export default function WorkoutEmptyState() {
  const { setSearchQuery, setFilterType } = useWorkoutStore();

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
      }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[220px]"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] text-[var(--accent-speed)] mb-4 animate-pulse">
        <Navigation size={20} />
      </div>
      <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
        No Telemetry Logged
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-[240px] leading-relaxed">
        Trace a route on the map or click a location to establish a new activity record.
      </p>
      <button
        onClick={handleClearFilters}
        style={{
          border: '1px solid var(--border-default)',
        }}
        className="mt-5 px-4 py-2 text-[10px] font-bold text-[var(--text-accent)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] uppercase tracking-widest rounded-lg transition-all"
      >
        Clear Filter Deck
      </button>
    </div>
  );
}
