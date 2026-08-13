'use client';

import React from 'react';
import { LayoutDashboard, Map, Sparkles, Bell, User } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlertsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  unreadAlertsCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--surface-card)]/95 px-2 backdrop-blur-md md:hidden">
      <button
        onClick={() => onSelectTab('overview')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          activeTab === 'overview' ? 'text-[var(--primary-agri)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('twin')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          activeTab === 'twin' ? 'text-[var(--primary-agri)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <Map className="h-5 w-5" />
        <span>Farm</span>
      </button>

      {/* Prominent Center Scan Action Button */}
      <button
        onClick={() => onSelectTab('vision')}
        className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-agri)] text-white shadow-lg ring-4 ring-[var(--surface-card)] transition hover:scale-105 active:scale-95"
        title="AI Vision Scan"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <button
        onClick={() => onSelectTab('alerts')}
        className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          activeTab === 'alerts' ? 'text-[var(--primary-agri)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <Bell className="h-5 w-5" />
        <span>Alerts</span>
        {unreadAlertsCount > 0 && (
          <span className="absolute -top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--critical-red)] text-[9px] font-bold text-white">
            {unreadAlertsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('settings')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          activeTab === 'settings' ? 'text-[var(--primary-agri)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <User className="h-5 w-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
