'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Navigation, Route, Trash2, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useMapStore } from '@/stores/mapStore';
import { calcRouteDistance } from '@/lib/calculations';

/**
 * Zone 5 — GPS Operations Panel
 * Mission-panel UI for switching between Single Point and Route Trace modes.
 */
export default function GPSOpsPanel() {
  const { gpsPanel, togglePanel } = useUIStore();
  const { drawingMode, toggleDrawingMode, routePoints, clearRoute, calculatedRouteDistance } = useMapStore();

  return (
    <div className="gps-ops-panel" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', marginBottom: 12, overflow: 'hidden', background: 'var(--surface-raised)' }}>
      <button
        onClick={() => togglePanel('gps')}
        className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity"
        aria-expanded={gpsPanel}
      >
        <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Navigation size={13} style={{ color: 'var(--accent-speed)' }} />
          GPS Operations
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', transform: gpsPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <AnimatePresence>
        {gpsPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 flex flex-col gap-3">
              {/* Mode toggles */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  style={{
                    borderRadius: 'var(--radius-md)', padding: '10px 12px',
                    background: !drawingMode ? 'var(--accent-motion-dim)' : 'var(--surface-overlay)',
                    border: `1px solid ${!drawingMode ? 'var(--border-motion)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => drawingMode && toggleDrawingMode()}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: !drawingMode ? 'var(--accent-motion)' : 'var(--text-tertiary)', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: !drawingMode ? 'var(--text-accent)' : 'var(--text-tertiary)' }}>SINGLE POINT</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Click map to set location</p>
                </div>

                <div
                  style={{
                    borderRadius: 'var(--radius-md)', padding: '10px 12px',
                    background: drawingMode ? 'var(--accent-speed-dim)' : 'var(--surface-overlay)',
                    border: `1px solid ${drawingMode ? 'var(--border-speed)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => !drawingMode && toggleDrawingMode()}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {drawingMode ? (
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-speed)', display: 'inline-block' }} />
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', display: 'inline-block' }} />
                    )}
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: drawingMode ? 'var(--accent-speed)' : 'var(--text-tertiary)' }}>ROUTE TRACE</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Trace a multi-point path</p>
                </div>
              </div>

              {/* Live telemetry when drawing */}
              <AnimatePresence>
                {drawingMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-overlay)', border: '1px solid var(--border-speed)', padding: '10px 12px' }}
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-geist-mono)' }}>WAYPOINTS</p>
                        <p style={{ fontSize: '20px', fontFamily: 'var(--font-geist-mono)', color: 'var(--accent-speed)', fontWeight: 500 }}>{routePoints.length}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-geist-mono)' }}>DISTANCE</p>
                        <p style={{ fontSize: '20px', fontFamily: 'var(--font-geist-mono)', color: 'var(--accent-speed)', fontWeight: 500 }}>{calculatedRouteDistance.toFixed(2)} <span style={{ fontSize: '11px' }}>km</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { clearRoute(); toggleDrawingMode(); }}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--accent-danger)', letterSpacing: '0.06em' }}
                      >
                        <Trash2 size={11} /> Clear
                      </button>
                      <button
                        onClick={() => { /* Handled by map store — triggers form open */ }}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors"
                        style={{ background: 'var(--accent-speed-dim)', border: '1px solid var(--border-speed)', color: 'var(--accent-speed)', letterSpacing: '0.06em' }}
                      >
                        <CheckCircle2 size={11} /> Complete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
