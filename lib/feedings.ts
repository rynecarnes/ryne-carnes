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

  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Create a broad UTC window covering the selected date in any timezone (-12 to +14 offset)
  // Day start: target date minus 1 day at 00:00:00 UTC
  // Day end: target date plus 2 days at 00:00:00 UTC
  const rangeStart = new Date(Date.UTC(year, month - 1, day - 1, 0, 0, 0, 0)).toISOString();
  const rangeEnd = new Date(Date.UTC(year, month - 1, day + 2, 0, 0, 0, 0)).toISOString();

  // Fetch candidate feedings around this window
  const { data, error } = await supabase
    .from('feedings')
    .select('*')
    .gte('started_at', rangeStart)
    .lte('started_at', rangeEnd)
    .order('started_at', { ascending: true });

  if (error || !data) return [];

  // Filter in memory for timestamps whose local date string matches dateStr
  return (data as Feeding[]).filter((feeding) => {
    const feedingDate = new Date(feeding.started_at);
    const fYear = feedingDate.getFullYear();
    const fMonth = String(feedingDate.getMonth() + 1).padStart(2, '0');
    const fDay = String(feedingDate.getDate()).padStart(2, '0');
    const localDateStr = `${fYear}-${fMonth}-${fDay}`;
    return localDateStr === dateStr;
  });
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
