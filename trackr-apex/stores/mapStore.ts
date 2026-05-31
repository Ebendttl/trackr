import { create } from 'zustand';
import { Coords } from '@/types/workout';

interface MapStore {
  drawingMode: boolean;
  toggleDrawingMode: () => void;
  routePoints: Coords[];
  addRoutePoint: (coord: Coords) => void;
  clearRoute: () => void;
  pendingFormCoords: Coords | null;
  setPendingFormCoords: (coords: Coords | null) => void;
  calculatedRouteDistance: number;
  setCalculatedRouteDistance: (d: number) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  drawingMode: false,
  toggleDrawingMode: () => set((s) => ({ drawingMode: !s.drawingMode })),

  routePoints: [],
  addRoutePoint: (coord) => set((s) => ({ routePoints: [...s.routePoints, coord] })),
  clearRoute: () => set({ routePoints: [], calculatedRouteDistance: 0 }),

  pendingFormCoords: null,
  setPendingFormCoords: (coords) => set({ pendingFormCoords: coords }),

  calculatedRouteDistance: 0,
  setCalculatedRouteDistance: (d) => set({ calculatedRouteDistance: d }),
}));
