'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';
import { fetchHomeRunData } from './actions';
import { Game } from '@/models/game';

export default function HomeRunsPage() {
  const [date, setDate] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchHomeRunData(date);

      setGames(data.games || []);
      setSearchDate(date);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch home run data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
        Home Runs
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Track and analyze home run data by date.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="date-picker" className={styles.label}>
              Select Date
            </label>
            <input
              id="date-picker"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !date}
            className={styles.button}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            Results {searchDate && games.length > 0 && `for ${searchDate}`}
          </h2>

          {games.length > 0 ? (
            <div className={styles.gamesList}>
              {games.map((game, idx) => (
                <div key={idx} className={styles.gameCard}>
                  <div className={styles.gameHeader}>
                    <h3 className={styles.gameTitle}>
                      {game.awayTeam} vs {game.homeTeam}
                    </h3>
                  </div>
                  
                  <div className={styles.teamsContainer}>
                    {/* Away Team Section */}
                    <div className={styles.teamSection}>
                      <h4 className={styles.teamName}>{game.awayTeam}</h4>
                      <ul className={styles.list}>
                        {game.homeRuns.filter(hr => hr.team === game.awayTeam).map((hr, hrIdx) => (
                          <li key={hrIdx} className={styles.listItem}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className={styles.playerName}>{hr.player}</span>
                              <span className={styles.hrDescription}>{hr.description}</span>
                            </div>
                          </li>
                        ))}
                        {game.homeRuns.filter(hr => hr.team === game.awayTeam).length === 0 && (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', margin: 'var(--space-4) 0' }}>No home runs</p>
                        )}
                      </ul>
                    </div>

                    {/* Home Team Section */}
                    <div className={styles.teamSection}>
                      <h4 className={styles.teamName}>{game.homeTeam}</h4>
                      <ul className={styles.list}>
                        {game.homeRuns.filter(hr => hr.team === game.homeTeam).map((hr, hrIdx) => (
                          <li key={hrIdx} className={styles.listItem}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className={styles.playerName}>{hr.player}</span>
                              <span className={styles.hrDescription}>{hr.description}</span>
                            </div>
                          </li>
                        ))}
                        {game.homeRuns.filter(hr => hr.team === game.homeTeam).length === 0 && (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', margin: 'var(--space-4) 0' }}>No home runs</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {loading ? 'Loading...' : 'No home runs found for this date. Select a date and search to see results.'}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
