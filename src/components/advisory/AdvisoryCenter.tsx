'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, 
  Sparkles, Calendar, Droplets, Info, Plus, ChevronRight, ShieldCheck, Thermometer
} from 'lucide-react';
import { AdvisoryItem, TreatmentScheduleItem } from '@/types/schema';
import { INITIAL_TREATMENT_CHARTS } from '@/lib/mock-data';

interface AdvisoryCenterProps {
  advisories: AdvisoryItem[];
  onAddTask: (title: string, description: string) => void;
  onOpenAssistant: (query: string) => void;
}

export const AdvisoryCenter: React.FC<AdvisoryCenterProps> = ({
  advisories,
  onAddTask,
  onOpenAssistant,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'advisories' | 'treatment_charts'>('advisories');
  const [treatmentCharts] = useState<TreatmentScheduleItem[]>(INITIAL_TREATMENT_CHARTS);

  const filteredAdvisories = advisories.filter(a => selectedPriority === 'ALL' || a.priority === selectedPriority);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" /> AI Pathology &amp; Agronomist Advisory Intelligence
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">AI Advisory &amp; Treatment Center</h1>
          <p className="text-xs text-[var(--text-muted)]">Synthesized priority advisories derived from live vision models, weather radar &amp; crop disease math</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('advisories')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'advisories'
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            Live Advisories ({advisories.length})
          </button>

          <button
            onClick={() => setActiveTab('treatment_charts')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'treatment_charts'
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            Spray &amp; Treatment Matrix
          </button>
        </div>
      </div>

      {activeTab === 'advisories' && (
        <div className="space-y-4">
          {/* Priority Filters */}
          <div className="flex items-center gap-2">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((prio) => (
              <button
                key={prio}
                onClick={() => setSelectedPriority(prio)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedPriority === prio
                    ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                    : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>

          {/* Advisory Cards List */}
          <div className="space-y-4">
            {filteredAdvisories.map((adv) => {
              const isCritical = adv.priority === 'CRITICAL';
              const isHigh = adv.priority === 'HIGH';
              return (
                <div
                  key={adv.id}
                  className={`rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                    isCritical
                      ? 'border-red-200 bg-red-50/40'
                      : isHigh
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-card)]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isHigh
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {adv.priority} PRIORITY
                      </span>
                      <span className="rounded-lg bg-[var(--bg-app)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {adv.category}
                      </span>
                    </div>

                    <span className="text-[10px] text-[var(--text-muted)] font-medium">
                      {new Date(adv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Title & Trigger Reason */}
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--text-main)]">{adv.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{adv.reason}</p>
                  </div>

                  {/* Recommended Action Bullet Points */}
                  <div className="rounded-xl bg-white p-3 border border-[var(--border-subtle)] space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Recommended Action Protocol:</span>
                    <ul className="space-y-1 text-[var(--text-main)]">
                      {adv.recommendedActions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => onAddTask(adv.title, adv.recommendedActions.join(' '))}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add to Tasks
                    </button>

                    <button
                      onClick={() => onOpenAssistant(`How do I apply the treatment for: ${adv.title}?`)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary-agri)] hover:underline"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Consult AI Assistant
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SPRAY & TREATMENT MATRIX TAB ────────────────────────────────────── */}
      {activeTab === 'treatment_charts' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4">
            <h2 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-3">
              Agronomist Chemical &amp; Bio-Fungicide Treatment Recommendation Chart
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] text-[11px]">
                    <th className="p-3 font-bold">Crop &amp; Disease</th>
                    <th className="p-3 font-bold">Active Ingredient</th>
                    <th className="p-3 font-bold">Commercial Brands</th>
                    <th className="p-3 font-bold">Dosage / Acre</th>
                    <th className="p-3 font-bold">Spraying Interval</th>
                    <th className="p-3 font-bold">Safety Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-main)]">
                  {treatmentCharts.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="p-3">
                        <strong className="block text-sm text-[var(--text-main)]">{item.cropName}</strong>
                        <span className="text-[10px] text-red-600 font-semibold">{item.diseaseName}</span>
                      </td>
                      <td className="p-3 font-bold text-emerald-800">{item.activeIngredient}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {item.brandNames.map((b) => (
                            <span key={b} className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-[var(--text-main)]">{item.dosagePerAcre}</td>
                      <td className="p-3 text-[var(--text-muted)] font-medium">Every {item.sprayingIntervalDays} days</td>
                      <td className="p-3">
                        <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                          item.safetyLevel === 'Organic Safe' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.safetyLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
