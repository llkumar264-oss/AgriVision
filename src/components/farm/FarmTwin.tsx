'use client';

import React, { useState, useEffect } from 'react';
import { FieldZone } from '@/types/schema';
import { 
  Map, Sprout, UserCheck, Droplets, Warehouse, Cpu, Activity, X, 
  ChevronRight, AlertTriangle, ShieldCheck, Play, Pause, RotateCcw, 
  Radio, Compass, Gauge, Zap, Wind, Sun, Layers, Plane, Sliders, CheckCircle2, Sparkles, Power
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface FarmTwinProps {
  fields: FieldZone[];
  onSelectZone?: (zoneId: string) => void;
  onOpenAssistant?: (query: string) => void;
}

type TwinLayer = 'topology' | 'ndvi' | 'moisture' | 'hydraulic';

export const FarmTwin: React.FC<FarmTwinProps> = ({ fields, onSelectZone, onOpenAssistant }) => {
  const { t, language } = useLanguage();
  const [activeLayer, setActiveLayer] = useState<TwinLayer>('topology');
  const [activeZone, setActiveZone] = useState<FieldZone | null>(null);

  // IoT Hardware Controls State
  const [pumpActive, setPumpActive] = useState<boolean>(true);
  const [fertigationActive, setFertigationActive] = useState<boolean>(false);
  const [valveNorthActive, setValveNorthActive] = useState<boolean>(true);
  const [valveSouthActive, setValveSouthActive] = useState<boolean>(false);
  const [waterFlowLpm, setWaterFlowLpm] = useState<number>(420);

  // Drone Aerial Mission Simulation State
  const [droneRunning, setDroneRunning] = useState<boolean>(false);
  const [droneProgress, setDroneProgress] = useState<number>(0);
  const [droneWaypoint, setDroneWaypoint] = useState<string>('WP-1 (North Wheat Plot)');
  const [droneAltitude, setDroneAltitude] = useState<number>(25);
  const [droneBattery, setDroneBattery] = useState<number>(94);
  const [droneCanopyTemp, setDroneCanopyTemp] = useState<number>(27.8);

  // AI Climate Shock Simulator State
  const [tempShock, setTempShock] = useState<number>(0); // +0°C to +5°C
  const [rainDeficit, setRainDeficit] = useState<number>(0); // 0% to 50%

  // Simulated live sensor fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      if (pumpActive) {
        setWaterFlowLpm(prev => 415 + Math.floor(Math.random() * 15));
      } else {
        setWaterFlowLpm(0);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [pumpActive]);

  // Drone mission animation loop
  useEffect(() => {
    let interval: any;
    if (droneRunning) {
      interval = setInterval(() => {
        setDroneProgress((prev) => {
          if (prev >= 100) {
            setDroneRunning(false);
            return 100;
          }
          const next = prev + 2;
          if (next < 30) setDroneWaypoint('WP-1 (North Wheat & Mustard)');
          else if (next < 65) setDroneWaypoint('WP-2 (East Tomato & Chilli Field)');
          else setDroneWaypoint('WP-3 (South Sugarcane & Cotton)');
          
          setDroneCanopyTemp(Number((27.5 + (Math.random() * 1.8)).toFixed(1)));
          return next;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [droneRunning]);

  const handleLaunchDrone = () => {
    setDroneProgress(0);
    setDroneRunning(true);
    setDroneBattery(94);
  };

  // Dynamic Yield Impact calculations
  const yieldPenaltyPercent = Math.min(35, Math.round((tempShock * 3.8) + (rainDeficit * 0.45)));
  const waterStressIndex = (0.2 + (tempShock * 0.12) + (rainDeficit * 0.012)).toFixed(2);

  const getZoneIcon = (type: FieldZone['type']) => {
    switch (type) {
      case 'field': return Sprout;
      case 'livestock': return UserCheck;
      case 'water': return Droplets;
      case 'storage': return Warehouse;
      case 'sensor_hub': return Cpu;
      default: return Map;
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs animate-fade-in">
      
      {/* ── HEADER & GIS LAYER SELECTOR ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white shadow-md">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[var(--text-main)]">{t.twin.title}</h2>
              <span className="flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                <Radio className="h-3 w-3 animate-pulse text-emerald-600" /> IoT Mesh Live
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{t.twin.subtitle}</p>
          </div>
        </div>

        {/* 4 Spatial GIS Layer Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[var(--bg-app)] p-1 rounded-2xl border border-[var(--border-subtle)] scrollbar-none">
          {[
            { id: 'topology', label: t.twin.layers.topology, icon: Map },
            { id: 'ndvi', label: t.twin.layers.ndvi, icon: Sprout },
            { id: 'moisture', label: t.twin.layers.moisture, icon: Droplets },
            { id: 'hydraulic', label: t.twin.layers.hydraulic, icon: Zap },
          ].map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as TwinLayer)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── INTERACTIVE CANVAS & SPATIAL VIEWPORT ───────────────────────────── */}
      <div className="relative w-full h-[400px] md:h-[440px] rounded-3xl border border-[var(--border-subtle)] bg-zinc-950 p-4 overflow-hidden shadow-inner text-white">
        
        {/* Layer-Specific Graphic Overlays */}
        {activeLayer === 'topology' && (
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        )}
        {activeLayer === 'ndvi' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-emerald-600/30 to-amber-700/20 mix-blend-screen pointer-events-none" />
        )}
        {activeLayer === 'moisture' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-cyan-900/30 to-transparent mix-blend-overlay pointer-events-none" />
        )}
        {activeLayer === 'hydraulic' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated Hydraulic Pipe Network Lines */}
            <svg className="w-full h-full opacity-60">
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#06b6d4" strokeWidth="4" strokeDasharray={pumpActive ? "8,8" : "none"} className={pumpActive ? "animate-pulse" : ""} />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#06b6d4" strokeWidth="3" strokeDasharray={pumpActive ? "6,6" : "none"} />
            </svg>
          </div>
        )}

        {/* Live Drone Flyover Indicator */}
        {droneRunning && (
          <div
            style={{
              left: `${15 + (droneProgress * 0.7)}%`,
              top: `${20 + Math.sin(droneProgress * 0.1) * 30}%`,
            }}
            className="absolute z-30 flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-black shadow-2xl ring-4 ring-emerald-400/40 animate-bounce">
              <Plane className="h-5 w-5 rotate-45" />
            </div>
            <div className="rounded-xl bg-black/80 px-2.5 py-1 text-[10px] font-black backdrop-blur-md border border-emerald-500 text-emerald-300 whitespace-nowrap shadow-2xl">
              Surveying: {droneWaypoint} • {droneCanopyTemp}°C
            </div>
          </div>
        )}

        {/* Interactive Zones Grid */}
        <div className="relative w-full h-full grid grid-cols-12 grid-rows-6 gap-3 z-10">
          {fields.map((zone) => {
            const Icon = getZoneIcon(zone.type);
            const isAttention = zone.healthScore < 80;

            let colSpan = 'col-span-6 row-span-3';
            if (zone.id === 'field-north') colSpan = 'col-span-12 md:col-span-7 row-span-3';
            if (zone.id === 'field-south') colSpan = 'col-span-12 md:col-span-5 row-span-3';
            if (zone.id === 'field-east') colSpan = 'col-span-12 md:col-span-5 row-span-3';
            if (zone.id === 'zone-livestock') colSpan = 'col-span-6 md:col-span-4 row-span-3';
            if (zone.id === 'zone-water') colSpan = 'col-span-6 md:col-span-3 row-span-3';
            if (zone.id === 'zone-storage') colSpan = 'col-span-12 md:col-span-12 row-span-2';

            return (
              <div
                key={zone.id}
                onClick={() => {
                  setActiveZone(zone);
                  if (onSelectZone) onSelectZone(zone.id);
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] backdrop-blur-md ${colSpan} ${
                  activeLayer === 'ndvi'
                    ? 'border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/60'
                    : activeLayer === 'moisture'
                    ? 'border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/60'
                    : activeLayer === 'hydraulic'
                    ? 'border-blue-500/50 bg-blue-950/40 hover:bg-blue-900/60'
                    : isAttention
                    ? 'border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/50'
                    : 'border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-400 shadow-inner">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition">
                        {zone.name}
                      </h3>
                      <span className="text-[10px] text-zinc-400">{zone.areaAcres} Acres Plot</span>
                    </div>
                  </div>

                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black shadow-xs ${
                    zone.healthScore >= 90
                      ? 'bg-emerald-500 text-black'
                      : zone.healthScore >= 75
                      ? 'bg-amber-500 text-black'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}>
                    {activeLayer === 'ndvi' ? `NDVI: 0.${zone.healthScore}` : `${zone.healthScore}% Health`}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-[11px] text-zinc-300">
                  {zone.currentCrop && (
                    <div className="flex items-center justify-between font-bold">
                      <span>Crop: {zone.currentCrop}</span>
                      {isAttention && (
                        <span className="flex items-center gap-1 text-rose-400 font-extrabold text-[10px]">
                          <AlertTriangle className="h-3 w-3" /> Action Required
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/80 pt-1.5">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-cyan-400" /> Moisture: {zone.soilMoisture}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" /> Flow: {pumpActive ? 'Active Drip' : 'Idle'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3 bg-black/70 px-3 py-1.5 rounded-xl border border-zinc-800 text-[10px] backdrop-blur-md">
          {activeLayer === 'ndvi' && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">NDVI Scale:</span>
              <div className="h-2 w-20 rounded bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />
              <span className="font-bold text-emerald-400">Dense Canopy</span>
            </div>
          )}
          {activeLayer === 'moisture' && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Root Moisture:</span>
              <span className="text-cyan-400 font-bold">48% Optimal (FC: 55%)</span>
            </div>
          )}
          {activeLayer === 'hydraulic' && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Main Line Pressure:</span>
              <span className="text-cyan-300 font-bold">2.45 Bar • {waterFlowLpm} L/min</span>
            </div>
          )}
          {activeLayer === 'topology' && (
            <div className="flex items-center gap-2 text-zinc-400 font-bold">
              <span>● Sensor Mesh Connected (6 Active Gateways)</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 3 SMART TELEMETRY CONTROL PANELS ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* PANEL 1: REMOTE BOREWELL & HYDRAULIC VALVE AUTOMATION */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <span className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> {t.twin.remoteAutomation}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
              pumpActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-zinc-200 text-zinc-700'
            }`}>
              {pumpActive ? 'Flow Active' : 'Off'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
              <div>
                <strong className="block text-[11px] text-[var(--text-main)]">5 HP Solar Borewell Motor</strong>
                <span className="text-[10px] text-[var(--text-muted)]">{waterFlowLpm} L/min • 3.8 kW Draw</span>
              </div>
              <button
                onClick={() => setPumpActive(!pumpActive)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  pumpActive
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Power className="h-3 w-3" />
                {pumpActive ? 'Turn OFF' : 'Turn ON'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
              <div>
                <strong className="block text-[11px] text-[var(--text-main)]">Fertigation Venturi Unit</strong>
                <span className="text-[10px] text-[var(--text-muted)]">Water Soluble NPK 19:19:19</span>
              </div>
              <button
                onClick={() => setFertigationActive(!fertigationActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  fertigationActive ? 'bg-amber-600 text-white' : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {fertigationActive ? 'Dosing Active' : 'Enable Dose'}
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: AUTONOMOUS DRONE AERIAL MISSION */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <span className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
              <Plane className="h-4 w-4 text-emerald-600" /> {t.twin.droneMission}
            </span>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              Bat: {droneBattery}% • Alt: {droneAltitude}m
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Mission Progress</span>
                <span className="font-extrabold text-emerald-600">{droneProgress}% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  style={{ width: `${droneProgress}%` }}
                  className="h-full bg-emerald-500 transition-all duration-300"
                />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">Current Waypoint: {droneWaypoint}</span>
            </div>

            <button
              onClick={handleLaunchDrone}
              disabled={droneRunning}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-agri)] py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {droneRunning ? 'Survey in Progress...' : t.twin.startDrone}
            </button>
          </div>
        </div>

        {/* PANEL 3: AI CLIMATE SHOCK & YIELD STRESS SIMULATOR */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <span className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-indigo-500" /> AI Climate Shock Simulator
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
              yieldPenaltyPercent > 10 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {yieldPenaltyPercent > 0 ? `-${yieldPenaltyPercent}% Yield Impact` : 'Nominal Weather'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-[var(--text-muted)]">Temperature Heatwave Anomaly:</span>
                <span className="text-amber-600">+{tempShock}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={tempShock}
                onChange={(e) => setTempShock(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-[var(--text-muted)]">Monsoon Rain Deficit:</span>
                <span className="text-blue-600">-{rainDeficit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={rainDeficit}
                onChange={(e) => setRainDeficit(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
              />
            </div>

            {yieldPenaltyPercent > 0 && onOpenAssistant && (
              <button
                onClick={() => onOpenAssistant(`How can I protect my crops against +${tempShock}°C heat stress and -${rainDeficit}% drought deficit?`)}
                className="flex w-full items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline pt-1"
              >
                <Sparkles className="h-3 w-3" /> Get AI Climate Mitigation Advice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── ZONE DETAIL SLIDE-OVER MODAL ───────────────────────────────────── */}
      {activeZone && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[var(--surface-card)] h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[var(--border-subtle)] space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white shadow-md">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--text-main)]">{activeZone.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{activeZone.areaAcres} Acres • IoT Telemetry Node Active</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveZone(null)}
                  className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Vitals Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Soil Moisture</span>
                  <span className="text-sm font-black text-cyan-600">{activeZone.soilMoisture}%</span>
                </div>
                <div className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Health Index</span>
                  <span className="text-sm font-black text-emerald-600">{activeZone.healthScore} / 100</span>
                </div>
                <div className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Irrigation Mode</span>
                  <span className="text-xs font-bold text-[var(--text-main)] capitalize">{activeZone.irrigationStatus}</span>
                </div>
                <div className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Active Crop</span>
                  <span className="text-xs font-bold text-[var(--text-main)]">{activeZone.currentCrop || 'Fallow'}</span>
                </div>
              </div>

              {/* Soil Chemistry (NPK) Node Readouts */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2 text-xs">
                <h4 className="font-extrabold text-[var(--text-main)] flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-emerald-600" /> Underground Micro-Sensor Telemetry
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Nitrogen (N)</span>
                    <strong className="text-emerald-700 text-xs">148 mg/kg</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Phosphorus (P)</span>
                    <strong className="text-indigo-700 text-xs">38 mg/kg</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Potassium (K)</span>
                    <strong className="text-amber-700 text-xs">215 mg/kg</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenAssistant) {
                  onOpenAssistant(`What are the optimal irrigation and fertilizer recommendations for ${activeZone.name} (${activeZone.currentCrop})?`);
                }
                setActiveZone(null);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
            >
              <Sparkles className="h-4 w-4" /> Consult AI for this Zone
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
