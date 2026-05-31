'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, Award } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const iconMap = {
  success: <CheckCircle className="text-emerald-400 shrink-0" size={16} />,
  info: <Info className="text-sky-400 shrink-0" size={16} />,
  error: <AlertTriangle className="text-red-400 shrink-0" size={16} />,
  achievement: <Award className="text-amber-400 shrink-0" size={18} />,
};

const borderClassMap = {
  success: 'border-l-4 border-emerald-500',
  info: 'border-l-4 border-sky-500',
  error: 'border-l-4 border-red-500',
  achievement: 'border-l-4 border-amber-500',
};

/**
 * Custom stackable glassmorphic notification toast overlay.
 */
export default function ToastContainer() {
  const { notifications, dismissNotification } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-float)',
            }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl ${borderClassMap[toast.type]}`}
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissNotification(toast.id)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-0.5 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
