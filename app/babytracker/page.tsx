import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { TimeSinceLastFeed } from '@/components/babytracker/TimeSinceLastFeed';
import { DailyCalendar } from '@/components/babytracker/DailyCalendar';
import { getLatestFeeding, getFeedingsForDate } from '@/lib/feedings';
import { addFeedingAction } from './actions';
import styles from './page.module.css';

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDefaultDatetime(): string {
  const now = new Date();
  // Offset to local time for the datetime-local input
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default async function BabyTracker({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedDate = (typeof params.date === 'string' ? params.date : null) || getTodayStr();

  const [latestFeeding, feedings] = await Promise.all([
    getLatestFeeding(),
    getFeedingsForDate(selectedDate),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Baby Tracker</h1>
      <p className={styles.pageDescription}>Track bottle feedings and view daily schedules.</p>

      {/* Time Since Last Feed */}
      <Card>
        <TimeSinceLastFeed lastFeedingAt={latestFeeding?.started_at ?? null} />
      </Card>

      {/* Log a Feeding */}
      <Card>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Log a Feeding</h2>
          </div>
          <form action={addFeedingAction} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="amount_oz" className={styles.formLabel}>
                  Amount (oz)
                </label>
                <input
                  id="amount_oz"
                  name="amount_oz"
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="20"
                  placeholder="4.0"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="started_at" className={styles.formLabel}>
                  Time
                </label>
                <input
                  id="started_at"
                  name="started_at"
                  type="datetime-local"
                  defaultValue={getDefaultDatetime()}
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.formLabel}>
                Notes <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="e.g. baby was fussy, supplemented with formula..."
                className={styles.textarea}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Log Feeding
            </button>
          </form>
        </div>
      </Card>

      {/* Daily Calendar */}
      <Card>
        <Suspense fallback={<div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading calendar…</div>}>
          <DailyCalendar feedings={feedings} selectedDate={selectedDate} />
        </Suspense>
      </Card>
    </div>
  );
}