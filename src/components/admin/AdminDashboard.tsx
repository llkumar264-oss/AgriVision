'use client';

import React from 'react';
import { Shield, Users, Building2, Sparkles, Activity, AlertCircle, HardDrive, CheckCircle2 } from 'lucide-react';
import { AdminAnalytics } from '@/types/schema';

export const AdminDashboard: React.FC = () => {
  const analytics: AdminAnalytics = {
    totalUsers: 1420,
    activeFarms: 2850,
    scansToday: 412,
    aiRequestsCount: 1840,
    alertsTriggered: 38,
    systemHealthPercent: 99.8,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
        <div>
          <span className="rounded bg-[var(--primary-agri-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary-agri)]">
            SaaS Control Panel
          </span>
          <h1 className="mt-1 text-xl font-bold text-[var(--text-main)]">AgriVision System Administration</h1>
          <p className="text-xs text-[var(--text-muted)]">Platform usage metrics, subscription tiers, API health & AI compute throughput</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[var(--success-bg)] px-3 py-1 text-xs font-bold text-[var(--success-green)]">
          <CheckCircle2 className="h-4 w-4" /> System Operational ({analytics.systemHealthPercent}%)
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <Users className="h-4 w-4" /> Registered Farmers
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-main)] tabular-nums">{analytics.totalUsers.toLocaleString()}</span>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <Building2 className="h-4 w-4" /> Active Farms
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-main)] tabular-nums">{analytics.activeFarms.toLocaleString()}</span>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <Sparkles className="h-4 w-4 text-[var(--primary-agri)]" /> AI Scans Today
          </div>
          <span className="text-3xl font-extrabold text-[var(--primary-agri)] tabular-nums">{analytics.scansToday}</span>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-2">
            <Activity className="h-4 w-4" /> API Throughput
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-main)] tabular-nums">{analytics.aiRequestsCount} req/day</span>
        </div>
      </div>

      {/* SaaS Tier Breakdown */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[var(--text-main)]">SaaS Plan Architecture & Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
            <span className="font-bold text-xs text-[var(--text-main)] block">Free Tier</span>
            <span className="text-[11px] text-[var(--text-muted)] block">10 AI scans / month</span>
            <span className="font-semibold text-[var(--primary-agri)]">320 Active Subscriptions</span>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
            <span className="font-bold text-xs text-[var(--text-main)] block">Starter Tier</span>
            <span className="text-[11px] text-[var(--text-muted)] block">100 AI scans / month</span>
            <span className="font-semibold text-[var(--primary-agri)]">650 Active Subscriptions</span>
          </div>

          <div className="rounded-xl border border-[var(--primary-agri)] bg-[var(--primary-agri-light)] p-4 space-y-2">
            <span className="font-bold text-xs text-[var(--primary-agri)] block">Professional Tier</span>
            <span className="text-[11px] text-[var(--primary-agri)] block">500 AI scans / month</span>
            <span className="font-semibold text-[var(--primary-agri)]">410 Active Subscriptions</span>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 space-y-2">
            <span className="font-bold text-xs text-[var(--text-main)] block">Enterprise Tier</span>
            <span className="text-[11px] text-[var(--text-muted)] block">Custom unlimited scan volume</span>
            <span className="font-semibold text-[var(--primary-agri)]">40 Enterprise Co-ops</span>
          </div>
        </div>
      </div>
    </div>
  );
};
