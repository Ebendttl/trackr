'use client';

import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

/**
 * WelcomeBanner — shown in two states:
 *
 * STATE A (first visit): Full glowing banner below IdentityBar.
 *   Animates in with a 1.2s delay after page load, impossible to miss.
 *
 * STATE B (returning user): Nothing — the compact pill lives inside
 *   IdentityBar.tsx so this component renders null.
 */
export default function WelcomeBanner() {
  const hasCompletedOnboarding = useUIStore((s) => s.hasCompletedOnboarding);
  const replayOnboarding = useUIStore((s) => s.replayOnboarding);

  // Returning users get the compact pill inside IdentityBar — not here
  if (hasCompletedOnboarding) return null;

  return (
    <motion.button
      onClick={replayOnboarding}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="welcome-shimmer"
      style={{
        width: '100%',
        padding: '14px 18px',
        marginBottom: 16,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(124,106,247,0.18) 0%, rgba(0,212,200,0.10) 100%)',
        border: '1px solid rgba(124,106,247,0.35)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        overflow: 'hidden',
      }}
    >
      {/* Rocket in glowing circle */}
      <div
        style={{
          width: 44, height: 44, minWidth: 44, borderRadius: '50%',
          background: 'rgba(124,106,247,0.2)',
          border: '1px solid rgba(124,106,247,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 0 16px rgba(124,106,247,0.3)',
          flexShrink: 0,
        }}
      >
        🚀
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-serif)',
            fontSize: 15,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 3,
          }}
        >
          Welcome to TrackR APEX!
        </div>
        <div
          style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}
        >
          Let me show you around → 60 sec tour
        </div>
      </div>

      <ChevronRight size={18} color="var(--accent-motion)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
    </motion.button>
  );
}

/**
 * TourReplayPill — compact pill shown inside IdentityBar for returning users.
 * Import and render this inside IdentityBar.tsx.
 */
export function TourReplayPill() {
  const hasCompletedOnboarding = useUIStore((s) => s.hasCompletedOnboarding);
  const replayOnboarding = useUIStore((s) => s.replayOnboarding);

  if (!hasCompletedOnboarding) return null;

  return (
    <motion.button
      onClick={replayOnboarding}
      whileHover={{ backgroundColor: 'var(--accent-motion)', color: '#fff' }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', height: 28, borderRadius: 999,
        background: 'var(--accent-motion-dim)',
        border: '1px solid var(--border-motion)',
        color: 'var(--accent-motion)',
        cursor: 'pointer',
        fontFamily: 'var(--font-geist-sans)',
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}
    >
      <PlayCircle size={13} />
      <span>Tour</span>
    </motion.button>
  );
}
