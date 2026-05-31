'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShieldAlert, ThermometerSun } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useMapStore } from '@/stores/mapStore';
import { useUIStore } from '@/stores/uiStore';
import { joggingSchema, bikingSchema, JoggingFormData, BikingFormData, Workout } from '@/types/workout';
import { calcPace, calcSpeed, generateDescription } from '@/lib/calculations';
import { fetchWeather } from '@/lib/weather';
import { nanoid } from 'nanoid';

/**
 * Slide-over workout creation form featuring rich state indications.
 */
export default function WorkoutForm() {
  const { addWorkout } = useWorkoutStore();
  const { pendingFormCoords, setPendingFormCoords, routePoints, clearRoute, calculatedRouteDistance } = useMapStore();
  const { setFormOpen, addNotification } = useUIStore();

  const [type, setType] = useState<'jogging' | 'biking'>('jogging');
  const [loading, setLoading] = useState(false);
  const [routeInfoVisible, setRouteInfoVisible] = useState(false);

  const isJogging = type === 'jogging';

  const {
    register: regJogging,
    handleSubmit: handleJogging,
    setValue: setValJogging,
    formState: { errors: errJogging },
    reset: resetJogging,
  } = useForm<JoggingFormData>({
    resolver: zodResolver(joggingSchema),
  });

  const {
    register: regBiking,
    handleSubmit: handleBiking,
    setValue: setValBiking,
    formState: { errors: errBiking },
    reset: resetBiking,
  } = useForm<BikingFormData>({
    resolver: zodResolver(bikingSchema),
  });

  // Automatically pre-fill distance if active route points exist
  useEffect(() => {
    if (calculatedRouteDistance > 0) {
      setValJogging('distance', parseFloat(calculatedRouteDistance.toFixed(2)));
      setValBiking('distance', parseFloat(calculatedRouteDistance.toFixed(2)));
      setRouteInfoVisible(true);
      setTimeout(() => setRouteInfoVisible(false), 4500);
    }
  }, [calculatedRouteDistance, setValJogging, setValBiking]);

  const onSubmit = async (data: JoggingFormData | BikingFormData) => {
    if (!pendingFormCoords) return;
    setLoading(true);

    try {
      const weather = await fetchWeather(pendingFormCoords.lat, pendingFormCoords.lng);
      const { distance, duration, notes } = data;
      const date = new Date().toISOString();
      const id = nanoid(10);
      const description = generateDescription(type, date);

      const workoutBase: Omit<Workout, 'pace' | 'speed' | 'cadence' | 'elevationGain'> = {
        id,
        type,
        date,
        coords: pendingFormCoords,
        route: [...routePoints],
        distance,
        duration,
        description,
        weather,
        notes: notes || undefined,
      };

      let newWorkout: Workout;

      if (type === 'jogging') {
        const cad = (data as JoggingFormData).cadence;
        newWorkout = {
          ...workoutBase,
          type: 'jogging',
          cadence: cad,
          pace: calcPace(duration, distance),
        } as Workout;
      } else {
        const elev = (data as BikingFormData).elevationGain;
        newWorkout = {
          ...workoutBase,
          type: 'biking',
          elevationGain: elev,
          speed: calcSpeed(distance, duration),
        } as Workout;
      }

      addWorkout(newWorkout);
      addNotification({
        type: 'success',
        title: 'Activity Registered',
        message: `${description} logged successfully!`,
      });

      // Cleanup
      clearRoute();
      setPendingFormCoords(null);
      setFormOpen(false);
      resetJogging();
      resetBiking();
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Submission Refused',
        message: 'Could not register telemetry stats.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPendingFormCoords(null);
    setFormOpen(false);
  };

  const errs = isJogging ? errJogging : errBiking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      style={{
        background: 'var(--surface-overlay)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-float)',
      }}
      className="p-5 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest font-mono">
          Establish Record
        </h3>
        <button onClick={handleClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* GPS Telemetry Banner */}
      <AnimatePresence>
        {routeInfoVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--accent-speed-dim)',
              border: '1px solid var(--border-speed)',
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg text-[9px] font-bold text-[var(--accent-speed)] font-mono uppercase tracking-wider"
          >
            <ThermometerSun size={12} className="animate-spin" />
            GPS Path Found · {calculatedRouteDistance.toFixed(2)} km applied
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type Toggle Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType('jogging')}
          style={{
            background: isJogging ? 'var(--accent-motion-dim)' : 'var(--surface-raised)',
            borderColor: isJogging ? 'var(--accent-motion)' : 'var(--border-subtle)',
            color: isJogging ? 'var(--text-primary)' : 'var(--text-tertiary)',
          }}
          className="py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          🏃 Jogging
        </button>
        <button
          type="button"
          onClick={() => setType('biking')}
          style={{
            background: !isJogging ? 'var(--accent-speed-dim)' : 'var(--surface-raised)',
            borderColor: !isJogging ? 'var(--accent-speed)' : 'var(--border-subtle)',
            color: !isJogging ? 'var(--text-primary)' : 'var(--text-tertiary)',
          }}
          className="py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          🚴 Biking
        </button>
      </div>

      {/* Main input form */}
      <form onSubmit={isJogging ? handleJogging(onSubmit) : handleBiking(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Distance */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
              Distance (km)
            </label>
            <input
              type="number"
              step="any"
              placeholder="5.2"
              disabled={loading}
              {...(isJogging ? regJogging('distance', { valueAsNumber: true }) : regBiking('distance', { valueAsNumber: true }))}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-motion)] disabled:opacity-50"
            />
            {errs.distance && <span className="text-[9px] text-[var(--accent-danger)]">{errs.distance.message}</span>}
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
              Duration (min)
            </label>
            <input
              type="number"
              placeholder="30"
              disabled={loading}
              {...(isJogging ? regJogging('duration', { valueAsNumber: true }) : regBiking('duration', { valueAsNumber: true }))}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-motion)] disabled:opacity-50"
            />
            {errs.duration && <span className="text-[9px] text-[var(--accent-danger)]">{errs.duration.message}</span>}
          </div>
        </div>

        {/* Dynamic crossfade row */}
        <AnimatePresence mode="wait">
          {isJogging ? (
            <motion.div
              key="jogging"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col gap-1"
            >
              <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                Cadence (spm)
              </label>
              <input
                type="number"
                placeholder="178"
                disabled={loading}
                {...regJogging('cadence', { valueAsNumber: true })}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-motion)] disabled:opacity-50"
              />
              {errJogging.cadence && <span className="text-[9px] text-[var(--accent-danger)]">{errJogging.cadence.message}</span>}
            </motion.div>
          ) : (
            <motion.div
              key="biking"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col gap-1"
            >
              <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                Elevation Gain (m)
              </label>
              <input
                type="number"
                placeholder="120"
                disabled={loading}
                {...regBiking('elevationGain', { valueAsNumber: true })}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)] disabled:opacity-50"
              />
              {errBiking.elevationGain && <span className="text-[9px] text-[var(--accent-danger)]">{errBiking.elevationGain.message}</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            Optional Notes
          </label>
          <input
            type="text"
            placeholder="Terrain surface, workout target, etc."
            disabled={loading}
            {...(isJogging ? regJogging('notes') : regBiking('notes'))}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-motion)] disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: type === 'jogging' ? 'var(--accent-motion)' : 'var(--accent-speed)',
            color: type === 'jogging' ? 'white' : 'black',
          }}
          className="w-full py-3 rounded-xl mt-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 select-none shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <ShieldAlert className="animate-spin" size={13} />
              Fetching Telemetry...
            </>
          ) : (
            <>
              <Play size={10} fill={type === 'jogging' ? 'white' : 'black'} />
              Establish Record →
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
