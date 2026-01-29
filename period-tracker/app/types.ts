// Period entry stored in localStorage
export interface PeriodEntry {
  id: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate?: string;  // ISO date string YYYY-MM-DD (optional - period may still be ongoing)
}

// Calculated cycle statistics
export interface CycleStats {
  averageCycleLength: number | null;   // Days between period starts
  averagePeriodDuration: number | null; // Days period lasts
  shortestCycle: number | null;
  longestCycle: number | null;
  totalPeriodsLogged: number;
  predictedNextPeriod: string | null;  // ISO date string
}

// Month data for calendar view
export interface MonthData {
  year: number;
  month: number; // 0-indexed (0 = January)
  periodDays: number[]; // Array of day numbers that had period
  predictedDays: number[]; // Array of predicted period days
}
