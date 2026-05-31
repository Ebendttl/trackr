'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useMapStore } from '@/stores/mapStore';
import { useUIStore } from '@/stores/uiStore';
import { calcRouteDistance } from '@/lib/calculations';
import WorkoutMarker from './WorkoutMarker';
import RoutePolyline from './RoutePolyline';
import DrawingPolyline from './DrawingPolyline';
import MapControls from './MapControls';

function MapEventHandler() {
  const { drawingMode, addRoutePoint, setPendingFormCoords, routePoints, setCalculatedRouteDistance } = useMapStore();
  const { setFormOpen } = useUIStore();

  useMapEvents({
    click(e) {
      const coord = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (drawingMode) {
        // Multi-point GIS drawing pathway
        addRoutePoint(coord);
        // Announce route updates in real time
        const newPoints = [...routePoints, coord];
        setCalculatedRouteDistance(calcRouteDistance(newPoints));
      } else {
        // Standard anchor point setting
        setPendingFormCoords(coord);
        setFormOpen(true);
      }
    },
  });

  return null;
}

/**
 * Dynamic leaf mapping component that triggers React Context bindings.
 */
export default function MapCore() {
  const [map, setMap] = useState<L.Map | null>(null);
  const workouts = useWorkoutStore((s) => s.workouts);
  const activeWorkoutId = useWorkoutStore((s) => s.activeWorkoutId);

  // Stadia Alidade Smooth Dark — near-white labels, no API key required.
  // Falls back to env override if provided.
  const tileUrl =
    process.env.NEXT_PUBLIC_MAP_TILE_URL ??
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

  // Dynamic zoom control on card click
  useEffect(() => {
    if (!map || !activeWorkoutId) return;
    const workout = workouts.find((w) => w.id === activeWorkoutId);
    if (workout) {
      map.setView([workout.coords.lat, workout.coords.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [activeWorkoutId, workouts, map]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[6.5244, 3.3792]} // Default center coords
        zoom={13}
        className="w-full h-full"
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={20}
        />

        <MapEventHandler />

        {/* Existing Workout Markers */}
        {workouts.map((w) => (
          <WorkoutMarker key={w.id} workout={w} />
        ))}

        {/* Drawn Active route Polylines */}
        <DrawingPolyline />

        {/* Saved Complete routes */}
        {workouts.map((w) => (
          <RoutePolyline key={`route-${w.id}`} workout={w} />
        ))}
      </MapContainer>

      {/* Floating Precision Controls */}
      {map && <MapControls map={map} />}
    </div>
  );
}
