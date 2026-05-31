'use client';
import { useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';
import MissionStats from '@/components/sidebar/MissionStats';
import IntelligencePanel from '@/components/sidebar/IntelligencePanel';
import ControlDeck from '@/components/sidebar/ControlDeck';
import GPSOpsPanel from '@/components/sidebar/GPSOpsPanel';
import WorkoutFeed from '@/components/sidebar/WorkoutFeed';
import AchievementsPanel from '@/components/sidebar/AchievementsPanel';
import Footer from '@/components/sidebar/Footer';

const PEEK_HEIGHT = 80; // px — drag handle + compact stats row

/**
 * BottomSheet — the mobile replacement for the sidebar.
 * Two snap states: 'peek' (80px) and 'expanded' (75vh).
 * Drag handle at the top with Framer Motion spring snapping.
 */
export default function BottomSheet() {
  const [expanded, setExpanded] = useState(false);
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const EXPANDED_HEIGHT = Math.round(screenHeight * 0.75);
  const dragY = useMotionValue(0);

  const workouts = useWorkoutStore((s) => s.workouts);
  const stats = useMemo(() => {
    const distance = workouts.reduce((s, w) => s + w.distance, 0);
    const duration = workouts.reduce((s, w) => s + w.duration, 0);
    return { count: workouts.length, distance: parseFloat(distance.toFixed(1)), duration };
  }, [workouts]);

  const handleDragEnd = (_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
    const threshold = (EXPANDED_HEIGHT - PEEK_HEIGHT) / 2;
    if (info.velocity.y > 300 || info.offset.y > threshold) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  return (
    <motion.div
      className="fixed left-0 right-0 bottom-0 z-40 bottom-sheet md:hidden"
      style={{
        background: 'var(--surface-base)',
        borderRadius: '20px 20px 0 0',
        borderTop: '1px solid var(--border-default)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.6), 0 -1px 0 var(--border-subtle)',
        touchAction: 'none',
        y: dragY,
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: EXPANDED_HEIGHT - PEEK_HEIGHT }}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
      animate={{ y: expanded ? 0 : EXPANDED_HEIGHT - PEEK_HEIGHT }}
      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
    >
      {/* Drag Handle */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-emphasis)' }} />
      </div>

      {/* Compact Stats Row — always visible at peek */}
      <div className="flex justify-around px-4 pb-3">
        {[
          { icon: '🔥', value: stats.count, label: 'WORKOUTS' },
          { icon: '🗺️', value: `${stats.distance}km`, label: 'DISTANCE' },
          { icon: '⏱️', value: `${stats.duration}min`, label: 'DURATION' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-0.5">
            <span className="stat-label" style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.08em', fontFamily: 'var(--font-geist-mono)', textTransform: 'uppercase' }}>
              {stat.label}
            </span>
            <span className="stat-value" style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 16, color: 'var(--text-primary)', fontWeight: 500 }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Expanded Content — scrollable, only shown when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              height: EXPANDED_HEIGHT - PEEK_HEIGHT - 8,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch' as const,
              padding: '0 16px 16px',
            }}
          >
            <IntelligencePanel />
            <ControlDeck />
            <GPSOpsPanel />
            <div style={{ flex: '1 1 auto', minHeight: 0 }}>
              <WorkoutFeed />
            </div>
            <AchievementsPanel />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
