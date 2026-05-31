import { z } from 'zod';

export type WorkoutType = 'jogging' | 'biking';

export interface Coords {
  lat: number;
  lng: number;
}

export interface WeatherData {
  temp: number;
  emoji: string;
  description: string;
  code: number;
}

export interface BaseWorkout {
  id: string;
  type: WorkoutType;
  date: string; // ISO string
  coords: Coords;
  route: Coords[];
  distance: number; // km
  duration: number; // min
  description: string;
  weather: WeatherData | null;
  notes?: string;
}

export interface JoggingWorkout extends BaseWorkout {
  type: 'jogging';
  cadence: number; // step/min
  pace: number; // min/km
}

export interface BikingWorkout extends BaseWorkout {
  type: 'biking';
  elevationGain: number; // meters
  speed: number; // km/h
}

export type Workout = JoggingWorkout | BikingWorkout;

// Zod schemas for form validation
export const joggingSchema = z.object({
  distance: z.number({ message: 'Must be a number' }).positive('Must be positive').max(500),
  duration: z.number({ message: 'Must be a number' }).positive('Must be positive').max(1440),
  cadence: z.number({ message: 'Must be a number' }).positive('Must be positive').min(60).max(300),
  notes: z.string().optional(),
});

export const bikingSchema = z.object({
  distance: z.number({ message: 'Must be a number' }).positive('Must be positive').max(1000),
  duration: z.number({ message: 'Must be a number' }).positive('Must be positive').max(1440),
  elevationGain: z.number({ message: 'Must be a number' }).min(0).max(10000),
  notes: z.string().optional(),
});

export type JoggingFormData = z.infer<typeof joggingSchema>;
export type BikingFormData = z.infer<typeof bikingSchema>;
