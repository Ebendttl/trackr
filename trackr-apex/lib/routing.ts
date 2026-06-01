import { Coords } from '@/types/workout';

export interface RouteResult {
  distance: number;    // meters
  duration: number;    // seconds
  geometry: [number, number][];  // [lat, lng] pairs
}

/**
 * Fetch a walking or cycling route between two coordinates using OSRM.
 * Free public API — no key required.
 * profile: 'foot' for jogging, 'bike' for cycling.
 */
export async function fetchRoute(
  start: Coords,
  end: Coords,
  profile: 'foot' | 'bike' = 'foot'
): Promise<RouteResult | null> {
  const url =
    `https://router.project-osrm.org/route/v1/${profile}/` +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    `?overview=full&geometries=geojson&steps=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) return null;
    const route = data.routes[0];

    return {
      distance: route.distance,
      duration: route.duration,
      // GeoJSON coords are [lng, lat] — flip to [lat, lng] for Leaflet
      geometry: route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      ),
    };
  } catch {
    return null;
  }
}
