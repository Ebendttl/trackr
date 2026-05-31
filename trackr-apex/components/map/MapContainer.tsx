'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Core component dynamically loaded in client runtime due to browser window access
const MapCore = dynamic(() => import('./MapCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface-void)] gap-2 select-none font-mono">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[var(--accent-speed)] animate-spin" />
      <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest animate-pulse mt-2">
        Mapping Grid Loading...
      </span>
    </div>
  ),
});

/**
 * Next-compatible dynamic map rendering envelope.
 */
export default function MapContainer() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapCore />
      {/* Dynamic dark edge vignette layer */}
      <div className="map-vignette" />
    </div>
  );
}
