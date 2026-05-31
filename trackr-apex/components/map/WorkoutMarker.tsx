'use client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Workout } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workoutStore';

/**
 * Premium custom divIcon neon pulse marker that overrides Leaflet defaults.
 */
export default function WorkoutMarker({ workout }: { workout: Workout }) {
  const activeWorkoutId = useWorkoutStore((s) => s.activeWorkoutId);
  const setActiveWorkout = useWorkoutStore((s) => s.setActiveWorkout);

  const isJogging = workout.type === 'jogging';
  const isActive = activeWorkoutId === workout.id;

  const markerColor = isJogging ? 'var(--accent-motion)' : 'var(--accent-speed)';
  const pulseClass = isJogging ? 'apex-marker-jogging' : 'apex-marker-biking';

  // Inline custom SVG element icon
  const customIcon = L.divIcon({
    className: 'custom-leaflet-marker-wrapper',
    html: `
      <div class="relative w-9 h-9 flex items-center justify-center pointer-events-auto">
        <!-- Pulse Glow Layer -->
        <div class="absolute inset-0 rounded-full ${pulseClass} scale-125 opacity-40" style="background: ${markerColor}"></div>
        <!-- Main teardrop marker pin -->
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border-2 border-white text-white font-bold select-none shadow-md ${
          isJogging
            ? 'bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-indigo-500/40'
            : 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-black shadow-cyan-500/40'
        }" style="transform: ${isActive ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.25s">
          ${isJogging ? '🏃' : '🚴'}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  return (
    <Marker
      position={[workout.coords.lat, workout.coords.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => setActiveWorkout(workout.id),
      }}
    >
      <Popup closeButton={false}>
        <div
          style={{
            borderLeft: `4px solid ${markerColor}`,
          }}
          className="p-3 pr-4 flex flex-col gap-1.5 min-w-[150px] font-sans"
        >
          <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            {isJogging ? '🏃 Jogging session' : '🚴 Cycling session'}
          </span>
          <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
            {workout.description}
          </p>

          <div className="flex items-center gap-4 mt-1 border-t border-[var(--border-subtle)] pt-1.5 text-[11px] font-mono text-[var(--text-secondary)] font-medium">
            <span>{workout.distance} km</span>
            <span>{workout.duration} min</span>
          </div>

          {workout.weather && (
            <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--accent-life)] font-bold font-mono">
              <span>{workout.weather.emoji}</span>
              <span>{workout.weather.temp}°C {workout.weather.description}</span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
