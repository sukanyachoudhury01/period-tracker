'use client';

import { useState, useEffect, useCallback } from 'react';
import PeriodForm from './components/PeriodForm';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import History from './components/History';
import Settings from './components/Settings';
import { getPeriods, getCurrentPeriod, calculateCycleStats } from './lib/storage';
import { PeriodEntry, CycleStats } from './types';

type TabType = 'overview' | 'history' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [periods, setPeriods] = useState<PeriodEntry[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodEntry | null>(null);
  const [stats, setStats] = useState<CycleStats>({
    averageCycleLength: null,
    averagePeriodDuration: null,
    shortestCycle: null,
    longestCycle: null,
    totalPeriodsLogged: 0,
    predictedNextPeriod: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = useCallback(() => {
    setPeriods(getPeriods());
    setCurrentPeriod(getCurrentPeriod());
    setStats(calculateCycleStats());
  }, []);

  useEffect(() => {
    refreshData();
    setIsLoaded(true);
  }, [refreshData]);

  // Don't render until client-side hydration is complete
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Period Tracker</h1>
        <p className="text-muted" style={{ fontSize: 'var(--font-size-md)' }}>
          Track your cycle, understand your body
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <PeriodForm currentPeriod={currentPeriod} onUpdate={refreshData} />
          <Dashboard stats={stats} />
          <Calendar
            periods={periods}
            predictedStart={stats.predictedNextPeriod}
            avgDuration={stats.averagePeriodDuration}
          />
        </>
      )}

      {activeTab === 'history' && (
        <History periods={periods} onUpdate={refreshData} />
      )}

      {activeTab === 'settings' && (
        <Settings onUpdate={refreshData} />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-2xl) 0',
        color: 'var(--text-muted)',
        fontSize: 'var(--font-size-sm)',
        borderTop: '1.5px solid var(--border-color)',
        marginTop: 'var(--space-3xl)'
      }}>
        <p style={{ marginBottom: 'var(--space-sm)' }}>
          All data stored locally on your device
        </p>
        <p style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-muted)',
          fontWeight: 500,
          letterSpacing: '0.02em'
        }}>
          Created by Sukanya Choudhury
        </p>
      </footer>
    </>
  );
}
