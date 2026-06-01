interface DialogPosition {
  top: number;
  left: number;
}

const DIALOG_WIDTH = 340;       // px — fixed width
const VIEWPORT_MARGIN = 16;     // px — minimum gap from any viewport edge

/**
 * Calculates a fully-visible positioned coordinate set for the tour dialog.
 * Keeps it centered for 'center' targets or clamps it perfectly within viewport boundaries.
 */
function getDialogPosition(
  targetSelector: string,
  preferredSide: 'top' | 'bottom' | 'left' | 'right' | 'center',
  dialogHeight: number          // measured at runtime via ref
): DialogPosition {
  if (typeof window === 'undefined') {
    return { top: 100, left: 100 };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // For center steps (welcome, finish, map) — center in viewport
  if (preferredSide === 'center' || !targetSelector || targetSelector === 'center') {
    return {
      top: Math.max(VIEWPORT_MARGIN, (vh - dialogHeight) / 2),
      left: Math.max(VIEWPORT_MARGIN, (vw - DIALOG_WIDTH) / 2),
    };
  }

  const target = document.querySelector(targetSelector);
  if (!target) {
    // Fallback: center in viewport
    return {
      top: Math.max(VIEWPORT_MARGIN, (vh - dialogHeight) / 2),
      left: Math.max(VIEWPORT_MARGIN, (vw - DIALOG_WIDTH) / 2),
    };
  }

  const rect = target.getBoundingClientRect();
  const GAP = 12; // px gap between target and dialog

  let top: number;
  let left: number;

  // Calculate ideal position based on preferred side
  switch (preferredSide) {
    case 'bottom':
      top = rect.bottom + GAP;
      left = rect.left;
      break;
    case 'top':
      top = rect.top - dialogHeight - GAP;
      left = rect.left;
      break;
    case 'right':
      top = rect.top;
      left = rect.right + GAP;
      break;
    case 'left':
      top = rect.top;
      left = rect.left - DIALOG_WIDTH - GAP;
      break;
    default:
      top = rect.bottom + GAP;
      left = rect.left;
  }

  // ─── CLAMP: keep dialog fully inside the viewport ───────────────────────
  
  // If dialog would overflow the BOTTOM — flip to position ABOVE the target
  if (top + dialogHeight > vh - VIEWPORT_MARGIN) {
    top = rect.top - dialogHeight - GAP;
  }

  // If it STILL overflows top (target is near top of screen) — center vertically
  if (top < VIEWPORT_MARGIN) {
    top = VIEWPORT_MARGIN;
  }

  // If dialog would overflow the RIGHT edge — push left
  if (left + DIALOG_WIDTH > vw - VIEWPORT_MARGIN) {
    left = vw - DIALOG_WIDTH - VIEWPORT_MARGIN;
  }

  // If dialog would overflow the LEFT edge — push right
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN;
  }

  // Final safety clamp — absolute minimum top
  top = Math.max(VIEWPORT_MARGIN, top);

  return { top, left };
}

export default getDialogPosition;
