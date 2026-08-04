'use client';

import { useState, useEffect } from 'react';
import { addFeedingAction } from '@/app/babytracker/actions';
import styles from '@/app/babytracker/page.module.css';

function getDefaultDatetime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function FeedingForm() {
  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    setDatetime(getDefaultDatetime());
  }, []);

  return (
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
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="hidden"
            name="started_at"
            value={datetime ? new Date(datetime).toISOString() : ''}
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
  );
}
