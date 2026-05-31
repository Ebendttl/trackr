'use client';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useMapStore } from '@/stores/mapStore';
import { useWorkoutStore } from '@/stores/workoutStore';

const PEEK_HEIGHT = 80;

/**
 * MobileFAB — floating action button shown only on mobile.
 * Pulses when no workouts have been logged yet to draw attention.
 * Opens the workout form in single-point mode.
 */
export default function MobileFAB() {
  const setFormOpen = useUIStore((s) => s.setFormOpen);
  const setPendingFormCoords = useMapStore((s) => s.setPendingFormCoords);
  const workouts = useWorkoutStore((s) => s.workouts);
  const hasNoWorkouts = workouts.length === 0;

  const handleTap = () => {
    // Use a default center coord — the map click handler will override it
    // if the user taps the map first. FAB gives a quick fallback entry.
    setPendingFormCoords({ lat: 6.5244, lng: 3.3792 });
    setFormOpen(true);
  };

  return (
    <motion.button
      className="fixed z-30 md:hidden mobile-fab"
      style={{
        bottom: PEEK_HEIGHT + 16,
        left: '50%',
        translateX: '-50%',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--accent-motion)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
      }}
      whileTap={{ scale: 0.92 }}
      animate={hasNoWorkouts ? {
        boxShadow: [
          '0 4px 20px rgba(124,106,247,0.5), 0 0 0 0 rgba(124,106,247,0.3)',
          '0 4px 20px rgba(124,106,247,0.5), 0 0 0 12px rgba(124,106,247,0)',
        ],
      } : {
        boxShadow: '0 4px 20px rgba(124,106,247,0.4)',
      }}
      transition={{ duration: 1.5, repeat: hasNoWorkouts ? Infinity : 0, ease: 'easeOut' }}
      onClick={handleTap}
      aria-label="Log workout"
    >
      <Plus size={24} color="white" strokeWidth={2.5} />
    </motion.button>
  );
}
