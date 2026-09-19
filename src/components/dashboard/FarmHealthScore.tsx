'use client';

import React, { useState } from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, X, HeartPulse, Droplets, Sprout, ShieldAlert } from 'lucide-react';
import { CropItem, LivestockAnimal, FieldZone } from '@/types/schema';

interface FarmHealthScoreProps {
  score: number;
  crops: CropItem[];
  livestock: LivestockAnimal[];
  fields: FieldZone[];
}

export const FarmHealthScore: React.FC<FarmHealthScoreProps> = ({
  score,
  crops,
  livestock,
  fields,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const avgCropHealth = crops.length
    ? Math.round(crops.reduce((acc, c) => acc + c.healthScore, 0) / crops.length)
    : 91;

  const avgLivestockHealth = livestock.length
    ? Math.round(livestock.reduce((acc, l) => acc + l.healthScore, 0) / livestock.length)
    : 84;

  const avgSoilMoisture = fields.length
    ? Math.round(fields.reduce((acc, f) => acc + f.soilMoisture, 0) / fields.length)
    : 86;

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs transition hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-main)]">Farm Health Index</h2>
              <p className="text-xs text-[var(--text-muted)]">Real-time aggregate metric</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--success-green)] bg-[var(--success-bg)] px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>↑ 4.2%</span>
          </div>
        </div>

        {/* Score & Sub-bar */}
        <div className="my-4 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] tabular-nums">
            {score}
          </span>
          <span className="text-sm font-medium text-[var(--text-muted)]">/ 100</span>
          <span className="ml-auto text-xs font-medium text-[var(--primary-agri)] group-hover:underline flex items-center">
            Breakdown <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </span>
        </div>

        {/* Health Progress Line */}
        <div className="h-2 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
          <div 
            className="h-full bg-[var(--primary-agri)] transition-all duration-500" 
            style={{ width: `${score}%` }} 
          />
        </div>

        {/* 4 Quick Factors */}
        <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-[var(--border-subtle)] text-center text-xs">
          <div>
            <span className="block text-[11px] text-[var(--text-muted)]">Crop</span>
            <span className="font-bold text-[var(--text-main)] tabular-nums">{avgCropHealth}%</span>
          </div>
          <div>
            <span className="block text-[11px] text-[var(--text-muted)]">Livestock</span>
            <span className="font-bold text-[var(--text-main)] tabular-nums">{avgLivestockHealth}%</span>
          </div>
          <div>
            <span className="block text-[11px] text-[var(--text-muted)]">Soil</span>
            <span className="font-bold text-[var(--text-main)] tabular-nums">{avgSoilMoisture}%</span>
          </div>
          <div>
            <span className="block text-[11px] text-[var(--text-muted)]">Risk</span>
            <span className="font-bold text-[var(--warning-amber)]">Low-Med</span>
          </div>
        </div>
      </div>

      {/* Health Breakdown Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)] font-bold">
                  {score}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">Farm Health Analysis</h3>
                  <p className="text-xs text-[var(--text-muted)]">Computed from 7 distinct telemetry factors</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-main)] flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-[var(--primary-agri)]" /> Crop Health Factor (40% weight)
                  </span>
                  <span className="font-bold text-[var(--text-main)]">{avgCropHealth}%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Tomato field Early Blight lowered score by 6. Potato & Wheat are at optimum 92%+.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-main)] flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-emerald-600" /> Livestock Health Factor (25% weight)
                  </span>
                  <span className="font-bold text-[var(--text-main)]">{avgLivestockHealth}%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Cattle & Goats healthy. Murrah Buffalo #204 FMD vaccination pending in 7 days.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-main)] flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" /> Soil & Moisture Telemetry (20% weight)
                  </span>
                  <span className="font-bold text-[var(--text-main)]">{avgSoilMoisture}%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">North field moisture 42%. Drip irrigation active.</p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full rounded-xl bg-[var(--primary-agri)] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--primary-agri-hover)] transition"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </>
  );
};
