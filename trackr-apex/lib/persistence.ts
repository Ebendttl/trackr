import { Workout } from '@/types/workout';
import { Achievement } from '@/types/achievements';

const WORKOUTS_KEY = 'trackr-apex-workouts';
const ACHIEVEMENTS_KEY = 'trackr-apex-achievements';
const THEME_KEY = 'trackr-apex-theme';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadWorkouts(): Workout[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(WORKOUTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Workout[];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

export function loadAchievements(): Achievement[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Achievement[];
  } catch {
    return null;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export function loadTheme(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(THEME_KEY);
}

export function saveTheme(theme: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, theme);
}
