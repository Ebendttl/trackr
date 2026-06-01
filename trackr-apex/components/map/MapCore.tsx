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
import MapSearchPanel from './MapSearchPanel';

const DEFAULT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const STADIA_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function getTileAttribution(tileUrl: string) {
  return tileUrl.includes('stadiamaps.com') ? STADIA_ATTRIBUTION : CARTO_ATTRIBUTION;
}

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

  // CartoDB Dark Matter works in production without provider-side domain auth.
  // Override with NEXT_PUBLIC_MAP_TILE_URL only when the provider is production-ready.
  const tileUrl = process.env.NEXT_PUBLIC_MAP_TILE_URL?.trim() || DEFAULT_TILE_URL;
  const tileAttribution = getTileAttribution(tileUrl);

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
          attribution={tileAttribution}
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

      {/* Location Search + Route Panel */}
      {map && <MapSearchPanel map={map} />}
    </div>
  );
}
