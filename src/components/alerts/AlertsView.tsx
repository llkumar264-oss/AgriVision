'use client';

import React from 'react';
import { Bell, AlertTriangle, CloudRain, HeartPulse, CheckCircle2 } from 'lucide-react';
import { AlertNotification } from '@/types/schema';

interface AlertsViewProps {
  alerts: AlertNotification[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Real-Time Alerts & Warning System</h1>
          <p className="text-xs text-[var(--text-muted)]">Disease outbreak notifications, weather warnings & livestock check reminders</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="flex items-start justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                alt.severity === 'Critical' ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-[var(--text-main)]">{alt.title}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-muted)] uppercase">
                    {alt.type}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{alt.message}</p>
              </div>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold shrink-0">Today 09:16 AM</span>
          </div>
        ))}
      </div>
    </div>
  );
};
