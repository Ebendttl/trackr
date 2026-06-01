'use client';
import { useState } from 'react';
import { Palette } from 'lucide-react';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { TourReplayPill } from '@/components/sidebar/WelcomeBanner';

/**
 * MobileTopBar — fixed 56px header shown only on mobile (< md).
 * Contains the TrackR APEX logo, tour replay button, and theme toggle.
 */
export default function MobileTopBar() {
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:hidden"
      style={{
        height: '56px',
        background: 'var(--surface-base)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo + Wordmark */}
      <div className="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 28 L12 8 L16 18 L20 12 L28 4"
            stroke="url(#mobileLogoGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="4" r="2.5" fill="var(--accent-speed)" />
          <defs>
            <linearGradient id="mobileLogoGrad" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent-motion)" />
              <stop offset="1" stopColor="var(--accent-speed)" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className="trackr-wordmark"
          style={{
            fontFamily: 'var(--font-dm-serif)',
            fontSize: '18px',
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, var(--accent-motion), var(--accent-speed))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TRACKR
        </span>
        <span
          className="apex-badge"
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '9px',
            padding: '2px 6px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent-energy-dim)',
            color: 'var(--accent-energy)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          APEX
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Tour replay — pill when completed, nothing when first visit (banner is in sidebar) */}
        <TourReplayPill />

        <div className="relative">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            aria-label="Change theme"
            className="flex items-center justify-center"
            style={{ width: 40, height: 40 }}
          >
            <Palette size={18} color="var(--text-secondary)" />
          </button>
          {themeOpen && <ThemeSelector onClose={() => setThemeOpen(false)} />}
        </div>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 32,
            height: 32,
            background: 'var(--accent-motion-dim)',
            border: '1px solid var(--border-motion)',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--accent-motion)', fontWeight: 600 }}>N</span>
        </div>
      </div>
    </header>
  );
}
