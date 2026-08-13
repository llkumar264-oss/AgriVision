'use client';

import React from 'react';
import { CloudSun, Droplets, Wind, Sun, Umbrella, CloudRain } from 'lucide-react';
import { WeatherData } from '@/types/schema';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-agri-light)] text-[var(--primary-agri)]">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)]">Weather Intelligence</h2>
            <p className="text-xs text-[var(--text-muted)]">{weather.city} Live Station</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-app)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-full">
          {weather.condition}
        </span>
      </div>

      <div className="my-4 flex items-center justify-between">
        <div>
          <span className="text-4xl font-extrabold text-[var(--text-main)] tabular-nums">{weather.temperatureC}°C</span>
          <span className="text-xs text-[var(--text-muted)] block mt-0.5">Rain Probability: {weather.rainProbabilityPercent}%</span>
        </div>
        <div className="text-right space-y-1 text-xs">
          <div className="flex items-center justify-end gap-1.5 text-[var(--text-muted)]">
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-semibold text-[var(--text-main)] tabular-nums">{weather.humidityPercent}%</span> Humidity
          </div>
          <div className="flex items-center justify-end gap-1.5 text-[var(--text-muted)]">
            <Wind className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold text-[var(--text-main)] tabular-nums">{weather.windSpeedKmh} km/h</span> Wind
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="grid grid-cols-7 gap-1 pt-3 border-t border-[var(--border-subtle)] text-center text-[10px]">
        {weather.forecast7Days.slice(0, 7).map((d, i) => (
          <div key={i} className="rounded-lg p-1 hover:bg-[var(--bg-app)] transition">
            <span className="font-bold text-[var(--text-muted)] block">{d.day}</span>
            <span className="font-semibold text-[var(--text-main)] block my-0.5 tabular-nums">{d.tempMax}°</span>
            <span className="text-[9px] text-blue-500 font-bold block">{d.rainProb}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
