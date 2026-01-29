'use client';

import { CycleStats } from '../types';

interface DashboardProps {
    stats: CycleStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const formatPrediction = (dateStr: string | null) => {
        if (!dateStr) return 'Not enough data';
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const predDate = new Date(dateStr);
        predDate.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((predDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days ago`;
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays <= 7) {
            return `In ${diffDays} days`;
        }

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (stats.totalPeriodsLogged === 0) {
        return (
            <div className="section">
                <h2 className="mb-md">Cycle Insights</h2>
                <div className="empty-state">
                    <p className="empty-state-title">No data yet</p>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        Start logging your periods to see insights
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h2 className="mb-md">Cycle Insights</h2>

            {/* Primary prediction card */}
            {stats.predictedNextPeriod && (
                <div
                    className="card mb-lg"
                    style={{
                        background: 'var(--period-light)',
                        borderColor: 'var(--period-primary)',
                        textAlign: 'center'
                    }}
                >
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                        Next period expected
                    </p>
                    <p style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 500,
                        color: 'var(--period-accent)',
                        letterSpacing: '-0.02em'
                    }}>
                        {formatPrediction(stats.predictedNextPeriod)}
                    </p>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>
                        {new Date(stats.predictedNextPeriod).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            )}

            {/* Stats grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">
                        {stats.averageCycleLength ?? '—'}
                    </div>
                    <div className="stat-label">
                        Avg. Cycle Length
                        {stats.averageCycleLength && <span style={{ display: 'block', marginTop: '2px' }}>days</span>}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {stats.averagePeriodDuration ?? '—'}
                    </div>
                    <div className="stat-label">
                        Avg. Period Duration
                        {stats.averagePeriodDuration && <span style={{ display: 'block', marginTop: '2px' }}>days</span>}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>
                        {stats.shortestCycle ?? '—'}—{stats.longestCycle ?? '—'}
                    </div>
                    <div className="stat-label">
                        Cycle Range
                        {stats.shortestCycle && <span style={{ display: 'block', marginTop: '2px' }}>days</span>}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {stats.totalPeriodsLogged}
                    </div>
                    <div className="stat-label">
                        Periods Logged
                    </div>
                </div>
            </div>
        </div>
    );
}
