'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { markWorkoutComplete } from '@/app/workouts/actions';
import type { WorkoutPrescription } from '@/models/workout';

interface WorkoutDisplayProps {
  prescription: WorkoutPrescription;
  dayIndex: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

export function WorkoutDisplay({ 
  prescription, 
  dayIndex, 
  isCompleted, 
  isCurrent,
  isLocked 
}: WorkoutDisplayProps) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      await markWorkoutComplete(dayIndex);
    } catch (error) {
      console.error(error);
      alert('Failed to mark complete. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (isLocked) {
    return (
      <Card>
        <div style={{ padding: 'var(--space-6)', opacity: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '24px' }}>🔒</span>
            <h2 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: 600 
            }}>
              Day {dayIndex + 1} - Locked
            </h2>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Complete the previous workout to unlock
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ padding: 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {isCompleted && <span style={{ fontSize: '24px' }}>✅</span>}
              {isCurrent && !isCompleted && <span style={{ fontSize: '24px' }}>⚡</span>}
              <h2 style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 600 
              }}>
                {prescription.title}
              </h2>
            </div>
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-accent-blue)'
            }}>
              Week {prescription.weekNumber} • Day {dayIndex + 1}
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Brad Gillingham 12 Week Peaking Program
          </p>
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            marginBottom: 'var(--space-4)',
            fontWeight: 600 
          }}>
            Prescription
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {prescription.sets.map((set, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ 
                    color: 'var(--color-accent-blue)',
                    fontWeight: 600,
                    minWidth: '60px'
                  }}>
                    Set {idx + 1}
                  </span>
                  <span style={{ color: 'var(--color-text-primary)' }}>
                    {set.reps} {set.reps === 1 ? 'rep' : 'reps'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    @ {set.percentage}%
                  </span>
                  <span style={{ 
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    fontSize: 'var(--text-lg)',
                    minWidth: '80px',
                    textAlign: 'right'
                  }}>
                    {set.weight} lbs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isCurrent && !isCompleted && (
          <button
            onClick={handleComplete}
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              background: loading ? 'var(--color-bg-elevated)' : 'var(--color-accent-gradient)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Completing...' : '✓ Complete Workout'}
          </button>
        )}

        {isCompleted && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-4)',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            color: 'var(--color-success)',
            fontWeight: 600,
          }}>
            ✓ Completed
          </div>
        )}
      </div>
    </Card>
  );
}
