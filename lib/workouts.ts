import { createClient } from '@/lib/supabase/server';
import type { WorkoutProfile, WorkoutCompletion, WorkoutPrescription, WorkoutType, WorkoutSet } from '@/models/workout';

// Brad Gillingham 12 Week Bench Press Program (as per LiftVault)
// Bench 2x/week: Heavy Day and Light Day. 
// For our app, we're doing Bench and Squat alternating with heavy/light pattern.
// Adapted from the bench program structure for both lifts.
const WORKOUT_PROGRAM: Record<number, Record<WorkoutType, { sets: number; reps: number; percentage: number }[]>> = {
  1: {
    light_bench: [{ sets: 2, reps: 8, percentage: 65 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 65 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 90 }, { sets: 3, reps: 5, percentage: 80 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 90 }, { sets: 3, reps: 5, percentage: 80 }],
  },
  2: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 92.5 }, { sets: 5, reps: 3, percentage: 82.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 92.5 }, { sets: 5, reps: 3, percentage: 82.5 }],
  },
  3: {
    light_bench: [{ sets: 2, reps: 8, percentage: 67.5 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 67.5 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 5, reps: 3, percentage: 85 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 5, reps: 3, percentage: 85 }],
  },
  4: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 87.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 87.5 }],
  },
  5: {
    light_bench: [{ sets: 2, reps: 8, percentage: 70 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 70 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 92.5 }, { sets: 3, reps: 5, percentage: 82.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 92.5 }, { sets: 3, reps: 5, percentage: 82.5 }],
  },
  6: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 5, reps: 3, percentage: 85 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 5, reps: 3, percentage: 85 }],
  },
  7: {
    light_bench: [{ sets: 2, reps: 8, percentage: 72.5 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 72.5 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 87.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 87.5 }],
  },
  8: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 100 }, { sets: 5, reps: 3, percentage: 90 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 100 }, { sets: 5, reps: 3, percentage: 90 }],
  },
  9: {
    light_bench: [{ sets: 2, reps: 8, percentage: 75 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 75 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 3, reps: 5, percentage: 82.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 95 }, { sets: 3, reps: 5, percentage: 82.5 }],
  },
  10: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 85 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 97.5 }, { sets: 5, reps: 3, percentage: 85 }],
  },
  11: {
    light_bench: [{ sets: 2, reps: 8, percentage: 77.5 }],
    light_squat: [{ sets: 2, reps: 8, percentage: 77.5 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 100 }, { sets: 5, reps: 3, percentage: 87.5 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 100 }, { sets: 5, reps: 3, percentage: 87.5 }],
  },
  12: {
    light_bench: [{ sets: 8, reps: 3, percentage: 60 }],
    light_squat: [{ sets: 8, reps: 3, percentage: 60 }],
    heavy_bench: [{ sets: 1, reps: 1, percentage: 102.5 }, { sets: 5, reps: 3, percentage: 90 }],
    heavy_squat: [{ sets: 1, reps: 1, percentage: 102.5 }, { sets: 5, reps: 3, percentage: 90 }],
  },
};

const WORKOUT_TYPE_ORDER: WorkoutType[] = ['light_bench', 'light_squat', 'heavy_bench', 'heavy_squat'];

export function getWorkoutTypeForDay(dayIndex: number): WorkoutType {
  return WORKOUT_TYPE_ORDER[dayIndex % 4];
}

export function getWeekNumberForDay(dayIndex: number): number {
  return Math.floor(dayIndex / 4) + 1;
}

export function getWorkoutTitle(workoutType: WorkoutType): string {
  switch (workoutType) {
    case 'light_bench':
      return 'Light Bench Day';
    case 'light_squat':
      return 'Light Squat Day';
    case 'heavy_bench':
      return 'Heavy Bench Day';
    case 'heavy_squat':
      return 'Heavy Squat Day';
  }
}

export function calculateWorkoutPrescription(
  dayIndex: number,
  bench1RM: number,
  squat1RM: number
): WorkoutPrescription {
  const weekNumber = getWeekNumberForDay(dayIndex);
  const workoutType = getWorkoutTypeForDay(dayIndex);
  const program = WORKOUT_PROGRAM[weekNumber] || WORKOUT_PROGRAM[12];
  const prescription = program[workoutType];

  const sets: WorkoutSet[] = [];
  const oneRM = workoutType.includes('bench') ? bench1RM : squat1RM;

  for (const p of prescription) {
    for (let i = 0; i < p.sets; i++) {
      const weight = Math.round((oneRM * p.percentage / 100) / 2.5) * 2.5;
      sets.push({
        reps: p.reps,
        percentage: p.percentage,
        weight,
      });
    }
  }

  return {
    weekNumber,
    dayIndex,
    workoutType,
    title: getWorkoutTitle(workoutType),
    sets,
  };
}

export async function getWorkoutProfile(): Promise<WorkoutProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('workout_profile')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0] as WorkoutProfile;
}

export async function createWorkoutProfile(
  bench1RM: number,
  squat1RM: number
): Promise<WorkoutProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('workout_profile')
    .insert({
      bench_1rm: bench1RM,
      squat_1rm: squat1RM,
      current_day_index: 0,
    })
    .select();

  if (error) {
    console.error('createWorkoutProfile error:', error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data[0] as WorkoutProfile;
}

export async function getCompletions(): Promise<WorkoutCompletion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('workout_completions')
    .select('*')
    .order('day_index', { ascending: true });

  if (error || !data) return [];
  return data as WorkoutCompletion[];
}

export async function completeWorkout(dayIndex: number): Promise<boolean> {
  const supabase = await createClient();
  
  const { error: completeError } = await supabase
    .from('workout_completions')
    .insert({ day_index: dayIndex });

  if (completeError) {
    console.error(completeError);
  }

  const profile = await getWorkoutProfile();
  if (profile && profile.current_day_index <= dayIndex) {
    const { error: updateError } = await supabase
      .from('workout_profile')
      .update({ 
        current_day_index: dayIndex + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error(updateError);
      return false;
    }
  }

  return true;
}

export async function isWorkoutCompleted(dayIndex: number): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('workout_completions')
    .select('id')
    .eq('day_index', dayIndex)
    .limit(1);

  return !error && !!data && data.length > 0;
}
