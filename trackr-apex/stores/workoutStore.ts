import { create } from 'zustand';
import { Workout } from '@/types/workout';
import { loadWorkouts, saveWorkouts } from '@/lib/persistence';

interface TotalStats {
  count: number;
  distance: number;
  duration: number;
}

interface WorkoutStore {
  workouts: Workout[];
  hydrated: boolean;

  // Actions
  hydrate: () => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  clearAll: () => void;

  // UI State
  activeWorkoutId: string | null;
  setActiveWorkout: (id: string | null) => void;
  pendingDeleteId: string | null;
  setPendingDeleteId: (id: string | null) => void;

  // Filter / Sort
  filterType: 'all' | 'jogging' | 'biking';
  setFilterType: (type: 'all' | 'jogging' | 'biking') => void;
  sortMode: 'date-desc' | 'date-asc' | 'distance-desc' | 'duration-desc';
  setSortMode: (mode: WorkoutStore['sortMode']) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Computed
  filteredWorkouts: () => Workout[];
  totalStats: () => TotalStats;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],
  hydrated: false,

  hydrate: () => {
    const workouts = loadWorkouts();
    set({ workouts, hydrated: true });
  },

  addWorkout: (workout) => {
    const workouts = [workout, ...get().workouts];
    saveWorkouts(workouts);
    set({ workouts });
  },

  updateWorkout: (id, updates) => {
    const workouts = get().workouts.map((w) =>
      w.id === id ? ({ ...w, ...updates } as Workout) : w
    );
    saveWorkouts(workouts);
    set({ workouts });
  },

  deleteWorkout: (id) => {
    const workouts = get().workouts.filter((w) => w.id !== id);
    saveWorkouts(workouts);
    set({ workouts });
  },

  clearAll: () => {
    saveWorkouts([]);
    set({ workouts: [] });
  },

  activeWorkoutId: null,
  setActiveWorkout: (id) => set({ activeWorkoutId: id }),

  pendingDeleteId: null,
  setPendingDeleteId: (id) => set({ pendingDeleteId: id }),

  filterType: 'all',
  setFilterType: (filterType) => set({ filterType }),

  sortMode: 'date-desc',
  setSortMode: (sortMode) => set({ sortMode }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  filteredWorkouts: () => {
    const { workouts, filterType, sortMode, searchQuery } = get();
    let result = workouts.filter((w) => {
      const matchesType = filterType === 'all' || w.type === filterType;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        w.description.toLowerCase().includes(query) ||
        w.type.includes(query) ||
        w.date.includes(query);
      return matchesType && matchesSearch;
    });

    switch (sortMode) {
      case 'date-desc':
        result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        result = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'distance-desc':
        result = result.sort((a, b) => b.distance - a.distance);
        break;
      case 'duration-desc':
        result = result.sort((a, b) => b.duration - a.duration);
        break;
    }
    return result;
  },

  totalStats: () => {
    const { workouts } = get();
    return {
      count: workouts.length,
      distance: workouts.reduce((s, w) => s + w.distance, 0),
      duration: workouts.reduce((s, w) => s + w.duration, 0),
    };
  },
}));
