export interface OnboardingStep {
  id: string;
  title: string;
  iconEmoji: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  body: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TrackR APEX',
    iconEmoji: '⚡',
    target: 'center',
    position: 'center',
    body: "Your personal mission control for every run and ride. Built for athletes who take their training seriously. Let's show you around — it only takes 60 seconds."
  },
  {
    id: 'stats',
    title: 'Your Command Center',
    iconEmoji: '📊',
    target: '.mission-stats',
    position: 'bottom',
    body: 'Your total workouts, distance, and duration update in real-time every time you log a session. Watch these numbers grow.'
  },
  {
    id: 'intelligence',
    title: 'Performance Intelligence',
    iconEmoji: '📈',
    target: '.intelligence-panel',
    position: 'bottom',
    body: 'Tap any tab to visualize your distance trends, activity split, or pace evolution over time.'
  },
  {
    id: 'filters',
    title: 'Find Any Workout Instantly',
    iconEmoji: '🔍',
    target: '.control-deck',
    position: 'bottom',
    body: 'Search by name, filter by type, or sort by distance and duration. Updates your list in real-time.'
  },
  {
    id: 'gps',
    title: 'GPS Logging Modes',
    iconEmoji: '🛰️',
    target: '.gps-ops-panel',
    position: 'bottom',
    body: 'Two ways to log: tap anywhere on the map for a single-location workout, or activate Route Trace to draw your exact path.'
  },
  {
    id: 'map',
    title: 'Your Training Ground',
    iconEmoji: '🗺️',
    target: '#map',
    position: 'center',
    body: 'This is where it all happens. Tap anywhere to pin a workout location. Logged routes appear as glowing trail lines.'
  },
  {
    id: 'achievements',
    title: 'Unlock Achievements',
    iconEmoji: '🏅',
    target: '.achievements-panel',
    position: 'bottom',
    body: 'Hit milestones to unlock badges — from the Century Club (100km total) to the Cold Warrior (training below 12°C).'
  },
  {
    id: 'finish',
    title: "You're Ready. Let's Go.",
    iconEmoji: '🚀',
    target: 'center',
    position: 'center',
    body: 'Tap anywhere on the map (or hit the + button on mobile) to log your first workout. Your first entry is waiting.'
  },
];
