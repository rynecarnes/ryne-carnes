export interface WorkoutProfile {
  id: string;
  bench_1rm: number;
  squat_1rm: number;
  current_day_index: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutCompletion {
  id: string;
  day_index: number;
  completed_at: string;
}

export type WorkoutType = 'light_bench' | 'light_squat' | 'heavy_bench' | 'heavy_squat';

export interface WorkoutSet {
  reps: number;
  percentage: number;
  weight: number;
}

export interface WorkoutPrescription {
  weekNumber: number;
  dayIndex: number;
  workoutType: WorkoutType;
  title: string;
  sets: WorkoutSet[];
}
