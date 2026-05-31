'use client';
import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  // Select raw primitives — Zustand preserves referential identity for these,
  // so the selector never returns a new object and avoids the infinite-loop warning.
  const workouts = useWorkoutStore((s) => s.workouts);
  const filterType = useWorkoutStore((s) => s.filterType);
  const sortMode = useWorkoutStore((s) => s.sortMode);
  const searchQuery = useWorkoutStore((s) => s.searchQuery);
  const isFormOpen = useUIStore((s) => s.isFormOpen);

  // Derive filtered + sorted list locally with useMemo so it only recomputes
  // when one of the four dependencies actually changes.
  const filteredWorkouts = useMemo(() => {
    let result = workouts.filter((w) => {
      const matchesType = filterType === 'all' || w.type === filterType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        w.description.toLowerCase().includes(q) ||
        w.type.includes(q) ||
        w.date.includes(q);
      return matchesType && matchesSearch;
    });

    switch (sortMode) {
      case 'date-desc':
        result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        result = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'distance-desc':
        result = [...result].sort((a, b) => b.distance - a.distance);
        break;
      case 'duration-desc':
        result = [...result].sort((a, b) => b.duration - a.duration);
        break;
    }
    return result;
  }, [workouts, filterType, sortMode, searchQuery]);

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
