'use client';

import React, { useState } from 'react';
import { 
  Sprout, Plus, Search, AlertTriangle, CheckCircle2, 
  TrendingUp, Calendar, Layers, Activity, ChevronRight, X, Sparkles, Droplets,
  Sun, Thermometer, ShieldCheck, Bug, CheckSquare, MessageSquareText, Scale, Clock
} from 'lucide-react';
import { CropItem, GrowthStage } from '@/types/schema';
import { AgriImage } from '@/components/ui/AgriImage';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'agronomy' | 'lifecycle' | 'pests' | 'harvest'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State
  const [name, setName] = useState('Wheat');
  const [variety, setVariety] = useState('HD-2967 High Yield');
  const [areaAcres, setAreaAcres] = useState(3.5);
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Fruiting');

  const categories = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses', 'Fruits', 'Spices'];

  const grainNames = ['Wheat', 'Basmati Rice', 'Paddy', 'Maize', 'Corn', 'Bajra', 'Millet', 'Jowar', 'Ragi', 'Barley', 'Jau'];
  const vegNames = ['Tomato', 'Potato', 'Onion', 'Chilli', 'Garlic', 'Brinjal', 'Eggplant', 'Okra', 'Bhindi', 'Cabbage', 'Cauliflower', 'Carrot', 'Cucumber'];
  const oilseedNames = ['Mustard', 'Sarson', 'Soybean', 'Groundnut', 'Peanut', 'Sunflower', 'Sesame', 'Til'];
  const pulseNames = ['Chickpea', 'Chana', 'Moong', 'Urad', 'Lentil', 'Masoor'];
  const fruitNames = ['Mango', 'Banana', 'Papaya', 'Guava', 'Amrood', 'Pomegranate', 'Anar', 'Apple'];
  const spiceNames = ['Ginger', 'Turmeric', 'Haldi', 'Cardamom', 'Cumin'];

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.variety.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Grains') return grainNames.some(g => c.name.toLowerCase().includes(g.toLowerCase()));
    if (selectedCategory === 'Vegetables') return vegNames.some(v => c.name.toLowerCase().includes(v.toLowerCase()));
    if (selectedCategory === 'Oilseeds') return oilseedNames.some(o => c.name.toLowerCase().includes(o.toLowerCase()));
    if (selectedCategory === 'Pulses') return pulseNames.some(p => c.name.toLowerCase().includes(p.toLowerCase()));
    if (selectedCategory === 'Fruits') return fruitNames.some(f => c.name.toLowerCase().includes(f.toLowerCase()));
    if (selectedCategory === 'Spices') return spiceNames.some(s => c.name.toLowerCase().includes(s.toLowerCase()));
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
      climate: '20°C - 30°C, Semi-arid',
      soilPh: '6.5 - 7.5 Sandy Loam',
      waterRequirement: '450 - 650 mm',
      npkRatio: '120:60:40 kg/ha',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
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
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">{t.crops.title}</h1>
          <p className="text-xs text-[var(--text-muted)]">{t.crops.subtitle}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition shrink-0"
        >
          <Plus className="h-4 w-4" /> {t.crops.addCrop}
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
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
            placeholder={t.crops.searchCrops}
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
              onClick={() => {
                setSelectedCrop(crop);
                setActiveModalTab('overview');
              }}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer transition duration-200"
            >
              <div className="space-y-3">
                {/* Crop Image with Resilient Fallback */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black/10">
                  <AgriImage
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}
                    alt={crop.name}
                    fallbackType="crop"
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
                        ? 'bg-rose-600 text-white'
                        : crop.diseaseRisk === 'medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isHighRisk ? '⚠ Alert: Disease Risk' : `Health ${crop.healthScore}/100`}
                  </span>
                </div>

                {/* Title & Disease Status */}
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary-agri)] transition">
                    {crop.name}
                  </h3>
                  {crop.activeCondition ? (
                    <p className="text-xs text-rose-600 font-bold mt-0.5 flex items-center gap-1">
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
                <span className="text-[var(--text-muted)] font-medium">
                  Est. Yield: <strong className="text-[var(--text-main)]">{crop.expectedYieldKg.toLocaleString()} kg</strong>
                </span>
                <span className="text-[var(--primary-agri)] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition">
                  Full Dossier <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── RICH MULTI-TAB CROP DOSSIER MODAL ──────────────────────────────── */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    Precision Agronomy &amp; Lifecycle Dossier
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-bold">
                    {selectedCrop.growthStage} Stage
                  </span>
                </div>
                <h2 className="text-xl font-black text-[var(--text-main)] mt-0.5">
                  {selectedCrop.name} ({selectedCrop.variety})
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Planted on {selectedCrop.sowingDate} • {selectedCrop.areaAcres} Acres Plot
                </p>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto scrollbar-none text-xs">
              {[
                { id: 'overview', label: 'Overview & Yield' },
                { id: 'agronomy', label: 'Agronomic Specs' },
                { id: 'lifecycle', label: 'Growth Lifecycle' },
                { id: 'pests', label: 'Pests & Cures' },
                { id: 'harvest', label: 'Harvest Maturity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition ${
                    activeModalTab === tab.id
                      ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW & YIELD */}
            {activeModalTab === 'overview' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-52 w-full rounded-2xl overflow-hidden bg-black/10">
                    <AgriImage
                      src={selectedCrop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}
                      alt={selectedCrop.name}
                      fallbackType="crop"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 text-xs">
                    <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-[var(--text-muted)] font-medium">Health Index Score</span>
                      <span className="font-extrabold text-emerald-600">{selectedCrop.healthScore} / 100</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-[var(--text-muted)] font-medium">Disease Threat Status</span>
                      <span className={`font-bold capitalize ${selectedCrop.diseaseRisk === 'high' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedCrop.diseaseRisk}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-[var(--text-muted)] font-medium">Projected Yield</span>
                      <span className="font-extrabold text-[var(--text-main)]">{selectedCrop.expectedYieldKg.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-[var(--text-muted)] font-medium">Est. Market Value</span>
                      <span className="font-extrabold text-emerald-600">₹{(selectedCrop.expectedYieldKg * 26).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)] font-medium">Harvest Window</span>
                      <span className="font-bold text-[var(--text-main)]">12 - 18 Days Remaining</span>
                    </div>
                  </div>
                </div>

                {selectedCrop.activeCondition && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300">
                    <span className="font-bold block mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" /> Active Pathological Alert: {selectedCrop.activeCondition}
                    </span>
                    <span>Early intervention required. Copper fungicide spray and lower leaf pruning recommended.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AGRONOMIC SPECS */}
            {activeModalTab === 'agronomy' && (
              <div className="grid grid-cols-2 gap-3 text-xs animate-fade-in">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5 text-amber-500" /> Ideal Climate
                  </span>
                  <p className="font-bold text-[var(--text-main)]">{selectedCrop.climate || '20°C - 32°C, Warm & Semi-humid'}</p>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" /> Soil Type &amp; pH
                  </span>
                  <p className="font-bold text-[var(--text-main)]">{selectedCrop.soilPh || '6.2 - 7.5 Well-drained Loam'}</p>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5 text-blue-500" /> Water Requirement
                  </span>
                  <p className="font-bold text-[var(--text-main)]">{selectedCrop.waterRequirement || '400 - 600 mm (Drip Irrigation)'}</p>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                    <Sprout className="h-3.5 w-3.5 text-emerald-500" /> Recommended N-P-K Ratio
                  </span>
                  <p className="font-bold text-[var(--text-main)]">{selectedCrop.npkRatio || '120:60:60 kg/ha'}</p>
                </div>
              </div>
            )}

            {/* TAB 3: GROWTH LIFECYCLE */}
            {activeModalTab === 'lifecycle' && (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  {stages.map((stg, i) => {
                    const isCurrent = stg === selectedCrop.growthStage;
                    const isPassed = stages.indexOf(selectedCrop.growthStage) >= i;
                    return (
                      <div
                        key={stg}
                        className={`rounded-2xl p-3 font-bold transition ${
                          isCurrent
                            ? 'bg-[var(--primary-agri)] text-white shadow-md ring-2 ring-emerald-400'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                        }`}
                      >
                        <span className="block text-xs mb-0.5">Stage {i + 1}</span>
                        {stg}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
                  <h4 className="font-bold text-[var(--text-main)]">Current Stage Objectives ({selectedCrop.growthStage}):</h4>
                  <ul className="space-y-1.5 text-[var(--text-muted)]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Maintain optimum soil moisture level (45-55%) to prevent blossom end drop.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Foliar spray of water-soluble NPK 0:0:50 (Potassium) to boost fruit weight and sugar content.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: PESTS & CURES */}
            {activeModalTab === 'pests' && (
              <div className="space-y-3 text-xs animate-fade-in">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-1.5">
                  <span className="font-bold text-rose-600 flex items-center gap-1.5">
                    <Bug className="h-4 w-4" /> Primary Threat: Early Blight &amp; Whitefly Vectors
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Symptoms: Concentric dark target spots on foliage, upward leaf curling, flower drop.
                  </p>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 rounded-xl bg-emerald-500/10 p-2 text-emerald-800 dark:text-emerald-300">
                      <strong>Organic Remedy:</strong> Neem Oil 10,000 PPM (5ml/L) + Trichoderma viride (5g/L).
                    </div>
                    <div className="flex-1 rounded-xl bg-blue-500/10 p-2 text-blue-800 dark:text-blue-300">
                      <strong>Chemical Solution:</strong> Copper Oxychloride 50% WP (2.5g/L) or Imidacloprid (0.5ml/L).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HARVEST MATURITY */}
            {activeModalTab === 'harvest' && (
              <div className="space-y-3 text-xs animate-fade-in">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
                  <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-emerald-600" /> Key Harvest Maturity Indicators
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Target Brix Sugar</span>
                      <span className="font-bold text-emerald-600 block">5.5° - 7.5° Bx</span>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Firmness Threshold</span>
                      <span className="font-bold text-indigo-600 block">16 - 22 Newtons</span>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Color Coverage</span>
                      <span className="font-bold text-amber-600 block">&gt; 85% Surface</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] pt-1">
                    Pick during morning hours (06:00 - 09:30 AM) to maintain turgor pressure and extend crate shelf life.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  onOpenAssistant(`What is the complete cultivation and harvest plan for my ${selectedCrop.name} (${selectedCrop.variety}) at ${selectedCrop.growthStage} stage?`);
                  setSelectedCrop(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
              >
                <Sparkles className="h-4 w-4" /> Consult AI Assistant About This Crop
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
