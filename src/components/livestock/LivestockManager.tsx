'use client';

import React, { useState } from 'react';
import { 
  UserCheck, Plus, Search, AlertCircle, CheckCircle2, 
  Activity, Calendar, ShieldCheck, Heart, Sparkles, X, ChevronRight, 
  Scale, Milk, Stethoscope, Droplet, Thermometer, TrendingUp, DollarSign,
  FileSpreadsheet, Award, Info, AlertTriangle, Syringe
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
  const [showLogMilkModal, setShowLogMilkModal] = useState<LivestockAnimal | null>(null);
  const [showVetCheckModal, setShowVetCheckModal] = useState<LivestockAnimal | null>(null);
  const [showSymptomCheckerModal, setShowSymptomCheckerModal] = useState<LivestockAnimal | null>(null);
  
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileTab, setProfileTab] = useState<'overview' | 'health' | 'production' | 'nutrition' | 'vet'>('overview');

  // Ration Calculator State
  const [calcWeightKg, setCalcWeightKg] = useState<number>(460);
  const [calcMilkYieldL, setCalcMilkYieldL] = useState<number>(18);

  // Milk Log State
  const [morningMilk, setMorningMilk] = useState<number>(9.5);
  const [eveningMilk, setEveningMilk] = useState<number>(8.5);
  const [milkFat, setMilkFat] = useState<number>(7.6);
  const [milkSuccessMsg, setMilkSuccessMsg] = useState('');

  // Vet Log State
  const [vaccineName, setVaccineName] = useState('FMD (Foot & Mouth Disease)');
  const [vetNotes, setVetNotes] = useState('Routine 6-month booster administered. Normal body temp.');

  // Symptom Checker State
  const [selectedSymptom, setSelectedSymptom] = useState('Fever & Loss of Appetite');
  const [symptomResult, setSymptomResult] = useState<any>(null);

  // Form State for Add Animal
  const [tagNumber, setTagNumber] = useState('IND-RJ-108');
  const [type, setType] = useState<AnimalType>('Cow');
  const [breed, setBreed] = useState('Sahiwal Pure Breed');
  const [ageMonths, setAgeMonths] = useState(32);
  const [weightKg, setWeightKg] = useState(450);
  const [notes, setNotes] = useState('High milk yield producer, A2 milk grade, high heat tolerance.');

  const animalTypes = ['All', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Chicken'];

  const filteredLivestock = livestock.filter(a => {
    const matchesType = selectedType === 'All' || a.type === selectedType;
    const matchesSearch = a.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate Herd Stats
  const totalAnimals = livestock.length;
  const totalDailyMilk = livestock.reduce((acc, curr) => acc + (curr.type === 'Cow' ? 16 : curr.type === 'Buffalo' ? 19 : 2), 0);
  const avgHealthScore = Math.round(livestock.reduce((acc, curr) => acc + curr.healthScore, 0) / (totalAnimals || 1));
  const dueVaccinesCount = livestock.filter(a => a.riskLevel === 'medium' || a.riskLevel === 'high').length;
  const estimatedDailyRevenue = Math.round(totalDailyMilk * 55); // ₹55/L average

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
      healthScore: 96,
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

  const handleSaveMilkLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLogMilkModal) return;
    const total = morningMilk + eveningMilk;
    setMilkSuccessMsg(`Logged ${total} Liters (${morningMilk}L morning + ${eveningMilk}L evening) at ${milkFat}% Fat for Tag #${showLogMilkModal.tagNumber}!`);
    setTimeout(() => {
      setMilkSuccessMsg('');
      setShowLogMilkModal(null);
    }, 2000);
  };

  const handleRunSymptomChecker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSymptomCheckerModal) return;
    if (selectedSymptom.includes('Fever')) {
      setSymptomResult({
        condition: 'Suspected Bovine Ephemeral Fever / Milk Fever',
        severity: 'Moderate Risk',
        action: 'Administer Meloxicam 15ml IM + Calcium Borogluconate 450ml IV. Provide shade & clean drinking water.',
        medicine: 'Meloxicam Injection (15ml), Vet Calcium Gel',
      });
    } else if (selectedSymptom.includes('Mastitis') || selectedSymptom.includes('Udder')) {
      setSymptomResult({
        condition: 'Sub-Clinical Mastitis (Udder Swelling)',
        severity: 'High Priority',
        action: 'Foliar udder wash with Potassium Permanganate. Administer Ceftiofur Sodium Intramammary infusion.',
        medicine: 'Pendistrin SH Ointment, Ceftiofur Injection',
      });
    } else {
      setSymptomResult({
        condition: 'Digestive Bloat / Rumen Acidosis',
        severity: 'Low-Moderate Risk',
        action: 'Administer Bloatosil / Turpentine oil 100ml orally. Avoid lush wet clover fodder for 24 hours.',
        medicine: 'Afanil Liquid (100ml), Sodium Bicarbonate',
      });
    }
  };

  // Ration Formula
  const greenFodderKg = Math.round(calcWeightKg * 0.05);
  const dryFodderKg = Math.round(calcWeightKg * 0.02);
  const concentrateKg = (1.5 + calcMilkYieldL * 0.4).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* FLAGSHIP USP HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 backdrop-blur-md border border-amber-400/30">
                <Award className="h-4 w-4 text-amber-300" /> AgriVision Core USP
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
                AI Animal Husbandry &amp; Dairy Intelligence Suite
              </span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-black text-emerald-950 shadow-lg hover:bg-amber-300 transition transform active:scale-95 shrink-0"
            >
              <Plus className="h-4 w-4" /> Register Animal Tag
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Smart Dairy &amp; Livestock Management</h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1">
              Full digital passport tracking, A2 milk yield analytics, genetic pedigree, real-time vital gauges, AI veterinary diagnosis &amp; feed ration calculators.
            </p>
          </div>

          {/* HERD REAL-TIME STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
                <span>Total Herd Animals</span>
                <UserCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <span className="text-2xl font-black text-white mt-1 block">{totalAnimals} Animals</span>
              <span className="text-[10px] text-emerald-300 font-medium">100% Tagged &amp; Tracked</span>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
                <span>Daily Milk Production</span>
                <Milk className="h-4 w-4 text-blue-300" />
              </div>
              <span className="text-2xl font-black text-white mt-1 block">{totalDailyMilk} L/day</span>
              <span className="text-[10px] text-blue-200 font-medium">Est. ₹{estimatedDailyRevenue}/day revenue</span>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
                <span>Herd Health Score</span>
                <Heart className="h-4 w-4 text-red-300" />
              </div>
              <span className="text-2xl font-black text-white mt-1 block">{avgHealthScore}/100</span>
              <span className="text-[10px] text-emerald-300 font-medium">Optimal Herd Health</span>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
                <span>Vaccination Boosters</span>
                <Syringe className="h-4 w-4 text-amber-300" />
              </div>
              <span className="text-2xl font-black text-amber-300 mt-1 block">{dueVaccinesCount} Pending</span>
              <span className="text-[10px] text-amber-200 font-medium">FMD &amp; HS Boosters</span>
            </div>
          </div>
        </div>
      </div>

      {/* RATION CALCULATOR BAR */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-700" /> AI Livestock Daily Ration &amp; Nutrition Calculator
            </h3>
            <p className="text-xs text-emerald-800">Compute precise dry fodder, green fodder, and concentrate mash based on animal body weight &amp; milk yield</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl shrink-0">Balanced Feed Formula</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-emerald-900 mb-1">Animal Weight (kg)</label>
            <input
              type="number"
              value={calcWeightKg}
              onChange={(e) => setCalcWeightKg(Number(e.target.value))}
              className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-900 mb-1">Daily Milk (Liters)</label>
            <input
              type="number"
              value={calcMilkYieldL}
              onChange={(e) => setCalcMilkYieldL(Number(e.target.value))}
              className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-2 rounded-2xl bg-white p-3.5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-xs">
            <div>
              <span className="text-[10px] text-emerald-700 block font-semibold uppercase tracking-wider">Recommended Ration</span>
              <p className="font-extrabold text-emerald-950 mt-0.5">
                Green Fodder: {greenFodderKg}kg • Dry Fodder: {dryFodderKg}kg • Concentrate: {concentrateKg}kg
              </p>
            </div>
            <button
              onClick={() => onOpenAssistant(`How can I optimize cattle feed ration for a ${calcWeightKg}kg animal producing ${calcMilkYieldL}L milk daily?`)}
              className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shrink-0 shadow-xs"
            >
              Ask AI Dietitian
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {animalTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
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
            placeholder="Search tag #, breed, animal type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          />
        </div>
      </div>

      {/* ANIMAL CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLivestock.map((animal) => (
          <div
            key={animal.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--primary-agri)] hover:shadow-lg transition duration-300"
          >
            <div className="space-y-3">
              {/* Photo & Badges */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[var(--bg-app)]">
                <img
                  src={animal.imageUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80'}
                  alt={animal.tagNumber}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md">
                    Tag: {animal.tagNumber}
                  </span>
                  <span className="rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md">
                    {animal.type}
                  </span>
                </div>

                <span className={`absolute bottom-2 right-2 rounded-xl px-3 py-1 text-[10px] font-black backdrop-blur-md shadow-xs ${
                  animal.riskLevel === 'medium' || animal.riskLevel === 'high'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-emerald-600/90 text-white'
                }`}>
                  Health {animal.healthScore}/100
                </span>
              </div>

              {/* Title & Breed */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[var(--text-main)] group-hover:text-[var(--primary-agri)] transition">
                    {animal.breed}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    A2 Grade
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 font-medium">
                  {animal.notes}
                </p>
              </div>

              {/* Vitals Summary */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="rounded-xl bg-[var(--bg-app)] p-2 border border-[var(--border-subtle)] text-center">
                  <span className="text-[9px] text-[var(--text-muted)] block font-medium">Weight</span>
                  <strong className="text-[var(--text-main)] font-extrabold">{animal.weightKg} kg</strong>
                </div>
                <div className="rounded-xl bg-[var(--bg-app)] p-2 border border-[var(--border-subtle)] text-center">
                  <span className="text-[9px] text-[var(--text-muted)] block font-medium">Daily Milk</span>
                  <strong className="text-emerald-700 font-extrabold">{animal.type === 'Cow' ? '16.5L' : animal.type === 'Buffalo' ? '19.0L' : '2.5L'}</strong>
                </div>
                <div className="rounded-xl bg-[var(--bg-app)] p-2 border border-[var(--border-subtle)] text-center">
                  <span className="text-[9px] text-[var(--text-muted)] block font-medium">Booster</span>
                  <strong className="text-amber-700 font-extrabold">{animal.nextVaccinationDue}</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Button Grid */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setShowLogMilkModal(animal)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-blue-50 border border-blue-200 py-1.5 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition"
                  title="Log Milk Yield"
                >
                  <Milk className="h-3.5 w-3.5 text-blue-600" /> Milk Log
                </button>

                <button
                  onClick={() => setShowVetCheckModal(animal)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-purple-50 border border-purple-200 py-1.5 text-[11px] font-bold text-purple-800 hover:bg-purple-100 transition"
                  title="Log Vet Check"
                >
                  <Syringe className="h-3.5 w-3.5 text-purple-600" /> Vaccine
                </button>

                <button
                  onClick={() => setShowSymptomCheckerModal(animal)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-amber-50 border border-amber-200 py-1.5 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition"
                  title="AI Symptom Checker"
                >
                  <Stethoscope className="h-3.5 w-3.5 text-amber-600" /> AI Vet
                </button>
              </div>

              <button
                onClick={() => { setSelectedAnimal(animal); setProfileTab('overview'); }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
              >
                Open Full Passport &amp; History <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── STUNNING ANIMAL PROFILE MODAL (5 TABS) ─────────────────────────── */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header Banner */}
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedAnimal.imageUrl} alt={selectedAnimal.tagNumber} className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm" />
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Digital Animal Passport #{selectedAnimal.tagNumber}</span>
                  <h2 className="text-lg font-black text-[var(--text-main)]">{selectedAnimal.breed} ({selectedAnimal.type})</h2>
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
                Milk Yield &amp; Revenue
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
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Health Score</span>
                    <span className="text-base font-black text-emerald-700">{selectedAnimal.healthScore} / 100</span>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Body Weight</span>
                    <span className="text-base font-black text-[var(--text-main)]">{selectedAnimal.weightKg} kg</span>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Lactation Stage</span>
                    <span className="text-xs font-extrabold text-emerald-800">Peak (Lactation 2)</span>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium block">Milk Quality Grade</span>
                    <span className="text-xs font-extrabold uppercase text-amber-700">A2 Premium</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 space-y-2 text-xs">
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">Agronomist Notes &amp; Breed Characteristics</h3>
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
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--border-subtle)]">
                      <div>
                        <strong className="block text-[var(--text-main)]">FMD (Foot &amp; Mouth Disease Booster)</strong>
                        <span className="text-[10px] text-[var(--text-muted)]">Administered: {selectedAnimal.lastVaccinationDate}</span>
                      </div>
                      <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                        Due: {selectedAnimal.nextVaccinationDue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--border-subtle)]">
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
                    <Milk className="h-4 w-4 text-blue-600" /> 7-Day Daily Milk Production &amp; Revenue Log
                  </h3>

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="rounded-xl bg-white p-2 border border-[var(--border-subtle)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">{day}</span>
                        <strong className="text-xs font-bold text-emerald-800">{(16.0 + idx * 0.4).toFixed(1)}L</strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2 text-[11px] text-[var(--text-muted)]">
                    <span>Average Daily Milk: <strong className="text-[var(--text-main)]">17.2 L/day</strong></span>
                    <span>Milk Fat Content: <strong className="text-emerald-700 font-bold">7.8% (Premium)</strong></span>
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
                    <li>• Green Fodder (Berseem/Lucerne): <strong>23 kg/day</strong></li>
                    <li>• Dry Straw (Wheat Bhusa): <strong>9 kg/day</strong></li>
                    <li>• Balanced Concentrate Mash: <strong>7.5 kg/day</strong></li>
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

      {/* ── LOG MILK MODAL ──────────────────────────────────────────────────── */}
      {showLogMilkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">Log Daily Milk Yield - Tag #{showLogMilkModal.tagNumber}</h2>
              <button onClick={() => setShowLogMilkModal(null)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {milkSuccessMsg ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-900 text-center animate-bounce">
                ✅ {milkSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSaveMilkLog} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--text-main)] mb-1">Morning Milk (Liters)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={morningMilk}
                      onChange={(e) => setMorningMilk(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-main)] mb-1">Evening Milk (Liters)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={eveningMilk}
                      onChange={(e) => setEveningMilk(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Milk Fat % (Fat Grade)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={milkFat}
                    onChange={(e) => setMilkFat(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Save Daily Milk Log
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── AI SYMPTOM CHECKER MODAL ────────────────────────────────────────── */}
      {showSymptomCheckerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">AI Vet Symptom Checker - Tag #{showSymptomCheckerModal.tagNumber}</h2>
              <button onClick={() => { setShowSymptomCheckerModal(null); setSymptomResult(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRunSymptomChecker} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Select Observed Symptom</label>
                <select
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                >
                  <option value="Fever & Loss of Appetite">Fever &amp; Loss of Appetite</option>
                  <option value="Udder Swelling / Mastitis">Udder Swelling / Mastitis</option>
                  <option value="Rumen Bloat / Digestive Gas">Rumen Bloat / Digestive Gas</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-amber-600 transition"
              >
                Diagnose with AI Vet
              </button>

              {symptomResult && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2 text-amber-950">
                  <strong className="block text-sm font-black text-amber-900">{symptomResult.condition}</strong>
                  <span className="inline-block rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    {symptomResult.severity}
                  </span>
                  <p className="text-xs">{symptomResult.action}</p>
                  <p className="text-[11px] font-bold text-amber-900 pt-1">Recommended Medicines: {symptomResult.medicine}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── ADD ANIMAL MODAL ────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-main)]">Register New Animal Tag Profile</h2>
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
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Animal Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AnimalType)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
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
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
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
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">Notes / Temperament</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-agri)]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-extrabold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
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
