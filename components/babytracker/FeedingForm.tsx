'use client';

import { useState, useEffect } from 'react';
import { addFeedingAction } from '@/app/babytracker/actions';
import styles from '@/app/babytracker/page.module.css';

function getDefaultDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Generate amount options from 3.00 to 10.00 in 0.25 increments
const AMOUNT_OPTIONS: number[] = [];
for (let oz = 3; oz <= 10; oz += 0.25) {
  AMOUNT_OPTIONS.push(parseFloat(oz.toFixed(2)));
}

export function FeedingForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    setDate(getDefaultDate());
    setTime(getDefaultTime());
  }, []);

  // Combine date + time into ISO string for submission
  const combinedISO = date && time
    ? new Date(`${date}T${time}`).toISOString()
    : '';

  return (
    <form action={addFeedingAction} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="amount_oz" className={styles.formLabel}>
            Amount (oz)
          </label>
          <select
            id="amount_oz"
            name="amount_oz"
            required
            defaultValue=""
            className={styles.select}
          >
            <option value="" disabled>
              Select oz
            </option>
            {AMOUNT_OPTIONS.map((oz) => (
              <option key={oz} value={oz}>
                {oz.toFixed(2)} oz
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="feed_time" className={styles.formLabel}>
            Time
          </label>
          <input
            id="feed_time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="feed_date" className={styles.formLabel}>
          Date
        </label>
        <input
          id="feed_date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <input
        type="hidden"
        name="started_at"
        value={combinedISO}
      />
      <div className={styles.formGroup}>
        <label htmlFor="notes" className={styles.formLabel}>
          Notes <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={1}
          placeholder="e.g. supplemented with formula"
          className={styles.textarea}
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Log Feeding
      </button>
    </form>
  );
}
