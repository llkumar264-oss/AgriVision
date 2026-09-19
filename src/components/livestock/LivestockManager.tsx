'use client';

import React, { useState } from 'react';
import { 
  UserCheck, Plus, Search, AlertCircle, CheckCircle2, 
  Activity, Calendar, ShieldCheck, Heart, Sparkles, X, ChevronRight, Scale, Milk, Stethoscope, Droplet
} from 'lucide-react';
import { LivestockAnimal, AnimalType } from '@/types/schema';

interface LivestockManagerProps {
  livestock: LivestockAnimal[];
  onAddAnimal: (animal: LivestockAnimal) => void;
  onOpenAssistant: (query: string) => void;
}

export const LivestockManager: React.FC<LivestockManagerProps> = ({
  livestock,
  onAddAnimal,
  onOpenAssistant,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockAnimal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileTab, setProfileTab] = useState<'overview' | 'health' | 'production' | 'nutrition'>('overview');

  // Feed Calculator State
  const [calcWeightKg, setCalcWeightKg] = useState<number>(450);
  const [calcMilkYieldL, setCalcMilkYieldL] = useState<number>(15);

  // Form State
  const [tagNumber, setTagNumber] = useState('IND-RJ-105');
  const [type, setType] = useState<AnimalType>('Cow');
  const [breed, setBreed] = useState('Gir Pure Breed');
  const [ageMonths, setAgeMonths] = useState(30);
  const [weightKg, setWeightKg] = useState(440);
  const [notes, setNotes] = useState('High milk yield producer, healthy condition.');

  const animalTypes = ['All', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Chicken'];

  const filteredLivestock = livestock.filter(a => {
    const matchesType = selectedType === 'All' || a.type === selectedType;
    const matchesSearch = a.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: LivestockAnimal = {
      id: `animal-${Date.now()}`,
      farmId: 'farm-1',
      tagNumber,
      type,
      breed,
      ageMonths,
      weightKg,
      healthScore: 95,
      riskLevel: 'low',
      lastVaccinationDate: new Date().toISOString().split('T')[0],
      nextVaccinationDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastCheckDate: new Date().toISOString().split('T')[0],
      imageUrl: type === 'Cow' 
        ? 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80'
        : type === 'Buffalo'
        ? 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80'
        : type === 'Goat'
        ? 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
      notes,
    };

    onAddAnimal(newAnimal);
    setShowAddModal(false);
  };

  // Ration Calculator Formula
  const greenFodderKg = Math.round(calcWeightKg * 0.05);
  const dryFodderKg = Math.round(calcWeightKg * 0.02);
  const concentrateKg = (1.5 + calcMilkYieldL * 0.4).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="h-4 w-4" /> Animal Husbandry &amp; Livestock Intelligence
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-main)]">Livestock Digital Tag &amp; Health Hub</h1>
          <p className="text-xs text-[var(--text-muted)]">Comprehensive animal profiles, milk yield history, vaccination logs &amp; nutrition plans</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition shrink-0"
        >
          <Plus className="h-4 w-4" /> Register Animal
        </button>
      </div>

      {/* RATION CALCULATOR SUMMARY BAR */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-emerald-700" /> AI Livestock Daily Ration &amp; Feed Calculator
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Balanced Nutrition</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-emerald-900 mb-1">Animal Weight (kg)</label>
            <input
              type="number"
              value={calcWeightKg}
              onChange={(e) => setCalcWeightKg(Number(e.target.value))}
              className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-900 mb-1">Daily Milk (Liters)</label>
            <input
              type="number"
              value={calcMilkYieldL}
              onChange={(e) => setCalcMilkYieldL(Number(e.target.value))}
              className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900"
            />
          </div>

          <div className="col-span-2 rounded-xl bg-white p-3 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-emerald-700 block font-semibold">Recommended Daily Ration</span>
              <p className="font-extrabold text-emerald-900 mt-0.5">
                Green Fodder: {greenFodderKg}kg • Dry Fodder: {dryFodderKg}kg • Concentrate: {concentrateKg}kg
              </p>
            </div>
            <button
              onClick={() => onOpenAssistant(`How can I optimize cattle feed ration for a ${calcWeightKg}kg animal producing ${calcMilkYieldL}L milk daily?`)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition shrink-0 ml-2"
            >
              Feed Advice
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {animalTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                  : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by tag #, breed, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLivestock.map((animal) => (
          <div
            key={animal.id}
            onClick={() => { setSelectedAnimal(animal); setProfileTab('overview'); }}
            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer transition duration-200"
          >
            <div className="space-y-3">
              {/* Image & Badges */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[var(--bg-app)]">
                <img
                  src={animal.imageUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80'}
                  alt={animal.tagNumber}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    Tag: {animal.tagNumber}
                  </span>
                  <span className="rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {animal.type}
                  </span>
                </div>

                <span className={`absolute bottom-2 right-2 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold backdrop-blur-xs shadow-xs ${
                  animal.riskLevel === 'medium' || animal.riskLevel === 'high'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-emerald-600/90 text-white'
                }`}>
                  Health {animal.healthScore}/100
                </span>
              </div>

              {/* Title & Notes */}
              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary-agri)] transition">
                  {animal.breed}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 font-medium">
                  {animal.notes}
                </p>
              </div>

              {/* Weight & Vaccination Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="rounded-lg bg-[var(--bg-app)] p-2 border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)] block font-medium">Weight</span>
                  <strong className="text-[var(--text-main)] font-bold">{animal.weightKg} kg</strong>
                </div>
                <div className="rounded-lg bg-[var(--bg-app)] p-2 border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)] block font-medium">Booster Due</span>
                  <strong className="text-amber-700 font-bold">{animal.nextVaccinationDue}</strong>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Age: <strong className="text-[var(--text-main)]">{animal.ageMonths} months</strong></span>
              <span className="text-[var(--primary-agri)] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition">
                View Deep Profile <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── STUNNING ANIMAL PROFILE MODAL ────────────────────────────────────── */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header Banner */}
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedAnimal.imageUrl} alt={selectedAnimal.tagNumber} className="h-14 w-14 rounded-2xl object-cover border border-emerald-300" />
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Digital Animal Passport #{selectedAnimal.tagNumber}</span>
                  <h2 className="text-lg font-extrabold text-[var(--text-main)]">{selectedAnimal.breed} ({selectedAnimal.type})</h2>
                  <p className="text-xs text-[var(--text-muted)]">Registered on Rajasthan Green Fields • Age: {selectedAnimal.ageMonths} Months</p>
                </div>
              </div>
              <button onClick={() => setSelectedAnimal(null)} className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
              <button
                onClick={() => setProfileTab('overview')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  profileTab === 'overview' ? 'bg-[var(--primary-agri)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Overview &amp; Tag
              </button>

              <button
                onClick={() => setProfileTab('health')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  profileTab === 'health' ? 'bg-[var(--primary-agri)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Vet &amp; Vaccines
              </button>

              <button
                onClick={() => setProfileTab('production')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  profileTab === 'production' ? 'bg-[var(--primary-agri)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Milk Yield &amp; Fat Log
              </button>

              <button
                onClick={() => setProfileTab('nutrition')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  profileTab === 'nutrition' ? 'bg-[var(--primary-agri)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Feed Protocol
              </button>
            </div>

            {/* Tab 1: Overview */}
            {profileTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Health Score</span>
                    <span className="text-base font-extrabold text-emerald-700">{selectedAnimal.healthScore} / 100</span>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Weight</span>
                    <span className="text-base font-extrabold text-[var(--text-main)]">{selectedAnimal.weightKg} kg</span>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Lactation Stage</span>
                    <span className="text-xs font-extrabold text-emerald-800">Peak (Lactation 2)</span>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Risk Level</span>
                    <span className="text-xs font-extrabold uppercase text-emerald-700">{selectedAnimal.riskLevel}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 space-y-2 text-xs">
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">Agronomist Notes &amp; Temperament</h3>
                  <p className="text-[var(--text-main)] leading-relaxed">{selectedAnimal.notes}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Health & Vet */}
            {profileTab === 'health' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-3">
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-emerald-600" /> Mandatory Vaccination Schedule
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[var(--border-subtle)]">
                      <div>
                        <strong className="block text-[var(--text-main)]">FMD (Foot &amp; Mouth Disease Booster)</strong>
                        <span className="text-[10px] text-[var(--text-muted)]">Administered: {selectedAnimal.lastVaccinationDate}</span>
                      </div>
                      <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                        Due: {selectedAnimal.nextVaccinationDue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[var(--border-subtle)]">
                      <div>
                        <strong className="block text-[var(--text-main)]">HS (Hemorrhagic Septicemia Vaccine)</strong>
                        <span className="text-[10px] text-[var(--text-muted)]">Administered: 2026-03-10</span>
                      </div>
                      <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                        Protected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Production */}
            {profileTab === 'production' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-3">
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Milk className="h-4 w-4 text-emerald-600" /> 7-Day Daily Milk Production &amp; Fat % Log
                  </h3>

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="rounded-xl bg-white p-2 border border-[var(--border-subtle)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">{day}</span>
                        <strong className="text-xs font-bold text-emerald-800">{(14.5 + idx * 0.4).toFixed(1)}L</strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2 text-[11px] text-[var(--text-muted)]">
                    <span>Average Daily Milk: <strong className="text-[var(--text-main)]">15.8 L/day</strong></span>
                    <span>Milk Fat Content: <strong className="text-emerald-700 font-bold">7.6% (Premium)</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Nutrition */}
            {profileTab === 'nutrition' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                  <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">Personalized Daily Ration Chart</h3>
                  <ul className="space-y-1.5 text-emerald-900">
                    <li>• Green Fodder (Berseem/Lucerne): <strong>22 kg/day</strong></li>
                    <li>• Dry Straw (Wheat Bhusa): <strong>8 kg/day</strong></li>
                    <li>• Balanced Concentrate Mash: <strong>6.5 kg/day</strong></li>
                    <li>• Mineral Mixture + Salt: <strong>50g daily</strong></li>
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                onOpenAssistant(`What is the recommended health check protocol for ${selectedAnimal.breed} (${selectedAnimal.tagNumber})?`);
                setSelectedAnimal(null);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
            >
              <Sparkles className="h-4 w-4" /> Ask AI Vet Specialist
            </button>
          </div>
        </div>
      )}

      {/* Add Animal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">Register New Animal Tag</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Tag Number</label>
                  <input
                    type="text"
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Animal Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AnimalType)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  >
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Chicken">Chicken</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Breed Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sahiwal, Murrah, Barbari..."
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Age (Months)</label>
                  <input
                    type="number"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Notes / Milk Yield</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
              >
                Register Animal Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
