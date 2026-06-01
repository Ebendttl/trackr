'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import getDialogPosition from '@/utils/tourPositioning';
import { onboardingSteps } from '@/lib/onboardingSteps';

const DIALOG_WIDTH = 340;
const VIEWPORT_MARGIN = 16;

/**
 * OnboardingTour — premium interactive walkthrough for new users.
 * Rendered via createPortal directly on document.body so it is NEVER
 * clipped by sidebar overflow:hidden or CSS transforms.
 *
 * Desktop: clamped tooltip positioned near highlighted element.
 * Mobile:  fixed bottom-sheet — no positioning math needed.
 *
 * Fixes applied (Patch v1.0.6):
 *  • createPortal(…, document.body) — escapes any parent stacking context
 *  • 300ms fallback timer forces isPositioned = true if rAF measurement fails
 *  • key={step.id} on dialog motion.div forces remount on each step change
 *  • Mobile branch has NO visibility guard — always animates in immediately
 */
export default function OnboardingTour() {
  const {
    isOnboardingActive,
    currentOnboardingStep,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
  } = useUIStore();

  const dialogRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const step = onboardingSteps[currentOnboardingStep];
  const isLastStep = currentOnboardingStep === onboardingSteps.length - 1;

  // SSR guard — portals require document
  useEffect(() => { setMounted(true); }, []);

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Apply / remove spotlight on target element
  useEffect(() => {
    if (!isOnboardingActive || !step) return;

    document.querySelectorAll('.onboarding-spotlight').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.removeProperty('box-shadow');
      htmlEl.style.removeProperty('position');
      htmlEl.style.removeProperty('z-index');
      htmlEl.style.removeProperty('border-radius');
      htmlEl.classList.remove('onboarding-spotlight');
    });

    if (step.target && step.target !== 'center' && step.target !== '#map') {
      const target = document.querySelector(step.target) as HTMLElement | null;
      if (target) {
        target.classList.add('onboarding-spotlight');
        target.style.boxShadow = '0 0 0 9999px rgba(2, 4, 8, 0.85)';
        target.style.position = 'relative';
        target.style.zIndex = '9999';
        target.style.borderRadius = '12px';
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      document.querySelectorAll('.onboarding-spotlight').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.removeProperty('box-shadow');
        htmlEl.style.removeProperty('position');
        htmlEl.style.removeProperty('z-index');
        htmlEl.style.removeProperty('border-radius');
        el.classList.remove('onboarding-spotlight');
      });
    };
  }, [currentOnboardingStep, isOnboardingActive, step]);

  // Measure dialog height then compute clamped position (desktop only).
  // A 300ms fallback timer guarantees the dialog becomes visible even if the
  // rAF measurement callback fires before the ref is populated.
  const calculatePosition = useCallback(() => {
    if (isMobile || !step) return;
    setIsPositioned(false);

    const fallbackTimer = setTimeout(() => {
      setPosition({
        top: Math.max(VIEWPORT_MARGIN, (window.innerHeight - 300) / 2),
        left: Math.max(VIEWPORT_MARGIN, (window.innerWidth - DIALOG_WIDTH) / 2),
      });
      setIsPositioned(true);
    }, 300);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!dialogRef.current) return;
        clearTimeout(fallbackTimer);
        const height = dialogRef.current.offsetHeight;
        const pos = getDialogPosition(step.target, step.position, height);
        setPosition(pos);
        setIsPositioned(true);
      })
    );

    return () => clearTimeout(fallbackTimer);
  }, [step, isMobile]);

  useEffect(() => {
    const cleanup = calculatePosition();
    return cleanup;
  }, [calculatePosition]);

  useEffect(() => {
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [calculatePosition]);

  if (!mounted || !isOnboardingActive || !step) return null;

  const dialogWidth = Math.min(DIALOG_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);

  // ─── BACKDROP ─────────────────────────────────────────────────────────────
  const Backdrop = (
    <motion.div
      key="tour-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(2, 4, 8, 0.82)',
        backdropFilter: 'blur(2px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={skipOnboarding}
    />
  );

  // ─── DIALOG INNER CONTENT ─────────────────────────────────────────────────
  const DialogContent = (
    <>
      {/* Step counter */}
      <div
        style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          color: 'var(--text-tertiary)', textTransform: 'uppercase',
          marginBottom: 12, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontFamily: 'var(--font-geist-mono)',
        }}
      >
        <span>STEP {currentOnboardingStep + 1} OF {onboardingSteps.length}</span>
        <button
          onClick={skipOnboarding}
          aria-label="Close tour"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center',
            padding: '4px', borderRadius: 4, fontSize: 11,
          }}
        >
          ✕
        </button>
      </div>

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 40, height: 40, minWidth: 40, borderRadius: '50%',
            background: 'var(--accent-motion-dim)', border: '1px solid var(--border-motion)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}
        >
          {step.iconEmoji}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-dm-serif)', fontSize: 17, fontWeight: 400,
            color: 'var(--text-primary)', margin: 0, lineHeight: 1.3,
          }}
        >
          {step.title}
        </h3>
      </div>

      {/* Body */}
      <p
        style={{
          fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)',
          margin: '0 0 16px 0', fontFamily: 'var(--font-geist-sans)',
        }}
      >
        {step.body}
      </p>

      {/* Progress pills */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 16, alignItems: 'center' }}>
        {onboardingSteps.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === currentOnboardingStep ? 20 : 6 }}
            style={{
              height: 6, borderRadius: 3,
              background:
                i === currentOnboardingStep
                  ? 'var(--accent-motion)'
                  : i < currentOnboardingStep
                  ? 'rgba(124,106,247,0.4)'
                  : 'var(--border-default)',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          onClick={skipOnboarding}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 11,
            color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-sans)',
            letterSpacing: '0.06em', padding: '8px 4px', minHeight: 44,
            fontWeight: 700, textTransform: 'uppercase',
          }}
        >
          SKIP TOUR
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {currentOnboardingStep > 0 && (
            <button
              onClick={prevStep}
              style={{
                padding: '10px 16px', minHeight: 44, borderRadius: 8,
                background: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontSize: 13, fontFamily: 'var(--font-geist-sans)',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={isLastStep ? completeOnboarding : nextStep}
            style={{
              padding: '10px 20px', minHeight: 44, borderRadius: 8,
              background: isLastStep ? 'var(--accent-motion)' : 'var(--accent-motion-dim)',
              border: `1px solid ${isLastStep ? 'transparent' : 'var(--border-motion)'}`,
              color: isLastStep ? '#fff' : 'var(--accent-motion)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-geist-sans)',
            }}
          >
            {isLastStep ? 'START TRAINING →' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );

  // ─── MOBILE RENDER: Bottom Sheet (no positioning math, always visible) ─────
  if (isMobile) {
    return createPortal(
      <AnimatePresence>
        {isOnboardingActive && (
          <>
            {Backdrop}
            <motion.div
              key={`tour-mobile-${step.id}`}
              ref={dialogRef}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                zIndex: 10000,
                background: 'var(--surface-overlay)',
                borderRadius: '20px 20px 0 0',
                border: '1px solid var(--border-emphasis)',
                padding: '8px 20px 20px',
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
                maxHeight: '70vh', overflowY: 'auto',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,106,247,0.15)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-emphasis)' }} />
              </div>
              {DialogContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  // ─── DESKTOP RENDER: Clamped Positioned Tooltip ───────────────────────────
  return createPortal(
    <AnimatePresence>
      {isOnboardingActive && (
        <>
          {Backdrop}
          <motion.div
            key={`tour-desktop-${step.id}`}
            ref={dialogRef}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: dialogWidth,
              maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`,
              maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px)`,
              overflowY: 'auto',
              zIndex: 10000,
              background: 'var(--surface-overlay)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 16,
              padding: '20px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,106,247,0.15)',
              visibility: isPositioned ? 'visible' : 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{
              opacity: isPositioned ? 1 : 0,
              scale: isPositioned ? 1 : 0.94,
              y: isPositioned ? 0 : 8,
            }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {DialogContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
