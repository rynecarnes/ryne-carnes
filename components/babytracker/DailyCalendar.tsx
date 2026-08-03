'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { deleteFeedingAction } from '@/app/babytracker/actions';
import type { Feeding } from '@/models/feeding';
import styles from './DailyCalendar.module.css';

interface DailyCalendarProps {
  feedings: Feeding[];
  selectedDate: string; // ISO date string, e.g. "2026-08-03"
}

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getHour(isoString: string): number {
  return new Date(isoString).getHours();
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dateStr === todayStr;
}

function shiftDate(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Hours to display — 24-hour timeline
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function DailyCalendarInner({ feedings, selectedDate }: DailyCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigateDate(dateStr: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', dateStr);
    router.push(`/babytracker?${params.toString()}`);
  }

  // Group feedings by hour for the timeline
  const feedingsByHour = new Map<number, Feeding[]>();
  for (const feeding of feedings) {
    const hour = getHour(feeding.started_at);
    if (!feedingsByHour.has(hour)) feedingsByHour.set(hour, []);
    feedingsByHour.get(hour)!.push(feeding);
  }

  // Total oz for the day
  const totalOz = feedings.reduce((sum, f) => sum + Number(f.amount_oz), 0);

  async function handleDelete(id: string) {
    await deleteFeedingAction(id);
  }

  return (
    <div className={styles.calendar}>
      {/* Date navigation */}
      <div className={styles.dateNav}>
        <button
          className={styles.navButton}
          onClick={() => navigateDate(shiftDate(selectedDate, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.dateCenter}>
          <h3 className={styles.dateTitle}>
            {isToday(selectedDate) ? 'Today' : formatDateDisplay(selectedDate)}
          </h3>
          {!isToday(selectedDate) && (
            <button
              className={styles.todayButton}
              onClick={() => navigateDate(getTodayStr())}
            >
              Back to Today
            </button>
          )}
        </div>

        <button
          className={styles.navButton}
          onClick={() => navigateDate(shiftDate(selectedDate, 1))}
          aria-label="Next day"
          disabled={isToday(selectedDate)}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day summary */}
      <div className={styles.daySummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{feedings.length}</span>
          <span className={styles.summaryLabel}>{feedings.length === 1 ? 'Feeding' : 'Feedings'}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{totalOz.toFixed(1)}</span>
          <span className={styles.summaryLabel}>Total oz</span>
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {HOURS.map((hour) => {
          const hourFeedings = feedingsByHour.get(hour) || [];
          const hasFeedings = hourFeedings.length > 0;

          return (
            <div key={hour} className={`${styles.hourRow} ${hasFeedings ? styles.hourActive : ''}`}>
              <div className={styles.hourLabel}>
                {formatHourLabel(hour)}
              </div>
              <div className={styles.hourLine}>
                <div className={styles.dot} />
              </div>
              <div className={styles.hourContent}>
                {hourFeedings.map((feeding) => (
                  <div key={feeding.id} className={styles.feedingMarker}>
                    <div className={styles.feedingInfo}>
                      <Clock size={14} className={styles.feedingIcon} />
                      <span className={styles.feedingTime}>
                        {formatTime(feeding.started_at)}
                      </span>
                      <span className={styles.feedingAmount}>
                        {Number(feeding.amount_oz)} oz
                      </span>
                    </div>
                    {feeding.notes && (
                      <div className={styles.feedingNotes}>{feeding.notes}</div>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(feeding.id)}
                      aria-label="Delete feeding"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it for prerendering
export function DailyCalendar(props: DailyCalendarProps) {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading calendar…</div>}>
      <DailyCalendarInner {...props} />
    </Suspense>
  );
}
