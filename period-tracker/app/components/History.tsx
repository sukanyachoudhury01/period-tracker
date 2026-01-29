'use client';

import { PeriodEntry } from '../types';
import { formatDate, deletePeriod } from '../lib/storage';

interface HistoryProps {
    periods: PeriodEntry[];
    onUpdate: () => void;
}

export default function History({ periods, onUpdate }: HistoryProps) {
    const handleDelete = (id: string) => {
        if (window.confirm('Delete this period entry?')) {
            deletePeriod(id);
            onUpdate();
        }
    };

    const calculateDuration = (start: string, end?: string): string => {
        if (!end) return 'Ongoing';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    if (periods.length === 0) {
        return (
            <div className="section">
                <h2 className="mb-md">History</h2>
                <div className="empty-state">
                    <p className="empty-state-title">No periods logged yet</p>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        Start tracking to build your history
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h2 className="mb-md">History</h2>
            <div className="history-list">
                {periods.map((period) => (
                    <div key={period.id} className="history-item">
                        <div className="history-dates">
                            <span className="history-date-range">
                                {formatDate(period.startDate)}
                                {period.endDate && ` — ${formatDate(period.endDate)}`}
                            </span>
                            <span className="history-duration">
                                {calculateDuration(period.startDate, period.endDate)}
                            </span>
                        </div>
                        <div className="history-actions">
                            <button
                                onClick={() => handleDelete(period.id)}
                                className="btn btn-ghost btn-danger"
                                title="Delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
