'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';

/**
 * Zone 8 — Footer
 * Subtle "Clear All" with inline confirmation + copyright.
 */
export default function Footer() {
  const workouts = useWorkoutStore((s) => s.workouts);
  const clearAll = useWorkoutStore((s) => s.clearAll);
  const addNotification = useUIStore((s) => s.addNotification);
  const [confirming, setConfirming] = useState(false);

  const handleClear = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearAll();
    setConfirming(false);
    addNotification({ type: 'info', title: 'All workouts cleared' });
  };

  return (
    <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      {workouts.length > 0 && (
        <button
          onClick={handleClear}
          className="flex items-center gap-2 text-xs transition-colors mb-3"
          style={{ color: confirming ? 'var(--accent-danger)' : 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Trash2 size={11} />
          {confirming ? 'Are you sure? Tap again' : 'Clear all workouts'}
        </button>
      )}
      <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
        © 2026{' '}
        <a href="https://twitter.com/thefaks_officia" target="_blank" rel="noopener" style={{ color: 'var(--text-accent)', textDecoration: 'none' }}>Micheal</a>
        {' & '}
        <a href="https://x.com/Eben_Akinseinde" target="_blank" rel="noopener" style={{ color: 'var(--text-accent)', textDecoration: 'none' }}>Ebenezer</a>
        {' — TrackR APEX'}
      </p>
    </div>
  );
}
