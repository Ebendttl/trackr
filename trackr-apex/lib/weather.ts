import { WeatherData } from '@/types/workout';

const WMO_MAP: Record<number, { emoji: string; description: string }> = {
  0: { emoji: '☀️', description: 'Clear sky' },
  1: { emoji: '🌤', description: 'Mainly clear' },
  2: { emoji: '⛅', description: 'Partly cloudy' },
  3: { emoji: '☁️', description: 'Overcast' },
  45: { emoji: '🌫️', description: 'Foggy' },
  48: { emoji: '🌫️', description: 'Icy fog' },
  51: { emoji: '🌦', description: 'Light drizzle' },
  53: { emoji: '🌧', description: 'Moderate drizzle' },
  55: { emoji: '🌧', description: 'Dense drizzle' },
  61: { emoji: '🌧', description: 'Light rain' },
  63: { emoji: '🌧', description: 'Moderate rain' },
  65: { emoji: '🌧', description: 'Heavy rain' },
  71: { emoji: '❄️', description: 'Light snow' },
  73: { emoji: '❄️', description: 'Moderate snow' },
  75: { emoji: '❄️', description: 'Heavy snow' },
  80: { emoji: '🌦', description: 'Light showers' },
  81: { emoji: '🌧', description: 'Moderate showers' },
  82: { emoji: '⛈', description: 'Violent showers' },
  95: { emoji: '⛈', description: 'Thunderstorm' },
  99: { emoji: '⛈', description: 'Thunderstorm w/hail' },
};

export function decodeWmoCode(code: number): { emoji: string; description: string } {
  return WMO_MAP[code] ?? { emoji: '🌡️', description: 'Unknown' };
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_OPEN_METEO_BASE ?? 'https://api.open-meteo.com/v1/forecast';
    const res = await fetch(
      `${baseUrl}?latitude=${lat}&longitude=${lng}&current_weather=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json() as { current_weather: { temperature: number; weathercode: number } };
    const { temperature, weathercode } = data.current_weather;
    const { emoji, description } = decodeWmoCode(weathercode);
    return { temp: Math.round(temperature), emoji, description, code: weathercode };
  } catch {
    return null;
  }
}

export function isRainCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
}
