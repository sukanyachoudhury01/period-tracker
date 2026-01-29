import { PeriodEntry, CycleStats } from '../types';

const STORAGE_KEY = 'period-tracker-data';

// Generate unique ID
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get all periods from localStorage
export function getPeriods(): PeriodEntry[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save periods to localStorage
function savePeriods(periods: PeriodEntry[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

// Add a new period entry
export function addPeriod(startDate: string, endDate?: string): PeriodEntry {
    const periods = getPeriods();
    const newPeriod: PeriodEntry = {
        id: generateId(),
        startDate,
        endDate,
    };
    periods.push(newPeriod);
    // Sort by start date descending (newest first)
    periods.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    savePeriods(periods);
    return newPeriod;
}

// Update an existing period
export function updatePeriod(id: string, updates: Partial<Omit<PeriodEntry, 'id'>>): PeriodEntry | null {
    const periods = getPeriods();
    const index = periods.findIndex(p => p.id === id);
    if (index === -1) return null;

    periods[index] = { ...periods[index], ...updates };
    savePeriods(periods);
    return periods[index];
}

// Delete a period
export function deletePeriod(id: string): boolean {
    const periods = getPeriods();
    const filtered = periods.filter(p => p.id !== id);
    if (filtered.length === periods.length) return false;

    savePeriods(filtered);
    return true;
}

// Clear all data
export function clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// Calculate days between two dates
function daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate cycle statistics
export function calculateCycleStats(): CycleStats {
    const periods = getPeriods();

    if (periods.length === 0) {
        return {
            averageCycleLength: null,
            averagePeriodDuration: null,
            shortestCycle: null,
            longestCycle: null,
            totalPeriodsLogged: 0,
            predictedNextPeriod: null,
        };
    }

    // Calculate period durations
    const durations: number[] = [];
    periods.forEach(p => {
        if (p.endDate) {
            durations.push(daysBetween(p.startDate, p.endDate) + 1);
        }
    });

    // Calculate cycle lengths (days between consecutive period starts)
    const cycleLengths: number[] = [];
    const sortedPeriods = [...periods].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 1; i < sortedPeriods.length; i++) {
        const cycleLength = daysBetween(sortedPeriods[i - 1].startDate, sortedPeriods[i].startDate);
        if (cycleLength > 0 && cycleLength < 60) { // Ignore unrealistic cycle lengths
            cycleLengths.push(cycleLength);
        }
    }

    const averageCycleLength = cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : null;

    const averagePeriodDuration = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length * 10) / 10
        : null;

    // Predict next period
    let predictedNextPeriod: string | null = null;
    if (averageCycleLength && sortedPeriods.length > 0) {
        const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
        const lastStart = new Date(lastPeriod.startDate);
        const nextStart = new Date(lastStart);
        nextStart.setDate(nextStart.getDate() + averageCycleLength);
        predictedNextPeriod = nextStart.toISOString().split('T')[0];
    }

    return {
        averageCycleLength,
        averagePeriodDuration,
        shortestCycle: cycleLengths.length > 0 ? Math.min(...cycleLengths) : null,
        longestCycle: cycleLengths.length > 0 ? Math.max(...cycleLengths) : null,
        totalPeriodsLogged: periods.length,
        predictedNextPeriod,
    };
}

// Get the most recent period (to check if ongoing)
export function getCurrentPeriod(): PeriodEntry | null {
    const periods = getPeriods();
    if (periods.length === 0) return null;

    // Get most recent period
    const sorted = [...periods].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const latest = sorted[0];
    // If it doesn't have an end date, it's ongoing
    if (!latest.endDate) return latest;

    return null;
}

// Format date for display
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// Get today's date as ISO string
export function getTodayISO(): string {
    return new Date().toISOString().split('T')[0];
}
