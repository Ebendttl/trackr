'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, BarChart3, TrendingUp, SlidersHorizontal,
  Route, Map, Trophy, Play, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const ICON_MAP = { Zap, BarChart3, TrendingUp, SlidersHorizontal, Route, Map, Trophy, Play };

interface Step {
  id: string;
  title: string;
  body: string;
  target: string;
  icon: keyof typeof ICON_MAP;
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome to TrackR APEX',
    body: "Your personal mission control for every run and ride. Built for athletes who take their training seriously. Let's show you around — it only takes 60 seconds.",
    target: 'center',
    icon: 'Zap',
  },
  {
    id: 'stats',
    title: 'Your Command Center',
    body: 'Your total workouts, distance, and duration update here in real-time every time you log a session. Watch these numbers grow.',
    target: '.mission-stats',
    icon: 'BarChart3',
  },
  {
    id: 'intelligence',
    title: 'Performance Intelligence',
    body: 'Tap any tab to visualize your distance trends, activity split, or pace evolution over time.',
    target: '.intelligence-panel',
    icon: 'TrendingUp',
  },
  {
    id: 'filters',
    title: 'Find Any Workout Instantly',
    body: 'Search by name, filter by type, or sort by distance and duration. The filter pills update your list in real-time.',
    target: '.control-deck',
    icon: 'SlidersHorizontal',
  },
  {
    id: 'gps',
    title: 'GPS Logging Modes',
    body: 'Two ways to log: tap anywhere on the map for a single-location workout, or activate Route Trace to draw your exact path.',
    target: '.gps-ops-panel',
    icon: 'Route',
  },
  {
    id: 'map',
    title: 'Your Training Ground',
    body: 'This is where it all happens. Tap anywhere on the map to pin a workout location. Your routes appear as glowing trail lines.',
    target: '#map',
    icon: 'Map',
  },
  {
    id: 'achievements',
    title: 'Unlock Achievements',
    body: 'Hit milestones to unlock badges — from the Century Club (100km total) to the Cold Warrior (training below 12°C).',
    target: '.achievements-panel',
    icon: 'Trophy',
  },
  {
    id: 'finish',
    title: "You're Ready. Let's Go.",
    body: 'Tap anywhere on the map (or hit the + button on mobile) to log your first workout. Your first entry is waiting.',
    target: 'center',
    icon: 'Play',
  },
];

interface TooltipPos { top: number; left: number; }

function getTooltipPosition(target: string): TooltipPos | null {
  if (target === 'center' || target === '#map') return null;
  const el = document.querySelector(target);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.bottom + 12, left: Math.max(8, rect.left) };
}

/** Progress pills */
function ProgressPills({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 20 : 6 }}
          style={{
            height: 6,
            borderRadius: 3,
            background:
              i === current
                ? 'var(--accent-motion)'
                : i < current
                  ? 'rgba(124,106,247,0.4)'
                  : 'var(--border-default)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/** Inner card content — shared by desktop and mobile */
function StepContent({
  step,
  stepIndex,
  total,
  onPrev,
  onNext,
  onSkip,
  isLast,
}: {
  step: Step;
  stepIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}) {
  const Icon = ICON_MAP[step.icon];

  return (
    <>
      {/* Icon + title */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: 40, height: 40,
            background: 'var(--accent-motion-dim)',
            border: '1px solid var(--border-motion)',
          }}
        >
          <Icon size={18} color="var(--accent-motion)" />
        </div>
        <div>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'var(--accent-motion)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            Step {stepIndex + 1} of {total}
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {step.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
        {step.body}
      </p>

      {/* Progress + Controls */}
      <div className="flex items-center justify-between">
        <ProgressPills total={total} current={stepIndex} />
        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 4px', minHeight: 36 }}
          >
            Skip
          </button>
          {stepIndex > 0 && (
            <button
              onClick={onPrev}
              className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-80"
              style={{ minHeight: 36, padding: '0 10px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', background: 'var(--surface-overlay)' }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 rounded-lg font-bold transition-opacity hover:opacity-90"
            style={{
              minHeight: 36, padding: '0 14px',
              background: isLast ? 'var(--accent-motion)' : 'var(--accent-motion)',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            {isLast ? 'Start' : 'Next'}
            {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * OnboardingTour — adaptive desktop + mobile first-visit guide.
 * Desktop: 320px tooltip card positioned near target element.
 * Mobile: bottom sheet card slides up from bottom.
 */
export default function OnboardingTour() {
  const { isOnboardingActive, currentOnboardingStep, nextStep, prevStep, skipOnboarding } = useUIStore();
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const step = STEPS[currentOnboardingStep];
  const isLast = currentOnboardingStep === STEPS.length - 1;

  // Spotlight target element
  useEffect(() => {
    if (!isOnboardingActive) return;
    // Remove previous spotlight
    document.querySelectorAll('.onboarding-spotlight').forEach((el) =>
      el.classList.remove('onboarding-spotlight'),
    );

    if (step.target !== 'center' && step.target !== '#map') {
      const el = document.querySelector(step.target);
      if (el) el.classList.add('onboarding-spotlight');
    }

    // Compute desktop tooltip position
    setTooltipPos(getTooltipPosition(step.target));

    return () => {
      document.querySelectorAll('.onboarding-spotlight').forEach((el) =>
        el.classList.remove('onboarding-spotlight'),
      );
    };
  }, [isOnboardingActive, currentOnboardingStep, step.target]);

  if (!isOnboardingActive) return null;

  const sharedProps = { step, stepIndex: currentOnboardingStep, total: STEPS.length, onPrev: prevStep, onNext: nextStep, onSkip: skipOnboarding, isLast };

  return (
    <AnimatePresence mode="wait">
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[9998]"
        style={{ background: 'rgba(2,4,8,0.7)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={skipOnboarding}
      />

      {/* Mobile: bottom sheet card */}
      <motion.div
        key={`mobile-step-${currentOnboardingStep}`}
        className="fixed bottom-0 left-0 right-0 z-[10000] md:hidden"
        style={{
          background: 'var(--surface-overlay)',
          borderRadius: '20px 20px 0 0',
          border: '1px solid var(--border-emphasis)',
          padding: '24px 24px 40px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,106,247,0.2)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <StepContent {...sharedProps} />
      </motion.div>

      {/* Desktop: positional tooltip */}
      <motion.div
        key={`desktop-step-${currentOnboardingStep}`}
        className="fixed z-[10000] hidden md:block"
        style={{
          width: 320,
          top: tooltipPos ? tooltipPos.top : '50%',
          left: tooltipPos ? tooltipPos.left : '50%',
          transform: tooltipPos ? undefined : 'translate(-50%, -50%)',
          background: 'var(--surface-overlay)',
          border: '1px solid var(--border-emphasis)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,106,247,0.15)',
        }}
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={skipOnboarding}
          className="absolute top-3 right-3 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity"
          style={{ width: 28, height: 28, color: 'var(--text-tertiary)' }}
          aria-label="Close tour"
        >
          <X size={14} />
        </button>
        <StepContent {...sharedProps} />
      </motion.div>
    </AnimatePresence>
  );
}
