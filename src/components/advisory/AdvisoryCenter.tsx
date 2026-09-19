'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Sparkles, CheckSquare, Eye } from 'lucide-react';
import { AdvisoryItem } from '@/types/schema';

interface AdvisoryCenterProps {
  advisories: AdvisoryItem[];
  onAddTask: (title: string, desc: string) => void;
  onOpenAssistant: (query: string) => void;
}

export const AdvisoryCenter: React.FC<AdvisoryCenterProps> = ({
  advisories,
  onAddTask,
  onOpenAssistant,
}) => {
  const getPriorityStyle = (priority: AdvisoryItem['priority']) => {
    switch (priority) {
      case 'CRITICAL': return 'border-red-500/40 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300';
      case 'HIGH': return 'border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
      default: return 'border-blue-500/40 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">AI Advisory Center</h1>
          <p className="text-xs text-[var(--text-muted)]">Synthesized priority advisories derived from live crop vision, weather & disease models</p>
        </div>
      </div>

      <div className="space-y-4">
        {advisories.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-5 shadow-xs space-y-4 transition ${getPriorityStyle(item.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-black/40 shadow-xs">
                  {item.priority} PRIORITY
                </span>
                <span className="text-xs font-semibold">{item.category} Intelligence</span>
              </div>
              <span className="text-[11px] opacity-75">Today 09:20 AM</span>
            </div>

            <div>
              <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
              <p className="text-xs mt-1 opacity-90">{item.reason}</p>
            </div>

            <div className="rounded-xl bg-white/70 dark:bg-black/30 p-3.5 space-y-2 text-xs">
              <span className="font-bold text-[11px] uppercase tracking-wider block">Recommended Action Steps</span>
              <ul className="space-y-1.5">
                {item.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => onAddTask(item.title, item.recommendedActions[0] || item.reason)}
                className="flex items-center gap-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black px-3.5 py-2 text-xs font-semibold shadow-xs hover:opacity-90 transition"
              >
                <CheckSquare className="h-3.5 w-3.5" /> Create Farm Task
              </button>
              <button
                onClick={() => onOpenAssistant(`Give me deeper details regarding advisory: ${item.title}`)}
                className="flex items-center gap-1.5 rounded-xl border border-current px-3.5 py-2 text-xs font-semibold hover:bg-white/40 transition"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask AI Assistant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
