'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, 
  RotateCcw, Save, CheckSquare, MessageSquareText, 
  Layers, Sliders, ArrowRight, Loader2, Gauge, Scale, Sun, Calendar, Info, RefreshCw, Eye,
  Search, ShieldAlert, Check
} from 'lucide-react';
import { CropItem, DiseaseScanResult, CropMaturityScanResult, MaturityBoundingBox } from '@/types/schema';
import { AgriImage } from '@/components/ui/AgriImage';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { WHEAT_RUST_DATABASE, WheatRustEntry, lookupWheatRustSample } from '@/lib/wheat-rust-dataset';

interface CropScannerProps {
  crops: CropItem[];
  onSaveScan: (scan: DiseaseScanResult) => void;
  onAddTask: (taskTitle: string, description: string) => void;
  onOpenAssistant: (query: string) => void;
}

interface BenchmarkSample {
  cropName: string;
  variety: string;
  stageName: string;
  imageUrl: string;
  description: string;
}

const BENCHMARK_SAMPLES: BenchmarkSample[] = [
  {
    cropName: 'Tomato',
    variety: 'Pusa Ruby Hybrid',
    stageName: 'Multi-Stage Vine Cluster',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=85',
    description: 'Greenhouse trellis cluster with simultaneous red-ripe, breaker, and green immature fruits.',
  },
  {
    cropName: 'Wheat',
    variety: 'HD-2967 Sharbati',
    stageName: 'Golden Mature Harvest Ready',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85',
    description: 'Golden yellow panicles at 13% grain moisture. Optimal for combine harvesting.',
  },
  {
    cropName: 'Basmati Rice',
    variety: 'Pusa Basmati 1121',
    stageName: 'Late Dough Panicle Ripening',
    imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1200&q=85',
    description: '85% panicle turning yellow. Terminal drainage recommended for uniform grain hardiness.',
  },
  {
    cropName: 'Maize (Corn)',
    variety: 'Rajkumar Hybrid',
    stageName: 'Dent & Black Layer Maturity',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=85',
    description: 'Brown dry silk and hardened starch crown indicating physiological harvest readiness.',
  },
  {
    cropName: 'Cotton',
    variety: 'BT Cotton Bollgard II',
    stageName: '90% Boll Cracking Harvest Stage',
    imageUrl: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=1200&q=85',
    description: 'Fluffy white lint bolls fully burst under dry sunny conditions.',
  },
  {
    cropName: 'Chilli',
    variety: 'G-4 Hot Red',
    stageName: 'Deep Red Ripe Stage',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=85',
    description: 'Capsaicin and carotenoid concentration peak reached. Ready for primary market picking.',
  },
];

const SUPPORTED_CROPS = [
  'Tomato', 'Wheat', 'Basmati Rice', 'Maize (Corn)', 'Cotton', 'Chilli',
  'Potato', 'Mustard (Sarson)', 'Sugarcane', 'Soybean', 'Chickpea (Chana)'
];

