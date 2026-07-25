import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
        Welcome back
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Select a tool from the navigation or below to get started.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        {/* Placeholder tool cards */}
        <Link href="/home-runs" style={{ display: 'block', textDecoration: 'none' }}>
          <Card style={{ cursor: 'pointer', height: '100%' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <span style={{ fontSize: '20px' }}>⚾️</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Home Runs</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
              Track, view, and analyze home run statistics and data.
            </p>
          </Card>
        </Link>

        <Card>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-4)'
          }}>
            <span style={{ fontSize: '20px' }}>⚙️</span>
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Settings</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
            Manage account preferences, API keys, and global configuration options.
          </p>
        </Card>
      </div>
    </div>
  );
}
