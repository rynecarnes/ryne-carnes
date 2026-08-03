'use client';

import { useState, useEffect } from 'react';
import styles from './TimeSinceLastFeed.module.css';

interface TimeSinceLastFeedProps {
  lastFeedingAt: string | null; // ISO 8601 timestamp or null
  compact?: boolean;            // Smaller variant for dashboard card
}

function formatElapsed(ms: number): { text: string; level: 'green' | 'yellow' | 'red' } {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let text: string;
  if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else {
    const seconds = Math.floor((ms % 60000) / 1000);
    text = `${minutes}m ${seconds}s`;
  }

  // Color thresholds: green < 2h, yellow 2-3h, red > 3h
  let level: 'green' | 'yellow' | 'red' = 'green';
  if (totalMinutes >= 180) level = 'red';
  else if (totalMinutes >= 120) level = 'yellow';

  return { text, level };
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function TimeSinceLastFeed({ lastFeedingAt, compact = false }: TimeSinceLastFeedProps) {
  const [elapsed, setElapsed] = useState<{ text: string; level: 'green' | 'yellow' | 'red' } | null>(null);

  useEffect(() => {
    if (!lastFeedingAt) return;

    function tick() {
      const diff = Date.now() - new Date(lastFeedingAt!).getTime();
      setElapsed(formatElapsed(diff));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastFeedingAt]);

  if (!lastFeedingAt || !elapsed) {
    return (
      <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
        <div className={styles.timerText} style={{ color: 'var(--color-text-muted)' }}>
          --
        </div>
        <div className={styles.label}>No Feedings Recorded Yet</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <div className={styles.label}>Time Since Last Feed</div>
      <div className={`${styles.timerText} ${styles[elapsed.level]}`}>
        {elapsed.text}
      </div>
      <div className={styles.lastFeedTime}>
        Last fed at {formatTime(lastFeedingAt)}
      </div>
    </div>
  );
}
