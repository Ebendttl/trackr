import { create } from 'zustand';
import { Achievement } from '@/types/achievements';
import { Notification } from '@/types/weather';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements';
import { loadAchievements, saveAchievements, loadTheme, saveTheme } from '@/lib/persistence';
import { nanoid } from 'nanoid';

type Theme = 'void' | 'eclipse' | 'arctic' | 'carbon';

interface UIStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;

  isFormOpen: boolean;
  setFormOpen: (open: boolean) => void;

  achievementsPanel: boolean;
  analyticsPanel: boolean;
  gpsPanel: boolean;
  togglePanel: (panel: 'achievements' | 'analytics' | 'gps') => void;

  achievements: Achievement[];
  hydrateAchievements: () => void;
  updateAchievements: (achievements: Achievement[]) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: 'void',
  setTheme: (theme) => {
    saveTheme(theme);
    set({ theme });
  },

  notifications: [],
  addNotification: (n) => {
    const id = nanoid(6);
    set((s) => ({ notifications: [...s.notifications, { ...n, id }] }));
    setTimeout(() => get().dismissNotification(id), n.duration ?? 4000);
  },
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  isFormOpen: false,
  setFormOpen: (open) => set({ isFormOpen: open }),

  achievementsPanel: false,
  analyticsPanel: true,
  gpsPanel: true,
  togglePanel: (panel) =>
    set((s) => ({
      achievementsPanel: panel === 'achievements' ? !s.achievementsPanel : s.achievementsPanel,
      analyticsPanel: panel === 'analytics' ? !s.analyticsPanel : s.analyticsPanel,
      gpsPanel: panel === 'gps' ? !s.gpsPanel : s.gpsPanel,
    })),

  achievements: ACHIEVEMENT_DEFINITIONS,
  hydrateAchievements: () => {
    const stored = loadAchievements();
    const savedTheme = loadTheme() as Theme | null;
    if (stored) set({ achievements: stored });
    if (savedTheme) set({ theme: savedTheme });
  },
  updateAchievements: (achievements) => {
    saveAchievements(achievements);
    set({ achievements });
  },
}));
