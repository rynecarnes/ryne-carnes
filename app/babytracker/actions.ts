'use server';

import { revalidatePath } from 'next/cache';
import { addFeeding, deleteFeeding } from '@/lib/feedings';

export async function addFeedingAction(formData: FormData) {
  const amountOz = parseFloat(formData.get('amount_oz') as string);
  const startedAt = formData.get('started_at') as string;
  const notes = (formData.get('notes') as string) || undefined;

  if (!amountOz || amountOz <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (!startedAt) {
    throw new Error('Start time is required');
  }

  // startedAt is sent as an ISO 8601 string from the client browser
  await addFeeding(amountOz, startedAt, notes);
  revalidatePath('/babytracker');
  revalidatePath('/');
}

export async function deleteFeedingAction(id: string) {
  if (!id) {
    throw new Error('Feeding ID is required');
  }

  await deleteFeeding(id);
  revalidatePath('/babytracker');
  revalidatePath('/');
}
