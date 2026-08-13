'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const healthData = [
    { day: 'Mon', health: 92, humidity: 62 },
    { day: 'Tue', health: 90, humidity: 68 },
    { day: 'Wed', health: 88, humidity: 74 },
    { day: 'Thu', health: 85, humidity: 79 },
    { day: 'Fri', health: 82, humidity: 82 },
    { day: 'Sat', health: 86, humidity: 75 },
    { day: 'Sun', health: 87, humidity: 70 },
  ];

  const yieldData = [
    { crop: 'Tomato', expected: 4200, actual: 3800 },
    { crop: 'Potato', expected: 8500, actual: 8700 },
    { crop: 'Onion', expected: 3100, actual: 3050 },
    { crop: 'Chilli', expected: 1800, actual: 1500 },
    { crop: 'Wheat', expected: 4900, actual: 4950 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">Farm Analytics & Yield Intelligence</h1>
          <p className="text-xs text-[var(--text-muted)]">Historical performance trends, health decay correlation & expected vs actual yield metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trend vs Humidity Area Chart */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--text-main)]">7-Day Farm Health vs Relative Humidity Correlation</h3>
            <span className="text-[10px] text-[var(--primary-agri)] font-semibold">Live Telemetry</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.2)" />
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={10} />
                <YAxis stroke="#a1a1aa" fontSize={10} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="health" stroke="#1b4d3e" fill="#1b4d3e" fillOpacity={0.2} strokeWidth={2} name="Health Index %" />
                <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Humidity %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expected vs Actual Yield Bar Chart */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--text-main)]">Crop Yield Forecast vs Harvest (kg)</h3>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold">Seasonal Comparison</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.2)" />
                <XAxis dataKey="crop" stroke="#a1a1aa" fontSize={10} />
                <YAxis stroke="#a1a1aa" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="expected" fill="#1b4d3e" radius={[4, 4, 0, 0]} name="Expected (kg)" />
                <Bar dataKey="actual" fill="#d97706" radius={[4, 4, 0, 0]} name="Actual (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
