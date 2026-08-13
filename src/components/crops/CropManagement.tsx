'use client';

import React, { useState } from 'react';
import { 
  Sprout, Plus, Search, AlertTriangle, CheckCircle2, 
  TrendingUp, Calendar, Layers, Activity, ChevronRight, X, Sparkles, Droplets
} from 'lucide-react';
import { CropItem, GrowthStage } from '@/types/schema';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State
  const [name, setName] = useState('Wheat');
  const [variety, setVariety] = useState('HD-2967');
  const [areaAcres, setAreaAcres] = useState(3.5);
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Fruiting');

  const categories = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses', 'Fruits', 'Spices'];

  const grainNames = ['Wheat', 'Basmati Rice (Paddy)', 'Maize (Corn)', 'Pearl Millet (Bajra)', 'Sorghum (Jowar)', 'Finger Millet (Ragi)', 'Barley (Jau)'];
  const vegNames = ['Tomato', 'Potato', 'Onion', 'Chilli', 'Garlic', 'Brinjal (Eggplant)', 'Okra (Bhindi)', 'Cabbage', 'Cauliflower', 'Carrot'];
  const oilseedNames = ['Mustard (Sarson)', 'Soybean', 'Groundnut (Peanut)', 'Sunflower', 'Sesame (Til)'];
  const pulseNames = ['Chickpea (Chana)', 'Green Gram (Moong)', 'Black Gram (Urad)', 'Lentil (Masoor)'];
  const fruitNames = ['Mango Orchard', 'Banana Plantation', 'Papaya', 'Guava (Amrood)', 'Pomegranate (Anar)'];
  const spiceNames = ['Ginger', 'Turmeric (Haldi)'];

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.variety.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Grains') return grainNames.some(g => c.name.includes(g));
    if (selectedCategory === 'Vegetables') return vegNames.some(v => c.name.includes(v));
    if (selectedCategory === 'Oilseeds') return oilseedNames.some(o => c.name.includes(o));
    if (selectedCategory === 'Pulses') return pulseNames.some(p => c.name.includes(p));
    if (selectedCategory === 'Fruits') return fruitNames.some(f => c.name.includes(f));
    if (selectedCategory === 'Spices') return spiceNames.some(s => c.name.includes(s));
    return true;
  });

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
      expectedYieldKg: areaAcres * 1400,
      lastScanDate: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    };
    onAddCrop(newCrop);
    setShowAddModal(false);
  };

  const stages: GrowthStage[] = ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="h-4 w-4" /> 35+ Crop Intelligence &amp; Lifecycle Tracking
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">Crop Inventory &amp; Health Matrix</h1>
          <p className="text-xs text-[var(--text-muted)]">Real-time health scores, growth stages, disease risk &amp; yield projections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Crop Record
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                  : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search 35+ crops by name or variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => {
          const isHighRisk = crop.diseaseRisk === 'high';
          const stageIndex = stages.indexOf(crop.growthStage);
          return (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer transition duration-200"
            >
              <div className="space-y-3">
                {/* Crop Image & Badges */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[var(--bg-app)]">
                  <img
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'}
                    alt={crop.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {crop.variety}
                    </span>
                    <span className="rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {crop.areaAcres} Acres
                    </span>
                  </div>

                  <span
                    className={`absolute bottom-2 right-2 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold backdrop-blur-xs shadow-xs ${
                      isHighRisk
                        ? 'bg-red-500/90 text-white'
                        : crop.diseaseRisk === 'medium'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-emerald-600/90 text-white'
                    }`}
                  >
                    {isHighRisk ? '⚠ Disease Risk' : `Health ${crop.healthScore}/100`}
                  </span>
                </div>

                {/* Title & Disease Status */}
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary-agri)] transition">
                    {crop.name}
                  </h3>
                  {crop.activeCondition ? (
                    <p className="text-xs text-red-600 font-bold mt-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {crop.activeCondition}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Stage: <span className="font-semibold text-[var(--text-main)]">{crop.growthStage}</span>
                    </p>
                  )}
                </div>

                {/* Growth Stage Progress Stepper */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-semibold text-[var(--text-muted)]">
                    <span>Germination</span>
                    <span>Harvesting</span>
                  </div>
                  <div className="flex gap-1">
                    {stages.map((stg, i) => (
                      <div
                        key={stg}
                        className={`h-1.5 flex-1 rounded-full ${
                          i <= stageIndex ? 'bg-[var(--primary-agri)]' : 'bg-[var(--border-subtle)]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Yield & Details Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">Est. Yield: <strong className="text-[var(--text-main)]">{crop.expectedYieldKg.toLocaleString()} kg</strong></span>
                <span className="text-[var(--primary-agri)] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition">
                  Details <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CROP LIFECYCLE & PATHOLOGY MODAL ────────────────────────────────── */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Crop Pathology &amp; Lifecycle Sheet</span>
                <h2 className="text-lg font-extrabold text-[var(--text-main)]">{selectedCrop.name} ({selectedCrop.variety})</h2>
                <p className="text-xs text-[var(--text-muted)]">Planted on {selectedCrop.sowingDate} • {selectedCrop.areaAcres} Acres</p>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image & Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-[var(--bg-app)]">
                <img src={selectedCrop.imageUrl} alt={selectedCrop.name} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 text-xs">
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)] font-medium">Health Index</span>
                  <span className="font-extrabold text-emerald-700">{selectedCrop.healthScore} / 100</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)] font-medium">Disease Risk</span>
                  <span className={`font-bold capitalize ${selectedCrop.diseaseRisk === 'high' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedCrop.diseaseRisk}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)] font-medium">Est. Yield</span>
                  <span className="font-bold text-[var(--text-main)]">{selectedCrop.expectedYieldKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Est. Market Value</span>
                  <span className="font-extrabold text-emerald-700">₹{(selectedCrop.expectedYieldKg * 24).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Growth Stage Stepper Detail */}
            <div className="space-y-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4">
              <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Growth Stage Lifecycle</h3>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                {stages.map((stg, i) => {
                  const isCurrent = stg === selectedCrop.growthStage;
                  const isPassed = stages.indexOf(selectedCrop.growthStage) >= i;
                  return (
                    <div key={stg} className={`rounded-xl p-2 font-bold ${isCurrent ? 'bg-[var(--primary-agri)] text-white shadow-xs' : isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                      {stg}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  onOpenAssistant(`What are the optimal irrigation and fertilizer recommendations for my ${selectedCrop.name} (${selectedCrop.variety}) at ${selectedCrop.growthStage} stage?`);
                  setSelectedCrop(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
              >
                <Sparkles className="h-4 w-4" /> Get AI Crop Treatment Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">Add New Crop Record</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sugarcane, Cotton, Wheat..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Seed Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Co-0238, BT Cotton, Pusa Ruby..."
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  >
                    {stages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
              >
                Save Crop Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
