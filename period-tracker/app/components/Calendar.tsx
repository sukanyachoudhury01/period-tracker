'use client';

import { useMemo, useState } from 'react';
import { PeriodEntry } from '../types';

interface CalendarProps {
    periods: PeriodEntry[];
    predictedStart: string | null;
    avgDuration: number | null;
}

export default function Calendar({ periods, predictedStart, avgDuration }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { year, month, daysInMonth, firstDayOfWeek, periodDays, predictedDays, today } = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const days = new Date(y, m + 1, 0).getDate();
        const firstDay = new Date(y, m, 1).getDay();
        const todayDate = new Date();

        // Get period days for this month
        const pDays = new Set<number>();
        periods.forEach(period => {
            const start = new Date(period.startDate);
            const end = period.endDate ? new Date(period.endDate) : new Date();

            // Iterate through each day of the period
            const current = new Date(start);
            while (current <= end) {
                if (current.getFullYear() === y && current.getMonth() === m) {
                    pDays.add(current.getDate());
                }
                current.setDate(current.getDate() + 1);
            }
        });

        // Get predicted days for this month
        const predDays = new Set<number>();
        if (predictedStart && avgDuration) {
            const predStart = new Date(predictedStart);
            const duration = Math.round(avgDuration);

            for (let i = 0; i < duration; i++) {
                const predDate = new Date(predStart);
                predDate.setDate(predDate.getDate() + i);
                if (predDate.getFullYear() === y && predDate.getMonth() === m) {
                    // Only show prediction if it's not already a logged period day
                    if (!pDays.has(predDate.getDate())) {
                        predDays.add(predDate.getDate());
                    }
                }
            }
        }

        return {
            year: y,
            month: m,
            daysInMonth: days,
            firstDayOfWeek: firstDay,
            periodDays: pDays,
            predictedDays: predDays,
            today: todayDate.getFullYear() === y && todayDate.getMonth() === m ? todayDate.getDate() : null,
        };
    }, [currentDate, periods, predictedStart, avgDuration]);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Create calendar grid
    const calendarDays = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isPeriod = periodDays.has(day);
        const isPredicted = predictedDays.has(day);
        const isToday = day === today;

        let className = 'calendar-day';
        if (isPeriod) className += ' period';
        else if (isPredicted) className += ' predicted';
        if (isToday) className += ' today';

        calendarDays.push(
            <div key={day} className={className}>
                {day}
            </div>
        );
    }

    return (
        <div className="section">
            <h2 className="mb-md">Calendar</h2>
            <div className="calendar">
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button onClick={goToPrevMonth} className="btn btn-ghost">←</button>
                    </div>
                    <div className="calendar-title">
                        {monthNames[month]} {year}
                    </div>
                    <div className="calendar-nav">
                        <button onClick={goToToday} className="btn btn-ghost" style={{ fontSize: 'var(--font-size-xs)' }}>
                            Today
                        </button>
                        <button onClick={goToNextMonth} className="btn btn-ghost">→</button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}
                    {calendarDays}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-md mt-md" style={{ justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>
                <div className="flex items-center gap-sm">
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: 'var(--period-primary)'
                    }} />
                    <span className="text-muted">Period</span>
                </div>
                <div className="flex items-center gap-sm">
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: 'var(--period-predicted)'
                    }} />
                    <span className="text-muted">Predicted</span>
                </div>
            </div>
        </div>
    );
}
