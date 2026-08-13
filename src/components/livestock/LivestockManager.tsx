'use client';

import React, { useState } from 'react';
import { UserCheck, HeartPulse, Plus, Syringe, Scale, Calendar, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeAnimal, setActiveAnimal] = useState<LivestockAnimal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Animal Form state
  const [tagNumber, setTagNumber] = useState('');
  const [type, setType] = useState<AnimalType>('Cow');
  const [breed, setBreed] = useState('');
  const [weightKg, setWeightKg] = useState(400);

  const animalTypes = ['All', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Chicken'];

  const filteredAnimals = selectedType === 'All'
    ? livestock
    : livestock.filter(a => a.type.toLowerCase() === selectedType.toLowerCase());

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber || !breed) return;

    const newAnimal: LivestockAnimal = {
      id: `animal-${Date.now()}`,
      farmId: 'farm-1',
      tagNumber,
      type,
      breed,
      ageMonths: 24,
      weightKg,
      healthScore: 94,
      riskLevel: 'low',
      lastVaccinationDate: new Date().toISOString().split('T')[0],
      nextVaccinationDue: '2026-12-01',
      lastCheckDate: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80',
    };

    onAddAnimal(newAnimal);
    setShowAddModal(false);
    setTagNumber('');
    setBreed('');
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Livestock Observation & Health</h1>
          <p className="text-xs text-[var(--text-muted)]">Cattle, buffaloes, goats, sheep and poultry telemetry & AI visual observation</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
        >
          <Plus className="h-4 w-4" /> Add Animal Record
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {animalTypes.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition shrink-0 ${
              selectedType === t
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Livestock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAnimals.map((animal) => {
          const isVaccineDueSoon = new Date(animal.nextVaccinationDue) <= new Date('2026-08-25');
          return (
            <div
              key={animal.id}
              onClick={() => setActiveAnimal(animal)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs hover:border-[var(--border-strong)] hover:shadow-md cursor-pointer transition"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-[var(--bg-app)]">
                  <img
                    src={animal.imageUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80'}
                    alt={animal.tagNumber}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    Tag: {animal.tagNumber}
                  </span>
                  <span className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-black/80 px-2 py-0.5 text-[10px] font-extrabold text-[var(--primary-agri)] tabular-nums shadow-xs">
                    {animal.healthScore}% Health
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text-main)]">{animal.type} ({animal.breed})</h3>
                  <span className="text-xs font-semibold text-[var(--text-muted)] tabular-nums">{animal.weightKg} kg</span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-medium text-[var(--text-main)]">{animal.ageMonths} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Vaccine:</span>
                    <span className={`font-medium ${isVaccineDueSoon ? 'text-[var(--warning-amber)] font-bold' : 'text-[var(--text-main)]'}`}>
                      {animal.nextVaccinationDue}
                    </span>
                  </div>
                </div>
              </div>

              {isVaccineDueSoon && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--warning-bg)] p-2 text-[10px] font-bold text-[var(--warning-amber)]">
                  <Syringe className="h-3.5 w-3.5 shrink-0" /> Vaccination Due Soon
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Animal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Add Livestock Animal Record</h3>
            <form onSubmit={handleCreateAnimal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Tag Number</label>
                <input
                  type="text"
                  placeholder="e.g. IND-RJ-505"
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Animal Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AnimalType)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  >
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Chicken">Chicken</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Breed Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Gir / Sahiwal"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
