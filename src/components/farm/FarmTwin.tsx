'use client';

import React, { useState } from 'react';
import { FieldZone } from '@/types/schema';
import { Map, Sprout, UserCheck, Droplets, Warehouse, Cpu, Activity, X, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FarmTwinProps {
  fields: FieldZone[];
  onSelectZone?: (zoneId: string) => void;
}

export const FarmTwin: React.FC<FarmTwinProps> = ({ fields, onSelectZone }) => {
  const [activeZone, setActiveZone] = useState<FieldZone | null>(null);

  const getZoneIcon = (type: FieldZone['type']) => {
    switch (type) {
      case 'field': return Sprout;
      case 'livestock': return UserCheck;
      case 'water': return Droplets;
      case 'storage': return Warehouse;
      case 'sensor_hub': return Cpu;
      default: return Map;
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    if (score >= 75) return 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    return 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
  };

  return (
    <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)]">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Farm Digital Twin</h2>
            <p className="text-xs text-[var(--text-muted)]">Interactive spatial telemetry map</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Optimal
          </span>
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Watch
          </span>
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Attention
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas Grid */}
      <div className="relative w-full h-[340px] md:h-[400px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        {/* Zones Layout */}
        <div className="relative w-full h-full grid grid-cols-12 grid-rows-6 gap-3">
          {fields.map((zone) => {
            const Icon = getZoneIcon(zone.type);
            const isAttention = zone.healthScore < 80;

            // Map grid positioning based on zone ID
            let colSpan = 'col-span-6 row-span-3';
            if (zone.id === 'field-north') colSpan = 'col-span-12 md:col-span-7 row-span-3';
            if (zone.id === 'field-south') colSpan = 'col-span-12 md:col-span-5 row-span-3';
            if (zone.id === 'field-east') colSpan = 'col-span-12 md:col-span-5 row-span-3';
            if (zone.id === 'zone-livestock') colSpan = 'col-span-6 md:col-span-4 row-span-3';
            if (zone.id === 'zone-water') colSpan = 'col-span-6 md:col-span-3 row-span-3';
            if (zone.id === 'zone-storage') colSpan = 'col-span-12 md:col-span-12 row-span-2';

            return (
              <div
                key={zone.id}
                onClick={() => {
                  setActiveZone(zone);
                  if (onSelectZone) onSelectZone(zone.id);
                }}
                className={`group relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${colSpan} ${getHealthBadge(
                  zone.healthScore
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 dark:bg-black/40 shadow-xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs leading-snug">{zone.name}</h3>
                      <span className="text-[10px] opacity-80">{zone.areaAcres} Acres</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/90 dark:bg-black/60 px-2 py-0.5 text-[10px] font-bold tabular-nums shadow-xs">
                    {zone.healthScore}%
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px]">
                  {zone.currentCrop && (
                    <div className="font-semibold flex items-center justify-between">
                      <span>Crop: {zone.currentCrop}</span>
                      {isAttention && (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-[10px]">
                          <AlertTriangle className="h-3 w-3" /> Action Needed
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[10px] opacity-85">
                    <span>Moisture: {zone.soilMoisture}%</span>
                    <span>Irrigation: {zone.irrigationStatus}</span>
                  </div>
                </div>

                {/* Subtle pulse indicator for attention items */}
                {isAttention && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Detail Drawer / Slide-Over */}
      {activeZone && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[var(--surface-card)] h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)] font-bold">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-main)]">{activeZone.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{activeZone.areaAcres} Acres • Telemetry Node Active</p>
                  </div>
                </div>
                <button onClick={() => setActiveZone(null)} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                {/* Health Overview */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">Zone Health Score</span>
                    <span className="text-3xl font-extrabold text-[var(--text-main)] tabular-nums">{activeZone.healthScore} / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[var(--text-muted)] block">Irrigation Status</span>
                    <span className="inline-block rounded-full bg-[var(--primary-agri-light)] px-2.5 py-1 text-xs font-bold text-[var(--primary-agri)]">
                      {activeZone.irrigationStatus}
                    </span>
                  </div>
                </div>

                {/* Specific Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border-subtle)] p-3">
                    <span className="text-[11px] text-[var(--text-muted)]">Soil Moisture</span>
                    <span className="text-lg font-bold text-[var(--text-main)] block tabular-nums">{activeZone.soilMoisture}%</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] p-3">
                    <span className="text-[11px] text-[var(--text-muted)]">Soil pH Level</span>
                    <span className="text-lg font-bold text-[var(--text-main)] block tabular-nums">{activeZone.phLevel}</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] p-3">
                    <span className="text-[11px] text-[var(--text-muted)]">Nitrogen Status</span>
                    <span className="text-sm font-bold text-[var(--text-main)] block">{activeZone.nitrogenLevel}</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] p-3">
                    <span className="text-[11px] text-[var(--text-muted)]">Last AI Scan</span>
                    <span className="text-xs font-semibold text-[var(--text-main)] block truncate">Today 09:15 AM</span>
                  </div>
                </div>

                {/* Current Crop details */}
                {activeZone.currentCrop && (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
                    <h4 className="font-bold text-xs text-[var(--text-main)]">Active Crop Record</h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Crop Name:</span>
                      <span className="font-semibold text-[var(--text-main)]">{activeZone.currentCrop}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Active Condition:</span>
                      <span className="font-semibold text-[var(--warning-amber)]">Early Blight (Moderate)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Expected Yield:</span>
                      <span className="font-semibold text-[var(--text-main)]">4,200 kg</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveZone(null)}
                className="w-full rounded-xl bg-[var(--primary-agri)] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
              >
                Close Telemetry Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
