'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, CheckCircle2, ArrowRight, X, Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: '1. Live Farm Telemetry Dashboard',
      desc: 'Overall health score computed at 87/100 across crops, soil moisture, livestock and active disease risk.',
      tab: 'overview',
    },
    {
      title: '2. Farm Digital Twin Map',
      desc: 'Interactive SVG operating map. Clicking North Field shows 42% soil moisture & Early Blight disease alert.',
      tab: 'twin',
    },
    {
      title: '3. Multimodal AI Crop Scanner',
      desc: 'Uploading leaf photo triggers Gemini 1.5 Flash Vision. Early Blight detected at 94% confidence.',
      tab: 'vision',
    },
    {
      title: '4. AI Severity & Heatmap Analysis',
      desc: 'Affected leaf area evaluated at 29%. Fungal sporulation intensity highlighted in high-contrast severity mode.',
      tab: 'vision',
    },
    {
      title: '5. Synthesized Priority Advisory',
      desc: 'Weather humidity (82%) correlated with leaf infection. Immediate Copper Oxychloride spray recommended.',
      tab: 'advisory',
    },
    {
      title: '6. Task & Timeline Auto-Generation',
      desc: 'Fungicide spray task auto-scheduled for Rajesh Kumar and logged in real-time chronological timeline.',
      tab: 'tasks',
    },
    {
      title: '7. Context-Aware Agri Assistant',
      desc: 'Asking AI assistant retrieves exact live farm metrics and asks for explicit confirmation before task execution.',
      tab: 'assistant',
    },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setDemoStep((prev) => {
          const next = prev + 1;
          if (next < steps.length) {
            onNavigateTab(steps[next].tab);
            return next;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, steps, onNavigateTab]);

  if (!isOpen) return null;

  const current = steps[demoStep];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border-2 border-[var(--primary-agri)] bg-[var(--surface-card)] p-5 shadow-2xl animate-fade-in space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[var(--primary-agri)]" />
          <span className="font-bold text-xs text-[var(--text-main)]">AgriVision 20-Second Guided Tour</span>
        </div>
        <button onClick={onClose} className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase text-[var(--primary-agri)] tracking-wider">
          Step {demoStep + 1} of {steps.length}
        </span>
        <h4 className="font-bold text-xs text-[var(--text-main)]">{current.title}</h4>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{current.desc}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying && demoStep === steps.length - 1) setDemoStep(0);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--primary-agri)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
        >
          {isPlaying ? 'Pause Demo' : <><Play className="h-3.5 w-3.5" /> Start Auto Tour</>}
        </button>

        <div className="flex gap-1">
          <button
            disabled={demoStep === 0}
            onClick={() => {
              const prev = Math.max(0, demoStep - 1);
              setDemoStep(prev);
              onNavigateTab(steps[prev].tab);
            }}
            className="rounded border border-[var(--border-subtle)] p-1 text-xs text-[var(--text-muted)] disabled:opacity-30"
          >
            ←
          </button>
          <button
            disabled={demoStep === steps.length - 1}
            onClick={() => {
              const next = Math.min(steps.length - 1, demoStep + 1);
              setDemoStep(next);
              onNavigateTab(steps[next].tab);
            }}
            className="rounded border border-[var(--border-subtle)] p-1 text-xs text-[var(--text-muted)] disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
