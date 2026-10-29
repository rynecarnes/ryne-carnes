'use client';

import { useState } from 'react';
import { setupWorkoutProfile } from '@/app/workouts/actions';
import { Card } from '@/components/ui/Card';

export function SetupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await setupWorkoutProfile(formData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to set up profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-2)',
          fontWeight: 600 
        }}>
          Set Your 1 Rep Max
        </h2>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-sm)'
        }}>
          Enter your current 1RM for Bench Press and Squat to calculate weights for the Brad Gillingham 12 Week Program
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label 
              htmlFor="bench_1rm" 
              style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Bench Press 1RM (lbs)
            </label>
            <input
              id="bench_1rm"
              name="bench_1rm"
              type="number"
              step="0.5"
              min="1"
              required
              placeholder="e.g., 225"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-base)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          
          <div>
            <label 
              htmlFor="squat_1rm" 
              style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Squat 1RM (lbs)
            </label>
            <input
              id="squat_1rm"
              name="squat_1rm"
              type="number"
              step="0.5"
              min="1"
              required
              placeholder="e.g., 315"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-base)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          
          {error && (
            <div style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: loading ? 'var(--color-bg-elevated)' : 'var(--color-accent-gradient)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              marginTop: 'var(--space-2)',
            }}
          >
            {loading ? 'Setting up...' : 'Start Program'}
          </button>
        </form>
      </div>
    </Card>
  );
}
