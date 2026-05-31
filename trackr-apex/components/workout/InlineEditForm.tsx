'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Workout, joggingSchema, bikingSchema, JoggingFormData, BikingFormData } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useUIStore } from '@/stores/uiStore';
import { calcPace, calcSpeed } from '@/lib/calculations';

/**
 * Embedded in-card metric editor to scale workout variables live.
 */
export default function InlineEditForm({
  workout,
  onClose,
}: {
  workout: Workout;
  onClose: () => void;
}) {
  const updateWorkout = useWorkoutStore((s) => s.updateWorkout);
  const addNotification = useUIStore((s) => s.addNotification);

  const isJogging = workout.type === 'jogging';

  const {
    register: regJogging,
    handleSubmit: handleJogging,
    formState: { errors: errJogging },
  } = useForm<JoggingFormData>({
    resolver: zodResolver(joggingSchema),
    defaultValues: {
      distance: workout.distance,
      duration: workout.duration,
      cadence: isJogging ? (workout as any).cadence : 170,
      notes: workout.notes ?? '',
    },
  });

  const {
    register: regBiking,
    handleSubmit: handleBiking,
    formState: { errors: errBiking },
  } = useForm<BikingFormData>({
    resolver: zodResolver(bikingSchema),
    defaultValues: {
      distance: workout.distance,
      duration: workout.duration,
      elevationGain: !isJogging ? (workout as any).elevationGain : 100,
      notes: workout.notes ?? '',
    },
  });

  const onSubmit = (data: JoggingFormData | BikingFormData) => {
    const { distance, duration, notes } = data;
    const updates: Partial<Workout> = {
      distance,
      duration,
      notes,
    };

    if (workout.type === 'jogging') {
      const cad = (data as JoggingFormData).cadence;
      (updates as any).cadence = cad;
      (updates as any).pace = calcPace(duration, distance);
    } else {
      const elev = (data as BikingFormData).elevationGain;
      (updates as any).elevationGain = elev;
      (updates as any).speed = calcSpeed(distance, duration);
    }

    updateWorkout(workout.id, updates);
    addNotification({ type: 'success', title: 'Metrics Re-calibrated', message: workout.description });
    onClose();
  };

  const errs = isJogging ? errJogging : errBiking;

  return (
    <form
      onSubmit={isJogging ? handleJogging(onSubmit) : handleBiking(onSubmit)}
      className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[var(--accent-speed)] uppercase tracking-wider font-mono">
          Re-calibrate Metrics
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Distance */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            Dist (km)
          </label>
          <input
            type="number"
            step="any"
            {...(isJogging ? regJogging('distance', { valueAsNumber: true }) : regBiking('distance', { valueAsNumber: true }))}
            className="w-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg p-1.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)]"
          />
          {isJogging ? (
            errJogging.distance && <span className="text-[9px] text-[var(--accent-danger)]">{errJogging.distance.message}</span>
          ) : (
            errBiking.distance && <span className="text-[9px] text-[var(--accent-danger)]">{errBiking.distance.message}</span>
          )}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            Dur (min)
          </label>
          <input
            type="number"
            {...(isJogging ? regJogging('duration', { valueAsNumber: true }) : regBiking('duration', { valueAsNumber: true }))}
            className="w-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg p-1.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)]"
          />
          {isJogging ? (
            errJogging.duration && <span className="text-[9px] text-[var(--accent-danger)]">{errJogging.duration.message}</span>
          ) : (
            errBiking.duration && <span className="text-[9px] text-[var(--accent-danger)]">{errBiking.duration.message}</span>
          )}
        </div>

        {/* Cadence or Elevation */}
        {isJogging ? (
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
              Cad (spm)
            </label>
            <input
              type="number"
              {...regJogging('cadence', { valueAsNumber: true })}
              className="w-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg p-1.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)]"
            />
            {errJogging.cadence && <span className="text-[9px] text-[var(--accent-danger)]">{errJogging.cadence.message}</span>}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
              Elev (m)
            </label>
            <input
              type="number"
              {...regBiking('elevationGain', { valueAsNumber: true })}
              className="w-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg p-1.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)]"
            />
            {errBiking.elevationGain && <span className="text-[9px] text-[var(--accent-danger)]">{errBiking.elevationGain.message}</span>}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
          Activity Notes
        </label>
        <input
          type="text"
          placeholder="Route surface, details, etc."
          {...(isJogging ? regJogging('notes') : regBiking('notes'))}
          className="w-full bg-[var(--surface-overlay)] border border-[var(--border-subtle)] rounded-lg p-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-speed)]"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] uppercase tracking-widest rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-[10px] font-bold bg-[var(--accent-speed-dim)] border border-[var(--accent-speed)] text-[var(--accent-speed)] hover:bg-[var(--accent-speed)] hover:text-black uppercase tracking-widest rounded transition-colors"
        >
          Calibrate
        </button>
      </div>
    </form>
  );
}
