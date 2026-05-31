'use client';
import { motion } from 'framer-motion';
import IdentityBar from './IdentityBar';
import MissionStats from './MissionStats';
import IntelligencePanel from './IntelligencePanel';
import ControlDeck from './ControlDeck';
import GPSOpsPanel from './GPSOpsPanel';
import WorkoutFeed from './WorkoutFeed';
import AchievementsPanel from './AchievementsPanel';
import Footer from './Footer';

/**
 * Sidebar — the Mission Command Center.
 * 420px fixed width, 8 stacked zones, scrollable inner content.
 */
export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col h-screen overflow-hidden"
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
      <IdentityBar />

      <div
        className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-0"
        style={{ padding: '0 20px 20px' }}
      >
        <MissionStats />
        <IntelligencePanel />
        <ControlDeck />
        <GPSOpsPanel />
        <WorkoutFeed />
        <AchievementsPanel />
        <Footer />
      </div>
    </motion.aside>
  );
}
