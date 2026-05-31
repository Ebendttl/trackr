'use client';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useDebounce } from '@/hooks/useDebounce';
import FilterPills from '@/components/ui/FilterPills';

const SORT_MODES = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'distance-desc', label: 'Distance ↓' },
  { value: 'duration-desc', label: 'Duration ↓' },
] as const;

type SortMode = 'date-desc' | 'date-asc' | 'distance-desc' | 'duration-desc';

/**
 * Zone 4 — Control Deck
 * Debounced search, filter pills, compact sort button.
 */
export default function ControlDeck() {
  const { searchQuery, setSearchQuery, sortMode, setSortMode } = useWorkoutStore();
  const sortIndex = SORT_MODES.findIndex((m) => m.value === sortMode);

  const cycleSortMode = () => {
    const next = SORT_MODES[(sortIndex + 1) % SORT_MODES.length];
    setSortMode(next.value as SortMode);
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* Search */}
      <div className="relative flex items-center">
        <Search size={13} className="absolute left-3 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm transition-all"
          style={{
            background: 'var(--surface-overlay)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-geist-sans)',
            fontSize: '12px',
            outline: 'none',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-motion)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          aria-label="Search workouts"
        />
      </div>

      {/* Filter + Sort row */}
      <div className="flex items-center justify-between gap-2">
        <FilterPills />
        <button
          onClick={cycleSortMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors shrink-0"
          style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
          title={`Sort: ${SORT_MODES[sortIndex].label}`}
        >
          <ArrowUpDown size={10} />
          {SORT_MODES[sortIndex].label}
        </button>
      </div>
    </div>
  );
}
