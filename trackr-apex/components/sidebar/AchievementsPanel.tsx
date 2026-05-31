'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Award } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { evaluateAchievements } from '@/lib/achievements';
import { useEffect } from 'react';

/**
 * Zone 7 — Achievements Panel
 * 8 gamified achievement cards with locked/unlocked states and unlock animations.
 */
export default function AchievementsPanel() {
  const { achievementsPanel, togglePanel, achievements, updateAchievements, addNotification } = useUIStore();
  const workouts = useWorkoutStore((s) => s.workouts);

  // Re-evaluate achievements whenever workouts change
  useEffect(() => {
    const { achievements: updated, newlyUnlocked } = evaluateAchievements(workouts, achievements);
    if (newlyUnlocked.length > 0) {
      updateAchievements(updated);
      newlyUnlocked.forEach((id) => {
        const ach = updated.find((a) => a.id === id);
        if (ach) {
          addNotification({ type: 'achievement', title: `🏅 Achievement Unlocked!`, message: ach.title });
        }
      });
    }
  }, [workouts]);

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', marginTop: 12, marginBottom: 12, overflow: 'hidden', background: 'var(--surface-raised)' }}>
      <button
        onClick={() => togglePanel('achievements')}
        className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity"
        aria-expanded={achievementsPanel}
      >
        <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <Award size={14} style={{ color: 'var(--accent-energy)' }} />
          Achievements
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '10px', background: 'var(--accent-energy-dim)', color: 'var(--accent-energy)', padding: '1px 6px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(245,158,11,0.2)' }}>
            {achievements.filter((a) => a.unlockedAt).length}/{achievements.length}
          </span>
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', transform: achievementsPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <AnimatePresence>
        {achievementsPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              {achievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  layout
                  style={{
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    background: ach.unlockedAt ? 'rgba(245,158,11,0.05)' : 'var(--surface-overlay)',
                    border: `1px solid ${ach.unlockedAt ? 'rgba(245,158,11,0.25)' : 'var(--border-subtle)'}`,
                    opacity: ach.unlockedAt ? 1 : 0.4,
                    filter: ach.unlockedAt ? 'none' : 'grayscale(1)',
                    animation: ach.unlockedAt ? 'achievementGlow 2s ease-in-out' : 'none',
                  }}
                  title={ach.condition}
                >
                  <span style={{ fontSize: '22px', display: 'block', marginBottom: 4 }}>{ach.icon}</span>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{ach.title}</p>
                  {ach.unlockedAt ? (
                    <p style={{ fontSize: '9px', color: 'var(--accent-energy)', fontFamily: 'var(--font-geist-mono)' }}>
                      {new Date(ach.unlockedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </p>
                  ) : (
                    <p style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>LOCKED</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