export const CropScanner: React.FC<CropScannerProps> = ({
  crops,
  onSaveScan,
  onAddTask,
  onOpenAssistant,
}) => {
  const { t, language } = useLanguage();
  const [scanTab, setScanTab] = useState<'maturity' | 'pathology' | 'wheat_rust'>('maturity');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [imagePreview, setImagePreview] = useState<string>(BENCHMARK_SAMPLES[0].imageUrl);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);

  // Results State
  const [maturityResult, setMaturityResult] = useState<CropMaturityScanResult | null>(null);
  const [pathologyResult, setPathologyResult] = useState<DiseaseScanResult | null>(null);
  const [pathologyViewMode, setPathologyViewMode] = useState<'original' | 'overlay' | 'heatmap' | 'severity'>('overlay');

  // Wheat Rust Dataset Benchmark State
  const [wheatSearchId, setWheatSearchId] = useState<string>('643083');
  const [selectedWheatEntry, setSelectedWheatEntry] = useState<WheatRustEntry | null>(WHEAT_RUST_DATABASE[0]);

  // Live Camera State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-run analysis when initial sample is loaded
  useEffect(() => {
    runMaturityScan(BENCHMARK_SAMPLES[0].imageUrl, 'Tomato');
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setMaturityResult(null);
        setPathologyResult(null);
        if (scanTab === 'maturity') {
          runMaturityScan(dataUrl, selectedCrop);
        } else if (scanTab === 'pathology') {
          runPathologyScan(dataUrl, selectedCrop);
        }
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
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setMaturityResult(null);
        setPathologyResult(null);
        if (scanTab === 'maturity') {
          runMaturityScan(dataUrl, selectedCrop);
        } else if (scanTab === 'pathology') {
          runPathologyScan(dataUrl, selectedCrop);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Unable to access device camera. Please upload an image instead.');
      setCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImagePreview(dataUrl);
        stopCamera();
        if (scanTab === 'maturity') {
          runMaturityScan(dataUrl, selectedCrop);
        } else {
          runPathologyScan(dataUrl, selectedCrop);
        }
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Trigger Maturity Analysis
  const runMaturityScan = async (imgData: string, cropName: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgData, cropName }),
      });
      const json = await res.json();
      if (json.success) {
        setMaturityResult(json.data);
      }
    } catch (err) {
      console.error('Maturity scan failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Pathology Diagnostic Scan
  const runPathologyScan = async (imgData: string, cropName: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgData, cropName }),
      });
      const json = await res.json();
      if (json.success) {
        setPathologyResult(json.data);
      }
    } catch (err) {
      console.error('Pathology scan failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: BenchmarkSample) => {
    setSelectedCrop(sample.cropName);
    setImagePreview(sample.imageUrl);
    setActiveBoxId(null);
    if (scanTab === 'maturity') {
      runMaturityScan(sample.imageUrl, sample.cropName);
    } else {
      runPathologyScan(sample.imageUrl, sample.cropName);
    }
  };

  const handleWheatLookup = (idToSearch: string) => {
    setWheatSearchId(idToSearch);
    const result = lookupWheatRustSample(idToSearch);
    setSelectedWheatEntry(result);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── TOP HEADER & DUAL/TRIPLE VISION MODE SELECTOR ────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" /> Precision Agricultural Vision Intelligence
          </div>
          <h1 className="text-xl font-black text-[var(--text-main)]">{t.aiVision.title}</h1>
          <p className="text-xs text-[var(--text-muted)]">{t.aiVision.subtitle}</p>
        </div>

        {/* 3 AI Vision Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[var(--bg-app)] p-1 rounded-2xl border border-[var(--border-subtle)] scrollbar-none">
          <button
            onClick={() => {
              setScanTab('maturity');
              if (imagePreview) runMaturityScan(imagePreview, selectedCrop);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              scanTab === 'maturity'
                ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Gauge className="h-4 w-4" /> {t.aiVision.maturityTab}
          </button>
          <button
            onClick={() => {
              setScanTab('pathology');
              if (imagePreview) runPathologyScan(imagePreview, selectedCrop);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              scanTab === 'pathology'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <ShieldAlert className="h-4 w-4" /> {t.aiVision.pathologyTab}
          </button>
          <button
            onClick={() => setScanTab('wheat_rust')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              scanTab === 'wheat_rust'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sparkles className="h-4 w-4" /> {t.aiVision.wheatRustTab}
          </button>
        </div>
      </div>

      {/* ── BENCHMARK DATASET GALLERY (When in Maturity or Pathology) ────────── */}
      {scanTab !== 'wheat_rust' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Multi-Crop Benchmark Datasets
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Click any sample to test live vision analysis</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BENCHMARK_SAMPLES.map((sample) => {
              const isSelected = selectedCrop === sample.cropName && imagePreview === sample.imageUrl;
              return (
                <button
                  key={sample.cropName}
                  onClick={() => handleSelectSample(sample)}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border text-left transition duration-200 ${
                    isSelected
                      ? 'border-[var(--primary-agri)] ring-2 ring-[var(--primary-agri)]/30 shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="relative h-20 w-full overflow-hidden bg-black/10">
                    <AgriImage
                      src={sample.imageUrl}
                      alt={sample.cropName}
                      fallbackType="crop"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                      {sample.cropName}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-[var(--text-main)] truncate">{sample.variety}</p>
                    <p className="text-[9px] text-[var(--text-muted)] truncate">{sample.stageName}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: WHEAT RUST DATASET BENCHMARK & DIAGNOSTICS ───────────────── */}
      {scanTab === 'wheat_rust' && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-4">
            
            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                  Wheat Rust AI Neural Classifier ({WHEAT_RUST_DATABASE.length} Dataset Samples)
                </span>
                <h2 className="text-base font-black text-[var(--text-main)]">
                  Dataset Sample Lookup &amp; Rust Pathology Index
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={wheatSearchId}
                    onChange={(e) => setWheatSearchId(e.target.value)}
                    placeholder="Enter Sample ID (e.g. 643083, 008FWT)..."
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] pl-9 pr-3 py-2 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={() => handleWheatLookup(wheatSearchId)}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition"
                >
                  Analyze ID
                </button>
              </div>
            </div>

            {/* Quick Sample ID Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase shrink-0">Try Sample IDs:</span>
              {['643083', '008FWT', '00AQXY', '01OJZX', '07OXKK', '085IEC', '08O2YE', '08WLJO', '0E1VTP', '0GJFRQ'].map((id) => (
                <button
                  key={id}
                  onClick={() => handleWheatLookup(id)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold whitespace-nowrap transition border ${
                    wheatSearchId === id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>

            {/* Result Report Card */}
            {selectedWheatEntry && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                      Sample ID: {selectedWheatEntry.id} • AI Pathology Classification
                    </span>
                    <h3 className="text-lg font-black text-[var(--text-main)] mt-0.5">
                      {selectedWheatEntry.condition}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                    selectedWheatEntry.condition.includes('Healthy')
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}>
                    {selectedWheatEntry.condition.includes('Healthy') ? 'Healthy Wheat' : 'Pathological Rust Detected'}
                  </span>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[var(--text-muted)]">Leaf Rust Probability</span>
                      <span className="text-amber-600 font-extrabold">{Math.round(selectedWheatEntry.leafRustScore * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div style={{ width: `${selectedWheatEntry.leafRustScore * 100}%` }} className="h-full bg-amber-500" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[var(--text-muted)]">Stem Rust Probability</span>
                      <span className="text-rose-600 font-extrabold">{Math.round(selectedWheatEntry.stemRustScore * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div style={{ width: `${selectedWheatEntry.stemRustScore * 100}%` }} className="h-full bg-rose-500" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[var(--text-muted)]">Healthy Wheat Score</span>
                      <span className="text-emerald-600 font-extrabold">{Math.round(selectedWheatEntry.healthyScore * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div style={{ width: `${selectedWheatEntry.healthyScore * 100}%` }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Symptoms & Prescriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-[var(--surface-card)] p-4 border border-[var(--border-subtle)] space-y-2">
                    <strong className="block text-[var(--text-main)] font-extrabold">Identified Biological Symptoms:</strong>
                    <ul className="space-y-1.5 text-[var(--text-muted)]">
                      {selectedWheatEntry.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-card)] p-4 border border-[var(--border-subtle)] space-y-2">
                    <strong className="block text-[var(--text-main)] font-extrabold">Chemical &amp; Organic Cure Protocol:</strong>
                    <p className="text-[var(--text-main)] font-medium">
                      <strong>Chemical Spray:</strong> {selectedWheatEntry.recommendedSpray}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                      <strong>Bio-Remedy:</strong> {selectedWheatEntry.organicCure}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      <strong>Resistant Seed Varieties:</strong> {selectedWheatEntry.resistantVarieties.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => onAddTask(`Spray Propiconazole for Wheat Rust ID #${selectedWheatEntry.id}`, selectedWheatEntry.recommendedSpray)}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--primary-agri)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                  >
                    <CheckSquare className="h-3.5 w-3.5" /> Schedule Fungicide Spray Task
                  </button>
                  <button
                    onClick={() => onOpenAssistant(`How do I prevent ${selectedWheatEntry.condition} in my wheat crop before flowering stage?`)}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                  >
                    <MessageSquareText className="h-3.5 w-3.5 text-emerald-600" /> Ask AI Rust Prevention Advice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WORKSPACE (When in Maturity or Pathology mode) ─────────────────── */}
      {scanTab !== 'wheat_rust' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Image Canvas & Live Overlay Frame */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-4">
              
              {/* Top Toolbar (Crop Selection & Camera/Upload triggers) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-main)]">Target Crop:</span>
                  <select
                    value={selectedCrop}
                    onChange={(e) => {
                      const c = e.target.value;
                      setSelectedCrop(c);
                      if (imagePreview) {
                        if (scanTab === 'maturity') runMaturityScan(imagePreview, c);
                        else runPathologyScan(imagePreview, c);
                      }
                    }}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  >
                    {SUPPORTED_CROPS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                  >
                    <Upload className="h-3.5 w-3.5 text-emerald-600" /> Upload Image
                  </button>
                  <button
                    onClick={cameraActive ? stopCamera : startCamera}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      cameraActive
                        ? 'bg-red-600 text-white'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5 text-emerald-600" /> {cameraActive ? 'Close Camera' : 'Live Camera'}
                  </button>
                </div>
              </div>

              {/* Live Camera Viewport (When Active) */}
              {cameraActive && (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500 bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 flex items-center gap-3">
                    <button
                      onClick={captureCameraFrame}
                      className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-emerald-700 transition"
                    >
                      <Camera className="h-4 w-4" /> Capture Leaf &amp; Analyze
                    </button>
                    <button
                      onClick={stopCamera}
                      className="rounded-full bg-black/70 px-4 py-2.5 text-xs font-bold text-white hover:bg-black"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Main Interactive AI Canvas Frame */}
              {!cameraActive && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative w-full aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-zinc-950 flex items-center justify-center select-none"
                >
                  {imagePreview ? (
                    <>
                      <AgriImage
                        src={imagePreview}
                        alt="Analyzed crop cluster"
                        fallbackType="crop"
                        className="w-full h-full object-cover"
                      />

                      {/* MODE 1: MATURITY DETECTION BOUNDING BOXES OVERLAY */}
                      {scanTab === 'maturity' && maturityResult && maturityResult.boundingBoxes.map((bbox) => {
                        const isHighlighted = activeBoxId === bbox.id;
                        const isHarvestReady = bbox.stage === 'Harvest-Ready';
                        const isRipening = bbox.stage === 'Mid Ripening' || bbox.stage === 'Turning / Breaker';

                        return (
                          <div
                            key={bbox.id}
                            onClick={() => setActiveBoxId(isHighlighted ? null : bbox.id)}
                            onMouseEnter={() => setActiveBoxId(bbox.id)}
                            style={{
                              left: `${bbox.box.x}%`,
                              top: `${bbox.box.y}%`,
                              width: `${bbox.box.width}%`,
                              height: `${bbox.box.height}%`,
                              borderColor: bbox.colorHex,
                            }}
                            className={`absolute border-2 cursor-pointer transition-all duration-200 z-10 ${
                              isHighlighted
                                ? 'bg-white/20 ring-4 ring-white/50 scale-[1.02] shadow-2xl'
                                : 'bg-black/10 hover:bg-white/10'
                            }`}
                          >
                            <div
                              style={{ backgroundColor: bbox.colorHex }}
                              className="absolute -top-7 left-0 rounded px-2 py-0.5 text-[10px] font-black text-black shadow-md flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <span>ID: {bbox.id}</span>
                              <span>|</span>
                              <span>{bbox.stage}</span>
                              <span>|</span>
                              <span>Conf: {Math.round(bbox.confidence * 100)}%</span>
                              <span>|</span>
                              <span>Harvest in: {bbox.harvestInDays} days</span>
                            </div>
                          </div>
                        );
                      })}

                      {/* MODE 2: PATHOLOGY DIAGNOSTIC OVERLAYS */}
                      {scanTab === 'pathology' && pathologyResult && (
                        <>
                          {pathologyViewMode === 'overlay' && (
                            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-black/80 backdrop-blur-md p-3 text-white z-20 flex items-center justify-between border border-rose-500/50 shadow-2xl">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-rose-500" />
                                <span className="font-extrabold text-xs">{pathologyResult.condition}</span>
                              </div>
                              <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase">
                                {pathologyResult.severity} Severity
                              </span>
                            </div>
                          )}
                          {pathologyViewMode === 'heatmap' && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/40 via-red-600/60 to-transparent mix-blend-color-dodge pointer-events-none z-20" />
                          )}
                          {pathologyViewMode === 'severity' && (
                            <div className="absolute inset-0 bg-red-950/50 backdrop-contrast-150 flex items-center justify-center pointer-events-none z-20">
                              <span className="bg-red-600 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-2xl">
                                Infection Spread: {pathologyResult.affectedAreaPercent}% Canopy Area
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Loading Spinner */}
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-40 space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                          <span className="text-xs font-bold">Running Gemini Multimodal Neural Scan...</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-8 text-[var(--text-muted)]">
                      <Camera className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold">Drop leaf photo or select sample above</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Controls Bar for Pathology Modes */}
              {scanTab === 'pathology' && pathologyResult && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <span className="font-bold text-[var(--text-main)]">Diagnostic Visual Modes:</span>
                  <div className="flex items-center gap-1 bg-[var(--bg-app)] p-1 rounded-xl border border-[var(--border-subtle)]">
                    {(['original', 'overlay', 'heatmap', 'severity'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPathologyViewMode(mode)}
                        className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition ${
                          pathologyViewMode === mode
                            ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: HARVEST READINESS & QUALITY METRICS ───────────── */}
          <div className="lg:col-span-4 space-y-4">
            
            {scanTab === 'maturity' && maturityResult && (
              <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-5">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                      Harvest Readiness Real-Time Overlay
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-black">
                      {maturityResult.overallStatus}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-[var(--text-main)] mt-0.5">
                    {maturityResult.cropName} Cluster Analysis
                  </h2>
                </div>

                {/* Stage Breakdown Cards */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Maturity Distribution &amp; Days-to-Harvest
                  </span>

                  {maturityResult.stageSummaries.map((stageItem) => {
                    const isReady = stageItem.stage === 'Harvest-Ready';
                    const isRipening = stageItem.stage === 'Mid Ripening' || stageItem.stage === 'Turning / Breaker';

                    return (
                      <div
                        key={stageItem.stage}
                        className={`rounded-2xl border p-3.5 transition-all ${
                          isReady
                            ? 'border-emerald-500/60 bg-emerald-500/10'
                            : isRipening
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-rose-500/40 bg-rose-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            style={{ backgroundColor: stageItem.badgeColor }}
                            className="px-2 py-0.5 rounded text-[10px] font-black text-black uppercase tracking-wider shadow-xs"
                          >
                            {isReady ? 'HARVEST-READY - 0 DAYS' : `${stageItem.stage.toUpperCase()} - ${stageItem.harvestInDays} DAYS`}
                          </span>
                          <span className="text-xs font-black text-[var(--text-main)] tabular-nums">
                            {stageItem.count} Targets ({stageItem.percentage}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                          {stageItem.recommendation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Biometric Quality Indices */}
                <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Neural Quality &amp; Physiology Metrics
                  </span>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Estimated Sugar (Brix)</span>
                      <span className="text-sm font-black text-emerald-600 block tabular-nums">
                        {maturityResult.qualityMetrics.averageBrixScore}° Bx
                      </span>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Chlorophyll Degraded</span>
                      <span className="text-sm font-black text-amber-500 block tabular-nums">
                        {maturityResult.qualityMetrics.chlorophyllDegradationPercent}%
                      </span>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Firmness Index (N)</span>
                      <span className="text-sm font-black text-indigo-500 block tabular-nums">
                        {maturityResult.qualityMetrics.firmnessIndexN} N
                      </span>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                      <span className="text-[10px] text-[var(--text-muted)] block">Est. Yield / Plant</span>
                      <span className="text-sm font-black text-[var(--text-main)] block tabular-nums">
                        {maturityResult.qualityMetrics.estimatedYieldKgPerPlant} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => onAddTask(`Harvest ${maturityResult.cropName}`, maturityResult.qualityMetrics.recommendedHarvestWindow)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                  >
                    <CheckSquare className="h-3.5 w-3.5" /> Add Harvest Task
                  </button>
                  <button
                    onClick={() => onOpenAssistant(`How should I prepare and store my ${maturityResult.cropName} harvest to maximize market price?`)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                  >
                    <MessageSquareText className="h-3.5 w-3.5 text-emerald-600" /> Ask AI Advice
                  </button>
                </div>
              </div>
            )}

            {/* Pathology Mode Results Panel */}
            {scanTab === 'pathology' && pathologyResult && (
              <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-5">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                    Crop Pathology Diagnostic Report
                  </span>
                  <h2 className="text-base font-black text-[var(--text-main)] mt-0.5">
                    {pathologyResult.condition}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block">Confidence</span>
                    <span className="text-xs font-black text-emerald-600">{Math.round(pathologyResult.confidence * 100)}%</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block">Severity</span>
                    <span className="text-xs font-black text-amber-500 capitalize">{pathologyResult.severity}</span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block">Affected Area</span>
                    <span className="text-xs font-black text-rose-500">{pathologyResult.affectedAreaPercent}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => onSaveScan(pathologyResult)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Record
                  </button>
                  <button
                    onClick={() => onOpenAssistant(`Why did my ${pathologyResult.cropName} develop ${pathologyResult.condition} and how do I treat it organically?`)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
                  >
                    <MessageSquareText className="h-3.5 w-3.5 text-emerald-600" /> Ask AI Cure
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
