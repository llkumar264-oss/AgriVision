'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sprout, CheckSquare, Bell, ShieldAlert, UserCheck, X } from 'lucide-react';
import { CropItem, LivestockAnimal, FarmTask, AdvisoryItem } from '@/types/schema';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  crops: CropItem[];
  livestock: LivestockAnimal[];
  tasks: FarmTask[];
  advisories: AdvisoryItem[];
  onSelectResult: (type: string, id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  crops,
  livestock,
  tasks,
  advisories,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCrops = crops.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.variety.toLowerCase().includes(query.toLowerCase()));
  const filteredLivestock = livestock.filter(l => l.tagNumber.toLowerCase().includes(query.toLowerCase()) || l.type.toLowerCase().includes(query.toLowerCase()));
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredAdvisories = advisories.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-xs px-4">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-[var(--border-subtle)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--text-muted)] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search crops, livestock, tasks, advisories..."
            className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {/* Crops */}
          {filteredCrops.length > 0 && (
            <div className="py-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5" /> Crops ({filteredCrops.length})
              </div>
              {filteredCrops.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onSelectResult('crop', c.id); onClose(); }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                >
                  <span className="font-medium">{c.name} ({c.variety})</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Health: {c.healthScore}%</span>
                </button>
              ))}
            </div>
          )}

          {/* Livestock */}
          {filteredLivestock.length > 0 && (
            <div className="py-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Livestock ({filteredLivestock.length})
              </div>
              {filteredLivestock.map(l => (
                <button
                  key={l.id}
                  onClick={() => { onSelectResult('livestock', l.id); onClose(); }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                >
                  <span className="font-medium">{l.type} - Tag {l.tagNumber}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{l.weightKg} kg</span>
                </button>
              ))}
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="py-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5" /> Farm Tasks ({filteredTasks.length})
              </div>
              {filteredTasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onSelectResult('task', t.id); onClose(); }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                >
                  <span className="font-medium truncate max-w-sm">{t.title}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    t.priority === 'High' ? 'bg-[var(--critical-bg)] text-[var(--critical-red)]' : 'bg-[var(--bg-app)] text-[var(--text-muted)]'
                  }`}>{t.priority}</span>
                </button>
              ))}
            </div>
          )}

          {/* Advisories */}
          {filteredAdvisories.length > 0 && (
            <div className="py-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> AI Advisories ({filteredAdvisories.length})
              </div>
              {filteredAdvisories.map(a => (
                <button
                  key={a.id}
                  onClick={() => { onSelectResult('advisory', a.id); onClose(); }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                >
                  <span className="font-medium truncate max-w-sm">{a.title}</span>
                  <span className="text-[10px] font-bold text-[var(--warning-amber)]">{a.priority}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
