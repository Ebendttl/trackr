import { Coords } from '@/types/workout';

/** Calculate pace in min/km */
export function calcPace(duration: number, distance: number): number {
  if (distance === 0) return 0;
  return duration / distance;
}

/** Calculate speed in km/h */
export function calcSpeed(distance: number, duration: number): number {
  if (duration === 0) return 0;
  return distance / (duration / 60);
}

/** Calculate geodetic distance between two coordinates using Haversine formula */
export function haversineDistance(a: Coords, b: Coords): number {
  const R = 6371; // Earth radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const chord =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

/** Calculate total route distance in km from an array of coords */
export function calcRouteDistance(points: Coords[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(points[i], points[i + 1]);
  }
  return total;
}

/** Format pace as mm:ss string */
export function formatPace(pace: number): string {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

/** Generate workout description */
export function generateDescription(type: string, date: string): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const d = new Date(date);
  const typeLabel = type === 'jogging' ? 'Jogging' : 'Biking';
  return `${typeLabel} on ${months[d.getMonth()]} ${d.getDate()}`;
}
