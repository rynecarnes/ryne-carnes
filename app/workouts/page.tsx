import { Card } from '@/components/ui/Card';
import { SetupForm } from '@/components/workouts/SetupForm';
import { WorkoutDisplay } from '@/components/workouts/WorkoutDisplay';
import { 
  getWorkoutProfile, 
  getCompletions, 
  calculateWorkoutPrescription,
  getWorkoutTypeForDay,
  getWorkoutTitle
} from '@/lib/workouts';

export default async function WorkoutsPage() {
  const [profile, completions] = await Promise.all([
    getWorkoutProfile(),
    getCompletions(),
  ]);

  const completedDays = new Set(completions.map(c => c.day_index));
  const currentDayIndex = profile?.current_day_index ?? 0;

  if (!profile) {
    return (
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
          Gillingham 12 Week Program
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Brad Gillingham's peaking program for Bench and Squat
        </p>
        <SetupForm />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
        Gillingham 12 Week Program
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
        Bench Press & Squat • Heavy/Light Alternating • 12 Weeks
      </p>

      <Card style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Bench 1RM</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{profile.bench_1rm} lbs</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Squat 1RM</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{profile.squat_1rm} lbs</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Progress</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
              Week {Math.floor(currentDayIndex / 4) + 1} / 12
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
          Current Workout
        </h2>
        {currentDayIndex < 48 ? (
          <WorkoutDisplay
            prescription={calculateWorkoutPrescription(currentDayIndex, Number(profile.bench_1rm), Number(profile.squat_1rm))}
            dayIndex={currentDayIndex}
            isCompleted={completedDays.has(currentDayIndex)}
            isCurrent={true}
            isLocked={false}
          />
        ) : (
          <Card>
            <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🏆</div>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Program Complete!</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Congratulations! You've completed the 12 week program.
              </p>
            </div>
          </Card>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
          Program Overview
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
          Day 1: Light Bench → Day 2: Light Squat → Day 3: Heavy Bench → Day 4: Heavy Squat → repeat
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {Array.from({ length: Math.min(12, Math.ceil((currentDayIndex + 1) / 4)) }).map((_, weekIdx) => {
            const week = weekIdx + 1;
            return (
              <Card key={week}>
                <div style={{ padding: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
                    Week {week}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
                    {[0, 1, 2, 3].map((dayOffset) => {
                      const dayIdx = (week - 1) * 4 + dayOffset;
                      const isDone = completedDays.has(dayIdx);
                      const isLocked = dayIdx > currentDayIndex;
                      const isCurrent = dayIdx === currentDayIndex && !isDone;
                      const type = getWorkoutTypeForDay(dayIdx);
                      return (
                        <div
                          key={dayIdx}
                          style={{
                            padding: 'var(--space-2) var(--space-3)',
                            background: isCurrent ? 'rgba(59, 130, 246, 0.1)' : isDone ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-bg-elevated)',
                            borderRadius: '6px',
                            border: `1px solid ${isCurrent ? 'var(--color-accent-blue)' : isDone ? 'var(--color-success)' : 'var(--color-border)'}`,
                            fontSize: 'var(--text-sm)',
                            opacity: isLocked ? 0.4 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                          }}
                        >
                          <span>{isDone ? '✓' : isLocked ? '🔒' : isCurrent ? '▶' : '○'}</span>
                          <span>{getWorkoutTitle(type).replace(' Day', '')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
