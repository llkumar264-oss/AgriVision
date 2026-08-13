'use client';

import React, { useState } from 'react';
import { 
  History, Camera, AlertTriangle, Droplets, UserCheck, 
  DollarSign, CheckSquare, Sparkles, Filter, Clock, MapPin
} from 'lucide-react';
import { TimelineEvent } from '@/types/schema';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', 'scan', 'advisory', 'irrigation', 'livestock', 'treatment'];

  const filteredEvents = timeline.filter(e => selectedType === 'all' || e.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Camera className="h-4 w-4 text-emerald-600" />;
      case 'advisory':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'irrigation':
        return <Droplets className="h-4 w-4 text-blue-600" />;
      case 'livestock':
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      case 'treatment':
        return <DollarSign className="h-4 w-4 text-emerald-700" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="h-4 w-4" /> Real-Time Audit Log &amp; Digital Twin History
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">Farm Chronological Timeline</h1>
          <p className="text-xs text-[var(--text-muted)]">Complete audit trail of AI scans, drip irrigations, livestock records &amp; market sales</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-all ${
              selectedType === t
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-4 group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-xs z-10">
              {getIcon(evt.type)}
            </div>

            {/* Content Card */}
            <div className="flex-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                  {evt.type}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">{evt.timeLabel}</span>
              </div>

              <h3 className="text-sm font-extrabold text-[var(--text-main)] mt-1.5">{evt.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{evt.description}</p>

              <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-medium">
                <span>Actor: <strong className="text-[var(--text-main)]">{evt.actor}</strong></span>
                <span>ID: #{evt.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
