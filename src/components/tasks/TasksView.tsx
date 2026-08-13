'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { FarmTask } from '@/types/schema';

interface TasksViewProps {
  tasks: FarmTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, desc: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<'All' | 'Todo' | 'Completed'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const filteredTasks = filter === 'All'
    ? tasks
    : tasks.filter(t => t.status === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddTask(title, desc);
    setShowAddModal(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Farm Task Center</h1>
          <p className="text-xs text-[var(--text-muted)]">Actionable agronomic schedules, disease spray assignments & farm maintenance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
        >
          <Plus className="h-4 w-4" /> Create New Task
        </button>
      </div>

      <div className="flex items-center gap-2">
        {(['All', 'Todo', 'Completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              filter === f
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'bg-[var(--surface-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            onClick={() => onToggleTask(t.id)}
            className={`flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs cursor-pointer transition hover:border-[var(--border-strong)] ${
              t.status === 'Completed' ? 'opacity-65' : ''
            }`}
          >
            <div className="flex items-center gap-3.5">
              <button className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                t.status === 'Completed'
                  ? 'border-[var(--primary-agri)] bg-[var(--primary-agri)] text-white'
                  : 'border-[var(--border-strong)] bg-[var(--bg-app)]'
              }`}>
                {t.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>
              <div>
                <h3 className={`font-bold text-xs ${t.status === 'Completed' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                  {t.title}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{t.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                t.priority === 'High' ? 'bg-[var(--critical-bg)] text-[var(--critical-red)]' : 'bg-[var(--bg-app)] text-[var(--text-muted)]'
              }`}>
                {t.priority} Priority
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)]">Due {t.dueDate}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Create Farm Task</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Apply Fungicide Spray on Tomato"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Instructions..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
