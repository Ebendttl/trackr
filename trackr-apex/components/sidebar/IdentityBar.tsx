'use client';
import { motion } from 'framer-motion';
import { Palette, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { useState } from 'react';

/**
 * Zone 1 — Identity Bar
 * Logo, wordmark, APEX badge, theme toggle, and onboarding replay button.
 * Hidden on mobile — replaced by MobileTopBar.
 */
export default function IdentityBar() {
  const [themeOpen, setThemeOpen] = useState(false);
  const startOnboarding = useUIStore((s) => s.startOnboarding);

  return (
    <div
      className="flex items-center justify-between px-5 py-4 shrink-0"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Logo + Wordmark */}
      <div className="flex items-center gap-3">
        {/* Animated SVG Logo — draws itself on load */}
        <motion.svg
          width="32" height="32" viewBox="0 0 32 32" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <motion.path
            d="M4 28 L12 8 L16 18 L20 12 L28 4"
            stroke="url(#logoGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <motion.circle cx="28" cy="4" r="2.5" fill="var(--accent-speed)"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          />
          <defs>
            <linearGradient id="logoGrad" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent-motion)" />
              <stop offset="1" stopColor="var(--accent-speed)" />
            </linearGradient>
          </defs>
        </motion.svg>

        <div className="flex items-center gap-2">
          <span
            className="trackr-wordmark"
            style={{
              fontFamily: 'var(--font-dm-serif)',
              fontSize: '22px',
              letterSpacing: '0.15em',
              background: 'linear-gradient(135deg, var(--accent-motion), var(--accent-speed))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            TRACKR
          </span>
          <span
            className="apex-badge"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-energy-dim)',
              color: 'var(--accent-energy)',
              border: '1px solid rgba(245,158,11,0.2)',
              lineHeight: 1.6,
            }}
          >
            APEX
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Tour replay button */}
        <button
          onClick={() => startOnboarding()}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:opacity-80"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
          aria-label="Replay tour"
          title="Replay onboarding tour"
        >
          <HelpCircle size={13} />
        </button>

        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:opacity-80"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
            aria-label="Open theme selector"
          >
            <Palette size={14} />
          </button>
          {themeOpen && <ThemeSelector onClose={() => setThemeOpen(false)} />}
        </div>
      </div>
    </div>
  );
}
