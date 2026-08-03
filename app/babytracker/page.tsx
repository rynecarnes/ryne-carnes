import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { TimeSinceLastFeed } from '@/components/babytracker/TimeSinceLastFeed';
import { DailyCalendar } from '@/components/babytracker/DailyCalendar';
import { FeedingForm } from '@/components/babytracker/FeedingForm';
import { getLatestFeeding, getFeedingsForDate } from '@/lib/feedings';
import styles from './page.module.css';

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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
          <FeedingForm />
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