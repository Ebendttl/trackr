'use client';
import { useEffect, useState } from 'react';
import { Polyline, CircleMarker } from 'react-leaflet';
import { useMapStore } from '@/stores/mapStore';

/**
 * Glowing flowing animated polyline that renders coordinates actively drawn.
 */
export default function DrawingPolyline() {
  const { routePoints, drawingMode } = useMapStore();
  const [ticks, setTicks] = useState(0);

  // Trigger re-render to animate flowing dashed polyline
  useEffect(() => {
    if (!drawingMode) return;
    const interval = setInterval(() => {
      setTicks((t) => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [drawingMode]);

  if (routePoints.length === 0) return null;

  const positions = routePoints.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <>
      {/* Animated flowing dashed trace */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: 'var(--accent-speed)',
          weight: 2.5,
          dashArray: '10, 10',
          dashOffset: `${-ticks * 2}`,
          opacity: 0.85,
        }}
      />

      {/* Waypoint circle markers at each click coord */}
      {routePoints.map((pt, i) => (
        <CircleMarker
          key={`wp-${i}`}
          center={[pt.lat, pt.lng]}
          radius={4}
          pathOptions={{
            color: 'white',
            fillColor: 'var(--accent-speed)',
            fillOpacity: 1.0,
            weight: 1.5,
          }}
        />
      ))}
    </>
  );
}
