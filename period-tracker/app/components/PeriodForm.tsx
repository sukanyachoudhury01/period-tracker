'use client';

import { useState, useCallback } from 'react';
import DatePicker from './DatePicker';
import {
    addPeriod,
    updatePeriod,
    getCurrentPeriod,
    getTodayISO,
    formatDate,
} from '../lib/storage';
import { PeriodEntry } from '../types';

interface PeriodFormProps {
    currentPeriod: PeriodEntry | null;
    onUpdate: () => void;
}

export default function PeriodForm({ currentPeriod, onUpdate }: PeriodFormProps) {
    const [showManualForm, setShowManualForm] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [startDate, setStartDate] = useState<string | null>(getTodayISO());
    const [endDate, setEndDate] = useState<string | null>(getTodayISO());

    const handleStartPeriod = useCallback(() => {
        addPeriod(getTodayISO());
        onUpdate();
    }, [onUpdate]);

    const handleEndPeriod = useCallback(() => {
        if (currentPeriod) {
            updatePeriod(currentPeriod.id, { endDate: getTodayISO() });
            onUpdate();
        }
    }, [currentPeriod, onUpdate]);

    const handleManualAdd = useCallback(() => {
        if (startDate) {
            addPeriod(startDate, endDate || undefined);
            setShowManualForm(false);
            setStartDate(getTodayISO());
            setEndDate(getTodayISO());
            onUpdate();
        }
    }, [startDate, endDate, onUpdate]);

    const handleStartDateSelect = (date: string) => {
        setStartDate(date);
        setShowStartPicker(false);
        // If end date is before start date, update it
        if (endDate && date > endDate) {
            setEndDate(date);
        }
    };

    const handleEndDateSelect = (date: string) => {
        setEndDate(date);
        setShowEndPicker(false);
    };

    return (
        <div className="card section">
            {/* Status display */}
            <div className="flex items-center justify-between mb-lg" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--space-sm)' }}>Current Status</h2>
                    {currentPeriod ? (
                        <span className="status-badge status-active">
                            <span className="pulse-dot" />
                            Period ongoing since {new Date(currentPeriod.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    ) : (
                        <span className="status-badge status-inactive">
                            No active period
                        </span>
                    )}
                </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-md mb-md" style={{ flexWrap: 'wrap' }}>
                {!currentPeriod ? (
                    <button onClick={handleStartPeriod} className="btn btn-period btn-lg">
                        Period Started Today
                    </button>
                ) : (
                    <button onClick={handleEndPeriod} className="btn btn-primary btn-lg">
                        Period Ended Today
                    </button>
                )}

                <button
                    onClick={() => setShowManualForm(!showManualForm)}
                    className="btn btn-lg"
                >
                    Log Past Period
                </button>
            </div>

            {/* Manual date entry form */}
            {showManualForm && (
                <div className="card" style={{ background: 'var(--bg-secondary)', marginTop: 'var(--space-lg)' }}>
                    <h3 className="mb-md">Log a Past Period</h3>
                    <p className="text-muted mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                        Select the start and end dates using the calendar
                    </p>

                    <div className="date-selection">
                        {/* Start Date */}
                        <div>
                            <label className="input-label">Start Date</label>
                            <div
                                className={`date-input-display ${showStartPicker ? 'active' : ''}`}
                                onClick={() => setShowStartPicker(true)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500 }}>
                                        {startDate ? formatDate(startDate) : 'Select date'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>📅</span>
                                </div>
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="input-label">End Date (Optional)</label>
                            <div
                                className={`date-input-display ${showEndPicker ? 'active' : ''}`}
                                onClick={() => setShowEndPicker(true)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500 }}>
                                        {endDate ? formatDate(endDate) : 'Select date'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>📅</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-md mt-md">
                        <button onClick={handleManualAdd} className="btn btn-primary" disabled={!startDate}>
                            Save Period
                        </button>
                        <button
                            onClick={() => {
                                setShowManualForm(false);
                                setStartDate(getTodayISO());
                                setEndDate(getTodayISO());
                            }}
                            className="btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Date Pickers */}
            {showStartPicker && (
                <DatePicker
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    onClose={() => setShowStartPicker(false)}
                    maxDate={getTodayISO()}
                    title="Select Start Date"
                />
            )}

            {showEndPicker && (
                <DatePicker
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    onClose={() => setShowEndPicker(false)}
                    minDate={startDate || undefined}
                    maxDate={getTodayISO()}
                    title="Select End Date"
                />
            )}
        </div>
    );
}
