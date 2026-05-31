'use client';
import { Polyline } from 'react-leaflet';
import { Workout } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workoutStore';

/**
 * Solid glowing route polylines that render complete activities.
 */
export default function RoutePolyline({ workout }: { workout: Workout }) {
  const activeWorkoutId = useWorkoutStore((s) => s.activeWorkoutId);
  const isJogging = workout.type === 'jogging';
  const isActive = activeWorkoutId === workout.id;

  if (workout.route.length === 0) return null;

  const positions = workout.route.map((p) => [p.lat, p.lng] as [number, number]);
  const primaryColor = isJogging ? 'var(--accent-motion)' : 'var(--accent-speed)';
  const lineWeight = parseFloat(process.env.NEXT_PUBLIC_ROUTE_LINE_WEIGHT ?? '2.5');

  return (
    <>
      {/* Glow path shadow */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: primaryColor,
          weight: lineWeight * 3,
          opacity: isActive ? 0.4 : 0.15,
        }}
      />
      {/* Direct solid color line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: primaryColor,
          weight: lineWeight,
          opacity: isActive ? 1.0 : 0.75,
        }}
      />
    </>
  );
}
