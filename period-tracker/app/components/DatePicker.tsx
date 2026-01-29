'use client';

import { useState, useMemo } from 'react';

interface DatePickerProps {
    selected: string | null;
    onSelect: (date: string) => void;
    onClose: () => void;
    minDate?: string;
    maxDate?: string;
    title: string;
}

export default function DatePicker({ selected, onSelect, onClose, minDate, maxDate, title }: DatePickerProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        if (selected) return new Date(selected);
        return new Date();
    });

    const { year, month, daysInMonth, firstDayOfWeek, today } = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const days = new Date(y, m + 1, 0).getDate();
        const firstDay = new Date(y, m, 1).getDay();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        return {
            year: y,
            month: m,
            daysInMonth: days,
            firstDayOfWeek: firstDay,
            today: todayDate.getFullYear() === y && todayDate.getMonth() === m ? todayDate.getDate() : null,
        };
    }, [currentDate]);

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

    const handleDayClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Check if date is within bounds
        if (minDate && dateStr < minDate) return;
        if (maxDate && dateStr > maxDate) return;

        onSelect(dateStr);
    };

    const isDateDisabled = (day: number): boolean => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (minDate && dateStr < minDate) return true;
        if (maxDate && dateStr > maxDate) return true;
        return false;
    };

    const isDateSelected = (day: number): boolean => {
        if (!selected) return false;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return dateStr === selected;
    };

    // Create calendar grid
    const calendarDays = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isDisabled = isDateDisabled(day);
        const isSelected = isDateSelected(day);
        const isToday = day === today;

        let className = 'calendar-day';
        if (isDisabled) className += ' empty';
        if (isSelected) className += ' selected';
        else if (isToday) className += ' today';

        calendarDays.push(
            <div
                key={day}
                className={className}
                onClick={() => !isDisabled && handleDayClick(day)}
                style={isDisabled ? { cursor: 'not-allowed', opacity: 0.3 } : undefined}
            >
                {day}
            </div>
        );
    }

    return (
        <div className="date-picker-modal" onClick={onClose}>
            <div className="date-picker" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>
                    {title}
                </h3>

                <div className="calendar">
                    <div className="calendar-header">
                        <div className="calendar-nav">
                            <button onClick={goToPrevMonth} className="btn btn-ghost btn-icon">
                                ←
                            </button>
                        </div>
                        <div className="calendar-title">
                            {monthNames[month]} {year}
                        </div>
                        <div className="calendar-nav">
                            <button onClick={goToToday} className="btn btn-ghost" style={{ fontSize: 'var(--font-size-xs)' }}>
                                Today
                            </button>
                            <button onClick={goToNextMonth} className="btn btn-ghost btn-icon">
                                →
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {dayNames.map(day => (
                            <div key={day} className="calendar-day-header">{day}</div>
                        ))}
                        {calendarDays}
                    </div>
                </div>

                <div className="flex gap-md mt-md" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
