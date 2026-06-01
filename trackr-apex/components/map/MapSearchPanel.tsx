'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, MapPin, Navigation, X } from 'lucide-react';
import L from 'leaflet';
import { useMapStore } from '@/stores/mapStore';
import { useUIStore } from '@/stores/uiStore';
import { useDebounce } from '@/hooks/useDebounce';
import { searchLocations, NominatimResult } from '@/lib/geocoding';
import { fetchRoute } from '@/lib/routing';
import { Coords } from '@/types/workout';

interface SearchInputProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onClear: () => void;
}

function SearchInput({ icon, placeholder, value, onChange, onFocus, onClear }: SearchInputProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
      <div style={{ flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-geist-sans)',
          fontSize: 14,
          color: 'var(--text-primary)',
          caretColor: 'var(--accent-motion)',
          minWidth: 0,
        }}
      />
      {value && (
        <button
          onClick={onClear}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}
        >
          <X size={14} color="var(--text-tertiary)" />
        </button>
      )}
    </div>
  );
}

interface AutocompleteDropdownProps {
  suggestions: NominatimResult[];
  onSelect: (r: NominatimResult) => void;
}

function AutocompleteDropdown({ suggestions, onSelect }: AutocompleteDropdownProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0, right: 0,
        background: 'rgba(8,13,23,0.97)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
        zIndex: 1001,
        maxHeight: 260,
        overflowY: 'auto',
      }}
    >
      {suggestions.map((result, index) => {
        const primary =
          result.address.road ||
          result.address.suburb ||
          result.address.village ||
          result.display_name.split(',')[0];
        const secondary = [
          result.address.suburb,
          result.address.city || result.address.town,
          result.address.country,
        ]
          .filter(Boolean)
          .join(', ');

        return (
          <button
            key={result.place_id}
            onClick={() => onSelect(result)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '10px 14px',
              background: 'none', border: 'none',
              borderBottom:
                index < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-motion-dim)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <MapPin size={14} color="var(--text-tertiary)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: 13, fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3, marginBottom: 2,
                }}
              >
                {primary}
              </div>
              {secondary && (
                <div
                  style={{
                    fontFamily: 'var(--font-geist-sans)',
                    fontSize: 11, color: 'var(--text-tertiary)',
                    lineHeight: 1.2,
                  }}
                >
                  {secondary}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── Custom Leaflet marker icons ───────────────────────────────────────────────

const startIcon = typeof window !== 'undefined'
  ? L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#10b981,#06b6d4);border:2px solid white;box-shadow:0 0 12px rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center;font-size:18px">🏃</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })
  : null;

const endIcon = typeof window !== 'undefined'
  ? L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:2px solid white;box-shadow:0 0 12px rgba(245,158,11,0.5);display:flex;align-items:center;justify-content:center;font-size:18px">🏁</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })
  : null;

// ─── Main component ────────────────────────────────────────────────────────────

interface MapSearchPanelProps {
  map: L.Map;
}

export default function MapSearchPanel({ map }: MapSearchPanelProps) {
  const { setCalculatedRouteDistance, setPendingFormCoords, clearRoute, routePoints } = useMapStore();
  const { setFormOpen } = useUIStore();

  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<NominatimResult[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<NominatimResult[]>([]);
  const [startCoords, setStartCoords] = useState<Coords | null>(null);
  const [endCoords, setEndCoords] = useState<Coords | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const [loading, setLoading] = useState(false);

  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const debouncedStart = useDebounce(startQuery, 400);
  const debouncedEnd = useDebounce(endQuery, 400);

  // ── Autocomplete fetch ────────────────────────────────────────────────────
  useEffect(() => {
    if (!debouncedStart || debouncedStart.length < 3) { setStartSuggestions([]); return; }
    searchLocations(debouncedStart).then(setStartSuggestions);
  }, [debouncedStart]);

  useEffect(() => {
    if (!debouncedEnd || debouncedEnd.length < 3) { setEndSuggestions([]); return; }
    searchLocations(debouncedEnd).then(setEndSuggestions);
  }, [debouncedEnd]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const placeMarker = useCallback(
    (coords: Coords, type: 'start' | 'end') => {
      if (!startIcon || !endIcon) return;
      const ref = type === 'start' ? startMarkerRef : endMarkerRef;
      const icon = type === 'start' ? startIcon : endIcon;
      if (ref.current) ref.current.remove();
      ref.current = L.marker([coords.lat, coords.lng], { icon }).addTo(map);
    },
    [map]
  );

  const drawRoutePolyline = useCallback(
    (geometry: [number, number][]) => {
      if (routeLayerRef.current) routeLayerRef.current.remove();
      routeLayerRef.current = L.polyline(geometry, {
        color: '#7c6af7',
        weight: 4,
        opacity: 0.85,
        dashArray: '8 4',
      }).addTo(map);
    },
    [map]
  );

  const fetchAndDraw = useCallback(
    async (from: Coords, to: Coords) => {
      setLoading(true);
      const result = await fetchRoute(from, to, 'foot');
      setLoading(false);
      if (!result) return;

      const km = result.distance / 1000;
      setRouteDistance(km);
      setCalculatedRouteDistance(km);
      drawRoutePolyline(result.geometry);

      const bounds = L.latLngBounds(result.geometry);
      map.fitBounds(bounds, { padding: [60, 60] });
    },
    [map, setCalculatedRouteDistance, drawRoutePolyline]
  );

  const handleSuggestionSelect = useCallback(
    (result: NominatimResult, type: 'start' | 'end') => {
      const coords: Coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
      const display =
        result.address.road ||
        result.address.suburb ||
        result.display_name.split(',')[0];

      if (type === 'start') {
        setStartQuery(display);
        setStartCoords(coords);
        setStartSuggestions([]);
        placeMarker(coords, 'start');
        if (endCoords) fetchAndDraw(coords, endCoords);
      } else {
        setEndQuery(display);
        setEndCoords(coords);
        setEndSuggestions([]);
        placeMarker(coords, 'end');
        if (startCoords) fetchAndDraw(startCoords, coords);
      }

      map.panTo([coords.lat, coords.lng]);
      setActiveInput(null);
    },
    [endCoords, startCoords, map, placeMarker, fetchAndDraw]
  );

  const swapLocations = useCallback(() => {
    const tmpQ = startQuery; setStartQuery(endQuery); setEndQuery(tmpQ);
    const tmpC = startCoords; setStartCoords(endCoords); setEndCoords(tmpC);
    if (startCoords) placeMarker(startCoords, 'end');
    if (endCoords) placeMarker(endCoords, 'start');
    if (startCoords && endCoords) fetchAndDraw(endCoords, startCoords);
  }, [startQuery, endQuery, startCoords, endCoords, placeMarker, fetchAndDraw]);

  const clearAll = useCallback(() => {
    setStartQuery(''); setEndQuery('');
    setStartCoords(null); setEndCoords(null);
    setRouteDistance(null);
    setStartSuggestions([]); setEndSuggestions([]);
    if (startMarkerRef.current) { startMarkerRef.current.remove(); startMarkerRef.current = null; }
    if (endMarkerRef.current) { endMarkerRef.current.remove(); endMarkerRef.current = null; }
    if (routeLayerRef.current) { routeLayerRef.current.remove(); routeLayerRef.current = null; }
    clearRoute();
    setCalculatedRouteDistance(0);
  }, [clearRoute, setCalculatedRouteDistance]);

  const logThisRoute = useCallback(() => {
    if (!startCoords) return;
    setPendingFormCoords(startCoords);
    setFormOpen(true);
  }, [startCoords, setPendingFormCoords, setFormOpen]);

  const showEmpty = !startQuery && !endQuery && !routeDistance;

  return (
    <div
      className="absolute z-[1000]"
      style={{ top: 16, left: 16, width: 320, maxWidth: 'calc(100vw - 32px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          background: 'rgba(8, 13, 23, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-default)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Start input */}
        <SearchInput
          icon={
            <div
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: startCoords ? '#10b981' : 'var(--accent-motion)',
              }}
            />
          }
          placeholder="Starting point…"
          value={startQuery}
          onChange={setStartQuery}
          onFocus={() => setActiveInput('start')}
          onClear={() => {
            setStartQuery(''); setStartCoords(null); setStartSuggestions([]);
            if (startMarkerRef.current) { startMarkerRef.current.remove(); startMarkerRef.current = null; }
            setRouteDistance(null);
          }}
        />

        {/* Divider + swap */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <button
            onClick={swapLocations}
            title="Swap start and end"
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', margin: '0 8px',
            }}
          >
            <ArrowUpDown size={13} />
          </button>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* End input */}
        <SearchInput
          icon={<MapPin size={12} color={endCoords ? '#f59e0b' : 'var(--accent-speed)'} />}
          placeholder="Where are you going?"
          value={endQuery}
          onChange={setEndQuery}
          onFocus={() => setActiveInput('end')}
          onClear={() => {
            setEndQuery(''); setEndCoords(null); setEndSuggestions([]);
            if (endMarkerRef.current) { endMarkerRef.current.remove(); endMarkerRef.current = null; }
            setRouteDistance(null);
          }}
        />

        {/* Route summary strip */}
        <AnimatePresence>
          {routeDistance !== null && startCoords && endCoords && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                borderTop: '1px solid var(--border-subtle)',
                padding: '10px 14px 12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Navigation size={14} color="var(--accent-speed)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: 15, fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {routeDistance.toFixed(2)} km
                  </span>
                  <span
                    style={{
                      fontSize: 11, color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-geist-sans)',
                    }}
                  >
                    route
                  </span>
                </div>
                <button
                  onClick={logThisRoute}
                  style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: 'var(--accent-motion)', border: 'none',
                    color: '#fff', fontFamily: 'var(--font-geist-sans)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  LOG →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                borderTop: '1px solid var(--border-subtle)',
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <div
                style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid var(--accent-motion)',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              <span
                style={{
                  fontSize: 11, color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-geist-mono)',
                  letterSpacing: '0.05em',
                }}
              >
                ROUTING…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state hint */}
        <AnimatePresence>
          {showEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                borderTop: '1px solid var(--border-subtle)',
                padding: '8px 14px 12px',
              }}
            >
              <p
                style={{
                  fontSize: 11, color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-geist-sans)',
                  lineHeight: 1.5, margin: 0,
                }}
              >
                🗺️ Type a start &amp; end point, or tap anywhere on the map to log a spot workout
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Autocomplete dropdown — rendered outside the panel card to avoid overflow clip */}
      <AnimatePresence>
        <AutocompleteDropdown
          suggestions={activeInput === 'start' ? startSuggestions : endSuggestions}
          onSelect={(r) => handleSuggestionSelect(r, activeInput!)}
        />
      </AnimatePresence>
    </div>
  );
}
