'use client';
import { useState, useEffect, useCallback } from 'react';
import { Coords } from '@/types/workout';

interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({ coords: null, error: null, loading: true });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ coords: null, error: 'Geolocation not supported', loading: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }, error: null, loading: false }),
      () => setState({ coords: null, error: 'Location permission denied', loading: false })
    );
  }, []);

  return state;
}
