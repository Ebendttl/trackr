export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: string;
  unlockedAt: string | null; // ISO string or null
}

export type AchievementId =
  | 'century-club'
  | 'speed-demon'
  | 'explorer'
  | 'cold-warrior'
  | 'early-bird'
  | 'hydration-hero'
  | 'consistent'
  | 'rain-runner';
