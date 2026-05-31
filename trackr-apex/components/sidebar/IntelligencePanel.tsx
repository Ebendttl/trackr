'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const TABS = ['Distance', 'Split', 'Pace'] as const;
type Tab = typeof TABS[number];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
      <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{payload[0].value} {payload[0].name}</p>
    </div>
  );
}

/**
 * Zone 3 — Intelligence Panel
 * Three-tab Recharts analytics: Distance Trend, Activity Split, Pace Analysis.
 */
export default function IntelligencePanel() {
  const { analyticsPanel, togglePanel } = useUIStore();
  const workouts = useWorkoutStore((s) => s.workouts);
  const [tab, setTab] = useState<Tab>('Distance');

  const last7 = workouts.slice(0, 7).reverse();
  const distanceData = last7.map((w) => ({ name: w.description.split(' on ')[1] ?? 'W', km: w.distance }));

  const joggingKm = workouts.filter((w) => w.type === 'jogging').reduce((s, w) => s + w.distance, 0);
  const bikingKm = workouts.filter((w) => w.type === 'biking').reduce((s, w) => s + w.distance, 0);
  const splitData = [
    { name: 'Jogging', value: parseFloat(joggingKm.toFixed(1)), color: 'var(--accent-motion)' },
    { name: 'Biking', value: parseFloat(bikingKm.toFixed(1)), color: 'var(--accent-speed)' },
  ].filter(d => d.value > 0);

  const joggingWorkouts = workouts.filter((w) => w.type === 'jogging');
  const paceData = joggingWorkouts.slice(0, 10).reverse().map((w) => ({
    name: w.description.split(' on ')[1] ?? 'W',
    pace: parseFloat(w.pace.toFixed(2)),
  }));

  return (
    <div className="intelligence-panel" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', marginBottom: 12, overflow: 'hidden', background: 'var(--surface-raised)' }}>
      <button
        onClick={() => togglePanel('analytics')}
        className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity"
        style={{ background: 'transparent' }}
        aria-expanded={analyticsPanel}
      >
        <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <BarChart2 size={14} style={{ color: 'var(--accent-motion)' }} />
          Intelligence Panel
        </span>
        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transform: analyticsPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <AnimatePresence>
        {analyticsPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4">
              {/* Tab selector */}
              <div className="flex gap-1 mb-3" style={{ borderRadius: 'var(--radius-sm)', background: 'var(--surface-overlay)', padding: 3 }}>
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1, padding: '4px 0', borderRadius: 4, fontSize: '10px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.2s',
                      background: tab === t ? 'var(--accent-motion-dim)' : 'transparent',
                      color: tab === t ? 'var(--text-accent)' : 'var(--text-tertiary)',
                      border: tab === t ? '1px solid var(--border-motion)' : '1px solid transparent',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ height: 120 }}>
                {tab === 'Distance' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={distanceData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-motion)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--accent-motion)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 9, fontFamily: 'var(--font-geist-mono)' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="km" name="km" stroke="var(--accent-motion)" strokeWidth={2} fill="url(#distGrad)" animationDuration={800} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {tab === 'Split' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={splitData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" nameKey="name" animationBegin={0} animationDuration={600}>
                        {splitData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {tab === 'Pace' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={paceData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 9, fontFamily: 'var(--font-geist-mono)' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="pace" name="min/km" stroke="var(--accent-speed)" strokeWidth={2} dot={{ fill: 'var(--accent-speed)', r: 3 }} animationDuration={600} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
