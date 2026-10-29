'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createWorkoutProfile, completeWorkout } from '@/lib/workouts';

export async function setupWorkoutProfile(formData: FormData) {
  const bench1RM = parseFloat(formData.get('bench_1rm') as string);
  const squat1RM = parseFloat(formData.get('squat_1rm') as string);

  if (isNaN(bench1RM) || isNaN(squat1RM) || bench1RM <= 0 || squat1RM <= 0) {
    throw new Error('Invalid 1RM values');
  }

  try {
    const result = await createWorkoutProfile(bench1RM, squat1RM);
    if (!result) {
      throw new Error('Failed to create profile');
    }
    
    revalidatePath('/workouts');
    revalidatePath('/');
    redirect('/workouts');
  } catch (e) {
    console.error('Setup error:', e);
    throw e;
  }
}

export async function markWorkoutComplete(dayIndex: number) {
  await completeWorkout(dayIndex);
  revalidatePath('/workouts');
  revalidatePath('/');
}
