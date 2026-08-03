import { createClient } from '@/lib/supabase/server';
import type { Feeding } from '@/models/feeding';

/**
 * Returns the most recent feeding, or null if none exist.
 */
export async function getLatestFeeding(): Promise<Feeding | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedings')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Feeding;
}

/**
 * Returns all feedings for a given calendar day, ordered by start time.
 * @param dateStr - ISO date string, e.g. "2026-08-03"
 */
export async function getFeedingsForDate(dateStr: string): Promise<Feeding[]> {
  const supabase = await createClient();

  // Build day boundaries for the given local date (dateStr: YYYY-MM-DD)
  const [year, month, day] = dateStr.split('-').map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();

  const { data, error } = await supabase
    .from('feedings')
    .select('*')
    .gte('started_at', dayStart)
    .lte('started_at', dayEnd)
    .order('started_at', { ascending: true });

  if (error || !data) return [];
  return data as Feeding[];
}

/**
 * Inserts a new feeding record.
 */
export async function addFeeding(
  amountOz: number,
  startedAt: string,
  notes?: string
): Promise<Feeding | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedings')
    .insert({
      amount_oz: amountOz,
      started_at: startedAt,
      notes: notes || null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as Feeding;
}

/**
 * Deletes a feeding by ID.
 */
export async function deleteFeeding(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('feedings')
    .delete()
    .eq('id', id);

  return !error;
}
