'use client';
import { motion } from 'framer-motion';
import IdentityBar from './IdentityBar';
import WelcomeBanner from './WelcomeBanner';
import MissionStats from './MissionStats';
import IntelligencePanel from './IntelligencePanel';
import ControlDeck from './ControlDeck';
import GPSOpsPanel from './GPSOpsPanel';
import WorkoutFeed from './WorkoutFeed';
import AchievementsPanel from './AchievementsPanel';
import Footer from './Footer';

/**
 * Sidebar — the Mission Command Center.
 * Desktop: fixed 420px, hidden on mobile (replaced by BottomSheet).
 * Tablet: 320px.
 * The flex structure is carefully ordered:
 *   - All zones except WorkoutFeed are flex-shrink: 0
 *   - WorkoutFeed is flex: 1 1 auto + min-height: 0 + overflow-y: auto
 *     (the "min-height: 0" is the critical fix for flex overflow)
 *   - Footer gets margin-top: auto, scrolls naturally with content
 */
export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sidebar hidden md:flex flex-col h-screen overflow-hidden"
      style={{
        width: '420px',
        minWidth: '420px',
        background: 'var(--surface-base)',
        borderRight: '1px solid var(--border-motion)',
        boxShadow: 'var(--shadow-motion)',
        zIndex: 10,
      }}
      aria-label="Mission Control Sidebar"
    >
      {/* Zone 1: Identity */}
      <div style={{ flexShrink: 0 }}>
        <IdentityBar />
      </div>

      {/* Zones 2–8: scrollable column */}
      <div
        className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          padding: '0 20px 20px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(124,106,247,0.3) transparent',
          scrollBehavior: 'smooth',
          minHeight: 0,
        }}
      >
        {/* Welcome banner — first visit only */}
        <div style={{ flexShrink: 0 }}>
          <WelcomeBanner />
        </div>

        {/* Zone 2 — fixed height */}
        <div style={{ flexShrink: 0 }}>
          <MissionStats />
        </div>

        {/* Zone 3 — collapsible via Framer Motion, no bleed */}
        <div style={{ flexShrink: 0 }}>
          <IntelligencePanel />
        </div>

        {/* Zone 4 — search + filter */}
        <div style={{ flexShrink: 0 }}>
          <ControlDeck />
        </div>

        {/* Zone 5 — GPS ops collapsible */}
        <div style={{ flexShrink: 0 }}>
          <GPSOpsPanel />
        </div>

        {/* Zone 6 — Workout feed: THE critical flex child.
            flex: 1 1 auto + min-height: 0 allows it to shrink and
            take its own overflow-y scroll without bleeding into siblings. */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            marginBottom: 8,
          }}
        >
          <WorkoutFeed />
        </div>

        {/* Zone 7 — achievements collapsible */}
        <div style={{ flexShrink: 0 }}>
          <AchievementsPanel />
        </div>

        {/* Zone 8 — footer, scrolls with content */}
        <div style={{ flexShrink: 0, marginTop: 'auto', paddingTop: 8 }}>
          <Footer />
        </div>
      </div>
    </motion.aside>
  );
}
