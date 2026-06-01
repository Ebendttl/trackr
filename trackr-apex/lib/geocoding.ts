export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Search locations using OpenStreetMap Nominatim.
 * No API key required — free public geocoder.
 * Requires User-Agent header per Nominatim usage policy.
 */
export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: {
        'User-Agent': 'TrackR-APEX-WorkoutTracker/1.0 (https://trackr-dun.vercel.app)',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
