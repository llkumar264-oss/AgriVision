'use client';

import React, { useState } from 'react';
import { 
  Sprout, Plus, Search, AlertTriangle, CheckCircle2, 
  TrendingUp, Calendar, Layers, Activity, ChevronRight, X
} from 'lucide-react';
import { CropItem, GrowthStage, DiseaseProgressionEntry } from '@/types/schema';
import { INITIAL_PROGRESSION } from '@/lib/mock-data';

interface CropManagementProps {
  crops: CropItem[];
  onAddCrop: (crop: CropItem) => void;
  onOpenAssistant: (query: string) => void;
}

export const CropManagement: React.FC<CropManagementProps> = ({
  crops,
  onAddCrop,
  onOpenAssistant,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('Tomato');
  const [variety, setVariety] = useState('Pusa Ruby');
  const [areaAcres, setAreaAcres] = useState(3.5);
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Fruiting');

  const filteredCrops = crops.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.variety.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const newCrop: CropItem = {
      id: `crop-${Date.now()}`,
      farmId: 'farm-1',
      fieldId: 'field-north',
      name,
      variety,
      areaAcres,
      sowingDate: new Date().toISOString().split('T')[0],
      growthStage,
      healthScore: 95,
      diseaseRisk: 'low',
      expectedYieldKg: areaAcres * 1200,
      lastScanDate: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    };
    onAddCrop(newCrop);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Crop Inventory & Health</h1>
          <p className="text-xs text-[var(--text-muted)]">21+ supported agricultural vegetable & grain crop records</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
        >
          <Plus className="h-4 w-4" /> Add Crop Record
        </button>
      </div>

      {/* Search & Grid */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search crops by name or variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => {
          const isHighRisk = crop.diseaseRisk === 'high';
          return (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer transition"
            >
              <div>
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-[var(--bg-app)]">
                  <img
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'}
                    alt={crop.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {crop.variety}
                  </span>
                  <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold shadow-xs ${
                    crop.healthScore >= 90 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {crop.healthScore}% Health
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text-main)]">{crop.name}</h3>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">{crop.areaAcres} Acres</span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                  <div className="flex justify-between">
                    <span>Growth Stage:</span>
                    <span className="font-medium text-[var(--text-main)]">{crop.growthStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yield Forecast:</span>
                    <span className="font-medium text-[var(--text-main)] tabular-nums">{crop.expectedYieldKg.toLocaleString()} kg</span>
                  </div>
                </div>
              </div>

              {crop.activeCondition && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--warning-bg)] p-2 text-[10px] font-bold text-[var(--warning-amber)]">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {crop.activeCondition}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Crop Detail Slide-Over Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)] font-bold">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-main)]">{selectedCrop.name} ({selectedCrop.variety})</h3>
                  <p className="text-xs text-[var(--text-muted)]">{selectedCrop.areaAcres} Acres • Growth Stage: {selectedCrop.growthStage}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 space-y-5 text-xs">
              {/* Disease Progression Timeline (Day 1 - Day 12) */}
              <div>
                <h4 className="font-bold text-xs text-[var(--text-main)] mb-3">Disease Progression History (Days 1–12)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INITIAL_PROGRESSION.map((p, idx) => (
                    <div key={idx} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 space-y-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block">{p.dayLabel} ({p.date})</span>
                      <span className="text-lg font-extrabold text-[var(--critical-red)] block tabular-nums">{p.affectedAreaPercent}%</span>
                      <span className="text-[10px] text-[var(--text-muted)] block">Humidity: {p.weatherHumidity}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Trend Interpretation */}
              <div className="rounded-xl border border-[var(--warning-amber)]/40 bg-[var(--warning-bg)] p-3.5 text-xs text-[var(--warning-amber)]">
                <span className="font-bold block mb-1">AI Progression Interpretation</span>
                <span>Observed affected leaf surface expanded from 18% to 29% over the past 4 days due to 82% ambient humidity. Immediate fungicide spray recommended.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  onOpenAssistant(`What treatment is best for ${selectedCrop.name} ${selectedCrop.activeCondition || 'health'}?`);
                  setSelectedCrop(null);
                }}
                className="rounded-xl bg-[var(--primary-agri)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
              >
                Ask AI Assistant About This Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Add New Crop Field Record</h3>
            <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tomato, Potato, Onion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. Pusa Ruby"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 rounded-xl border border-[var(--border-subtle)] py-2.5 font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-[var(--primary-agri)] py-2.5 font-semibold text-white hover:bg-[var(--primary-agri-hover)]"
                >
                  Create Crop Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
