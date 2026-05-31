import { Workout } from '@/types/workout';
import { Achievement, AchievementId } from '@/types/achievements';

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'century-club',
    icon: '💯',
    title: 'Century Club',
    description: 'Log a total of 100+ km across all workouts',
    condition: 'Total distance ≥ 100 km',
    unlockedAt: null,
  },
  {
    id: 'speed-demon',
    icon: '⚡',
    title: 'Speed Demon',
    description: 'Run a pace ≤ 4.5 min/km or cycle at ≥ 30 km/h',
    condition: 'Single workout performance threshold',
    unlockedAt: null,
  },
  {
    id: 'explorer',
    icon: '🗺️',
    title: 'Explorer',
    description: 'Log a workout with a drawn GPS route of 3+ waypoints',
    condition: 'GPS route with ≥ 3 waypoints',
    unlockedAt: null,
  },
  {
    id: 'cold-warrior',
    icon: '❄️',
    title: 'Cold Warrior',
    description: 'Log a workout when the temperature is below 12°C',
    condition: 'Weather temp < 12°C',
    unlockedAt: null,
  },
  {
    id: 'early-bird',
    icon: '🌅',
    title: 'Early Bird',
    description: 'Log a workout before 7am',
    condition: 'Workout logged before 07:00',
    unlockedAt: null,
  },
  {
    id: 'hydration-hero',
    icon: '💧',
    title: 'Hydration Hero',
    description: 'Log 5 or more workouts in a single calendar week',
    condition: '5+ workouts in one week',
    unlockedAt: null,
  },
  {
    id: 'consistent',
    icon: '🗓️',
    title: 'Consistent',
    description: 'Log workouts on 3 consecutive calendar days',
    condition: '3 consecutive days of activity',
    unlockedAt: null,
  },
  {
    id: 'rain-runner',
    icon: '🌧️',
    title: 'Rain Runner',
    description: 'Log a workout when it\'s actively raining',
    condition: 'Rain weather condition at workout time',
    unlockedAt: null,
  },
];

export function evaluateAchievements(
  workouts: Workout[],
  existingAchievements: Achievement[]
): { achievements: Achievement[]; newlyUnlocked: AchievementId[] } {
  const now = new Date().toISOString();
  const newlyUnlocked: AchievementId[] = [];

  const updated = existingAchievements.map((ach) => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let shouldUnlock = false;
    const id = ach.id as AchievementId;

    switch (id) {
      case 'century-club':
        shouldUnlock = workouts.reduce((s, w) => s + w.distance, 0) >= 100;
        break;
      case 'speed-demon':
        shouldUnlock = workouts.some(
          (w) =>
            (w.type === 'jogging' && w.pace <= 4.5) ||
            (w.type === 'biking' && w.speed >= 30)
        );
        break;
      case 'explorer':
        shouldUnlock = workouts.some((w) => w.route.length >= 3);
        break;
      case 'cold-warrior':
        shouldUnlock = workouts.some((w) => w.weather && w.weather.temp < 12);
        break;
      case 'early-bird':
        shouldUnlock = workouts.some(() => {
          // Check hour of the workout date
          return workouts.some((w) => new Date(w.date).getHours() < 7);
        });
        break;
      case 'hydration-hero': {
        // Group by ISO week
        const weekCounts: Record<string, number> = {};
        workouts.forEach((w) => {
          const d = new Date(w.date);
          const startOfWeek = new Date(d);
          startOfWeek.setDate(d.getDate() - d.getDay());
          const key = startOfWeek.toISOString().slice(0, 10);
          weekCounts[key] = (weekCounts[key] ?? 0) + 1;
        });
        shouldUnlock = Object.values(weekCounts).some((c) => c >= 5);
        break;
      }
      case 'consistent': {
        const days = [...new Set(workouts.map((w) => w.date.slice(0, 10)))].sort();
        let streak = 1;
        for (let i = 1; i < days.length; i++) {
          const prev = new Date(days[i - 1]);
          const curr = new Date(days[i]);
          const diff = (curr.getTime() - prev.getTime()) / 86400000;
          if (diff === 1) {
            streak++;
            if (streak >= 3) { shouldUnlock = true; break; }
          } else {
            streak = 1;
          }
        }
        break;
      }
      case 'rain-runner':
        shouldUnlock = workouts.some(
          (w) => w.weather && w.weather.code >= 51 && w.weather.code <= 82
        );
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push(id);
      return { ...ach, unlockedAt: now };
    }
    return ach;
  });

  return { achievements: updated, newlyUnlocked };
}
