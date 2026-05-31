'use client';
import { motion } from 'framer-motion';
import { X, Sparkles, Flame, Eye, Cloud } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const THEMES = [
  { id: 'void' as const, name: 'Void', desc: 'Sleek Deep Space', icon: <Flame size={14} className="text-indigo-400" /> },
  { id: 'eclipse' as const, name: 'Eclipse', desc: 'Solar Bronze Glow', icon: <Sparkles size={14} className="text-amber-500" /> },
  { id: 'arctic' as const, name: 'Arctic', desc: 'Polar Ice Refraction', icon: <Cloud size={14} className="text-sky-400" /> },
  { id: 'carbon' as const, name: 'Carbon', desc: 'Pure OLED Contrast', icon: <Eye size={14} className="text-neutral-400" /> },
];

/**
 * Radial / floating panel selector menu for dynamic theme switching.
 */
export default function ThemeSelector({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useUIStore();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{
          background: 'var(--surface-overlay)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-float)',
          borderRadius: 'var(--radius-lg)',
        }}
        className="absolute right-0 top-10 z-50 p-2 w-56 flex flex-col gap-1"
      >
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-subtle)] mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] font-mono">
            Mission Theme
          </span>
          <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
            <X size={12} />
          </button>
        </div>

        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTheme(t.id);
              onClose();
            }}
            style={{
              background: theme === t.id ? 'var(--accent-motion-dim)' : 'transparent',
              borderColor: theme === t.id ? 'var(--border-motion)' : 'transparent',
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all border hover:border-[var(--border-emphasis)] group"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--surface-raised)] border border-[var(--border-subtle)] group-hover:border-[var(--border-emphasis)]">
              {t.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)]">{t.name}</p>
              <p className="text-[9px] text-[var(--text-tertiary)] mt-0.5 truncate">{t.desc}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </>
  );
}
