'use client';

import React from 'react';
import { History, Camera, AlertTriangle, Droplets, HeartPulse, Sparkles } from 'lucide-react';
import { TimelineEvent } from '@/types/schema';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Farm Real-Time Chronological Timeline</h1>
          <p className="text-xs text-[var(--text-muted)]">Complete audit log of scans, irrigations, observations, alerts & treatments</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-xs relative">
        <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-[var(--border-subtle)]" />
        <div className="space-y-6 relative">
          {timeline.map((event) => (
            <div key={event.id} className="flex items-start gap-4 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-agri)] text-white shadow-xs z-10 font-bold text-[10px]">
                ✓
              </div>
              <div className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-main)]">{event.title}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold">{event.timeLabel}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{event.description}</p>
                <span className="text-[10px] text-[var(--primary-agri)] font-medium block pt-1">Actor: {event.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
