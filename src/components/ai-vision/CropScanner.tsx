'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, 
  RotateCcw, Save, CheckSquare, History, MessageSquareText, 
  Eye, Layers, Flame, Sliders, ShieldAlert, ArrowRight, Loader2
} from 'lucide-react';
import { CropItem, DiseaseScanResult } from '@/types/schema';

interface CropScannerProps {
  crops: CropItem[];
  onSaveScan: (scan: DiseaseScanResult) => void;
  onAddTask: (taskTitle: string, description: string) => void;
  onOpenAssistant: (query: string) => void;
}

export const CropScanner: React.FC<CropScannerProps> = ({
  crops,
  onSaveScan,
  onAddTask,
  onOpenAssistant,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<DiseaseScanResult | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'overlay' | 'heatmap' | 'severity' | 'comparison'>('overlay');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPPORTED_CROPS = [
    'Tomato', 'Potato', 'Onion', 'Chilli', 'Brinjal', 'Okra', 
    'Cabbage', 'Cauliflower', 'Spinach', 'Pea', 'Carrot', 
    'Cucumber', 'Bottle Gourd', 'Bitter Gourd', 'Pumpkin', 
    'Beans', 'Corn', 'Rice', 'Wheat', 'Mustard', 'Cotton'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiAnalysis = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          cropName: selectedCrop,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const data = json.data;
        const newResult: DiseaseScanResult = {
          id: `scan-${Date.now()}`,
          farmId: 'farm-1',
          cropId: crops.find((c) => c.name === selectedCrop)?.id || 'crop-1',
          cropName: data.crop || selectedCrop,
          imageUrl: imagePreview,
          timestamp: new Date().toISOString(),
          condition: data.condition,
          confidence: data.confidence,
          severity: data.severity,
          affectedAreaPercent: data.affectedAreaPercent,
          riskLevel: data.riskLevel,
          visibleSymptoms: data.visibleSymptoms,
          recommendations: data.recommendations,
          followUpDays: data.followUpDays,
          scanMode: viewMode,
        };
        setScanResult(newResult);
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleImage = () => {
    const sample = 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
    setImagePreview(sample);
    setScanResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[var(--primary-agri-light)] px-2 py-0.5 text-xs font-bold text-[var(--primary-agri)]">
              Multimodal Vision AI
            </span>
            <span className="text-xs text-[var(--text-muted)]">Gemini 1.5 Flash Vision</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-[var(--text-main)]">AI Crop Scanner & Pathologist</h1>
          <p className="text-xs text-[var(--text-muted)]">Upload or capture leaf photos for instant diagnostic scanning, severity mapping, and treatment plans.</p>
        </div>
        <button
          onClick={loadSampleImage}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
        >
          <Sparkles className="h-4 w-4 text-[var(--primary-agri)]" /> Load Sample Leaf
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Upload & Camera Workspace */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-2">Select Target Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)] mb-4"
            >
              {SUPPORTED_CROPS.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-app)] p-6 text-center cursor-pointer transition hover:border-[var(--primary-agri)] hover:bg-[var(--primary-agri-light)]/20 min-h-[260px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full h-56 rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                  <img src={imagePreview} alt="Crop sample" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setScanResult(null);
                    }}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-agri-light)] text-[var(--primary-agri)]">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-main)] block">Drop leaf photo here or click to browse</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Supports JPG, PNG, WEBP up to 10MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Trigger Button */}
            <button
              disabled={!imagePreview || isAnalyzing}
              onClick={runAiAnalysis}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-agri-hover)] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Gemini Vision...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Run AI Pathology Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output & Interactive View Modes */}
        <div className="lg:col-span-7 space-y-4">
          {scanResult ? (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-5 animate-fade-in">
              {/* Top View Mode Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs font-bold text-[var(--text-main)]">Diagnostic Visual Modes</span>
                <div className="flex items-center gap-1 bg-[var(--bg-app)] p-1 rounded-xl border border-[var(--border-subtle)]">
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                      viewMode === 'original' ? 'bg-[var(--surface-card)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setViewMode('overlay')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                      viewMode === 'overlay' ? 'bg-[var(--primary-agri)] text-white shadow-xs' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    AI Overlay
                  </button>
                  <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                      viewMode === 'heatmap' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Heatmap
                  </button>
                  <button
                    onClick={() => setViewMode('severity')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                      viewMode === 'severity' ? 'bg-red-600 text-white shadow-xs' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Severity
                  </button>
                </div>
              </div>

              {/* Interactive Image Frame with Overlay Simulation */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-black/90">
                <img src={scanResult.imageUrl} alt="Analysis view" className="w-full h-full object-cover" />

                {/* Simulated Bounding Box for AI Overlay */}
                {viewMode === 'overlay' && (
                  <div className="absolute inset-x-12 top-10 bottom-12 border-2 border-dashed border-amber-400 bg-amber-500/15 rounded-lg flex items-start p-2">
                    <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm">
                      {scanResult.condition} ({Math.round(scanResult.confidence * 100)}%)
                    </span>
                  </div>
                )}

                {/* Simulated Heatmap Mask */}
                {viewMode === 'heatmap' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/40 via-red-600/50 to-transparent mix-blend-color-dodge pointer-events-none" />
                )}

                {/* Simulated High-Contrast Severity Mask */}
                {viewMode === 'severity' && (
                  <div className="absolute inset-0 bg-red-900/40 backdrop-contrast-150 pointer-events-none flex items-center justify-center">
                    <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                      Affected Area: {scanResult.affectedAreaPercent}% Leaf Surface
                    </span>
                  </div>
                )}
              </div>

              {/* Analysis Summary Card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Detected Condition</span>
                  <span className="font-bold text-xs text-[var(--text-main)] block truncate">{scanResult.condition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Confidence Score</span>
                  <span className="font-bold text-xs text-[var(--primary-agri)] block tabular-nums">
                    {Math.round(scanResult.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Severity Level</span>
                  <span className="font-bold text-xs text-[var(--warning-amber)] capitalize block">{scanResult.severity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Affected Area</span>
                  <span className="font-bold text-xs text-[var(--critical-red)] block tabular-nums">{scanResult.affectedAreaPercent}%</span>
                </div>
              </div>

              {/* Confidence System Warning Banner */}
              {scanResult.confidence < 0.8 && (
                <div className="flex items-center gap-2.5 rounded-xl border border-[var(--warning-amber)]/40 bg-[var(--warning-bg)] p-3 text-xs text-[var(--warning-amber)]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Possible condition — confidence is {Math.round(scanResult.confidence * 100)}%. Verify with an additional angle photo.</span>
                </div>
              )}

              {/* Visible Symptoms & Treatment Recommendations */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-[var(--text-main)] mb-1.5">Observed Pathological Symptoms</h4>
                  <ul className="space-y-1">
                    {scanResult.visibleSymptoms.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-muted)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-agri)] mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <h4 className="font-bold text-[var(--text-main)] mb-1.5">Agronomic Recommendation Plan</h4>
                  <ul className="space-y-1">
                    {scanResult.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-main)] font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--primary-agri)] mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => onSaveScan(scanResult)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save Record
                </button>
                <button
                  onClick={() => onAddTask(`Apply Spray for ${scanResult.condition}`, scanResult.recommendations[0] || 'Inspect field')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                >
                  <CheckSquare className="h-3.5 w-3.5" /> Add Task
                </button>
                <button
                  onClick={() => onOpenAssistant(`Why did my ${scanResult.cropName} develop ${scanResult.condition}?`)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                >
                  <MessageSquareText className="h-3.5 w-3.5 text-[var(--primary-agri)]" /> Ask AI
                </button>
                <button
                  onClick={() => { setScanResult(null); setImagePreview(null); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Scan Again
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 text-center text-[var(--text-muted)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] mb-3">
                <Sparkles className="h-7 w-7 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Awaiting Image Upload</h3>
              <p className="text-xs max-w-sm mt-1">Select a crop type on the left and upload or capture a leaf photo to trigger Gemini Multimodal AI vision analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
