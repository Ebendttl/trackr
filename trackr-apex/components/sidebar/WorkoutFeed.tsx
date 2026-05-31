'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';
import WorkoutCard from '@/components/workout/WorkoutCard';
import WorkoutEmptyState from '@/components/workout/WorkoutEmptyState';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { useUIStore } from '@/stores/uiStore';

/**
 * Zone 6 — Workout Feed
 * Scrollable, animated list of workout cards with AnimatePresence for deletions.
 */
export default function WorkoutFeed() {
  const filteredWorkouts = useWorkoutStore((s) => s.filteredWorkouts());
  const isFormOpen = useUIStore((s) => s.isFormOpen);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <AnimatePresence mode="popLayout">
        {isFormOpen && <WorkoutForm key="form" />}
      </AnimatePresence>

      {filteredWorkouts.length === 0 && !isFormOpen && <WorkoutEmptyState />}

      <AnimatePresence mode="popLayout">
        {filteredWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </AnimatePresence>
    </div>
  );
}
