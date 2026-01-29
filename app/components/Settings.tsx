'use client';

import { useState } from 'react';
import { clearAllData, getPeriods } from '../lib/storage';

interface SettingsProps {
    onUpdate: () => void;
}

export default function Settings({ onUpdate }: SettingsProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClearData = () => {
        clearAllData();
        setShowConfirm(false);
        onUpdate();
    };

    const handleExport = () => {
        const periods = getPeriods();
        const dataStr = JSON.stringify(periods, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `period-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="section">
            <h2 className="mb-md">Settings</h2>

            <div className="card">
                <div className="flex items-center justify-between mb-lg" style={{ gap: 'var(--space-md)' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: 'var(--space-xs)' }}>Export Data</h3>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            Download your data as a JSON file
                        </p>
                    </div>
                    <button onClick={handleExport} className="btn">
                        Export
                    </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1.5px solid var(--border-color)', margin: 'var(--space-lg) 0' }} />

                <div className="flex items-center justify-between" style={{ gap: 'var(--space-md)' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: 'var(--space-xs)' }}>Clear All Data</h3>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            Permanently delete all your period data
                        </p>
                    </div>
                    <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
                        Clear Data
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Clear All Data?</h3>
                        <p className="text-muted">
                            This will permanently delete all your period tracking data. This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirm(false)} className="btn">
                                Cancel
                            </button>
                            <button onClick={handleClearData} className="btn btn-danger">
                                Yes, Clear Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
