'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/sidebar/Sidebar';
import ToastContainer from '@/components/ui/Toast';

// Leaflet MUST be dynamically imported — it crashes SSR
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), { ssr: false });

/**
 * Main application page — the command center.
 * Two-column layout: sidebar (420px) + map (flex-1).
 * Hydrates all Zustand stores from localStorage on mount.
 */
export default function HomePage() {
  const hydrate = useWorkoutStore((s) => s.hydrate);
  const hydrateAchievements = useUIStore((s) => s.hydrateAchievements);
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    hydrate();
    hydrateAchievements();
  }, [hydrate, hydrateAchievements]);

  // Apply theme to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <main className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--surface-void)' }}>
      <Sidebar />
      <div className="flex-1 relative overflow-hidden">
        <MapContainer />
      </div>
      <ToastContainer />
    </main>
  );
}
