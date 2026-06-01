'use client';
import L from 'leaflet';
import { Plus, Minus, Locate, Maximize2 } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';

/**
 * Premium custom glassmorphic overlay for map zoom, locate, and bound controls.
 */
export default function MapControls({ map }: { map: L.Map }) {
  const workouts = useWorkoutStore((s) => s.workouts);
  const addNotification = useUIStore((s) => s.addNotification);

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 15 });
    map.once('locationfound', (e) => {
      addNotification({
        type: 'info',
        title: 'Coordinates Calibrated',
        message: `Centered on accuracy radius of ${Math.round(e.accuracy)}m`,
      });
    });
    map.once('locationerror', () => {
      addNotification({
        type: 'error',
        title: 'Calibration Refused',
        message: 'Could not access browser location permissions.',
      });
    });
  };

  const handleFitAll = () => {
    if (workouts.length === 0) return;
    const bounds = L.latLngBounds(workouts.map((w) => [w.coords.lat, w.coords.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  };

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-6 md:right-6 z-[401] flex flex-col gap-2 pointer-events-auto select-none font-sans">
      <div
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 'var(--radius-md)',
        }}
        className="flex flex-col overflow-hidden"
      >
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 md:w-9 md:h-9 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors border-b border-[var(--border-subtle)]"
          title="Zoom In"
        >
          <Plus size={18} className="md:w-[15px] md:h-[15px]" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 md:w-9 md:h-9 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
          title="Zoom Out"
        >
          <Minus size={18} className="md:w-[15px] md:h-[15px]" />
        </button>
      </div>

      <button
        onClick={handleLocate}
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 'var(--radius-md)',
        }}
        className="w-12 h-12 md:w-9 md:h-9 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        title="Center on Me"
      >
        <Locate size={18} className="md:w-[15px] md:h-[15px]" />
      </button>

      {workouts.length > 0 && (
        <button
          onClick={handleFitAll}
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            borderRadius: 'var(--radius-md)',
          }}
          className="w-12 h-12 md:w-9 md:h-9 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
          title="Fit All Workouts"
        >
          <Maximize2 size={16} className="md:w-[14px] md:h-[14px]" />
        </button>
      )}
    </div>
  );
}
