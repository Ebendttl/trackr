'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/sidebar/Sidebar';
import ToastContainer from '@/components/ui/Toast';
import OnboardingTour from '@/components/ui/OnboardingTour';

// Mobile-only components (shown below md breakpoint)
import MobileTopBar from '@/components/mobile/MobileTopBar';
import BottomSheet from '@/components/mobile/BottomSheet';
import MobileFAB from '@/components/mobile/MobileFAB';

// Leaflet MUST be dynamically imported — it crashes SSR
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), { ssr: false });

/**
 * Main application page — the command center.
 * Desktop: two-column layout (sidebar 420px + map flex-1).
 * Mobile: full-screen map + fixed TopBar + draggable BottomSheet + FAB.
 * Hydrates all Zustand stores from localStorage on mount.
 */
export default function HomePage() {
  const hydrate = useWorkoutStore((s) => s.hydrate);
  const hydrateAchievements = useUIStore((s) => s.hydrateAchievements);
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    hydrate();
    hydrateAchievements(); // also auto-triggers onboarding on first visit
  }, [hydrate, hydrateAchievements]);

  // Apply theme to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <main
      className="flex full-dvh w-screen overflow-hidden"
      style={{ background: 'var(--surface-void)' }}
    >
      {/* ── Desktop sidebar (hidden on mobile via Sidebar's own className) ── */}
      <Sidebar />

      {/* ── Map — fills all remaining space on desktop, full screen on mobile ── */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          // On mobile: map runs from below TopBar (56px) to above BottomSheet peek (80px)
        }}
      >
        <MapContainer />
      </div>

      {/* ── Mobile UI (md:hidden enforced inside each component) ── */}
      <MobileTopBar />
      <BottomSheet />
      <MobileFAB />

      {/* ── Global overlays ── */}
      <ToastContainer />
      <OnboardingTour />
    </main>
  );
}
