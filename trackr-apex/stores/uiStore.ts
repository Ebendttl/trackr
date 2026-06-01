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

  // Onboarding tour
  hasCompletedOnboarding: boolean;
  isOnboardingActive: boolean;
  currentOnboardingStep: number;
  startOnboarding: () => void;
  replayOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const ONBOARDING_KEY = 'trackr-apex-onboarding';
const TOTAL_STEPS = 8;

function loadOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
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
    const completed = loadOnboardingCompleted();
    if (stored) set({ achievements: stored });
    if (savedTheme) set({ theme: savedTheme });
    set({ hasCompletedOnboarding: completed });
    // Auto-trigger tour on first visit (800ms delay)
    if (!completed) {
      setTimeout(() => set({ isOnboardingActive: true }), 800);
    }
  },
  updateAchievements: (achievements) => {
    saveAchievements(achievements);
    set({ achievements });
  },

  // Onboarding tour state
  hasCompletedOnboarding: false,
  isOnboardingActive: false,
  currentOnboardingStep: 0,

  startOnboarding: () => set({ isOnboardingActive: true, currentOnboardingStep: 0 }),

  replayOnboarding: () => set({ isOnboardingActive: true, currentOnboardingStep: 0 }),

  nextStep: () => {
    const { currentOnboardingStep } = get();
    if (currentOnboardingStep < TOTAL_STEPS - 1) {
      set({ currentOnboardingStep: currentOnboardingStep + 1 });
    } else {
      get().completeOnboarding();
    }
  },

  prevStep: () => {
    const { currentOnboardingStep } = get();
    if (currentOnboardingStep > 0) {
      set({ currentOnboardingStep: currentOnboardingStep - 1 });
    }
  },

  skipOnboarding: () => {
    if (typeof window !== 'undefined') localStorage.setItem(ONBOARDING_KEY, 'true');
    set({ isOnboardingActive: false, hasCompletedOnboarding: true });
  },

  completeOnboarding: () => {
    if (typeof window !== 'undefined') localStorage.setItem(ONBOARDING_KEY, 'true');
    set({ isOnboardingActive: false, hasCompletedOnboarding: true });
  },
}));
