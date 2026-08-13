'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, ChevronDown, Search, Bell, Moon, Sun, 
  Wifi, WifiOff, Sparkles, User, LogOut, Settings, Check, Zap, Eye
} from 'lucide-react';
import { offlineStorage } from '@/lib/storage/offline-db';
import { Farm } from '@/types/schema';

interface HeaderProps {
  activeFarm: Farm | null;
  farms: Farm[];
  onSelectFarm: (farmId: string) => void;
  onOpenSearch: () => void;
  onToggleSimpleMode: () => void;
  isSimpleMode: boolean;
  onStartDemo: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeFarm,
  farms,
  onSelectFarm,
  onOpenSearch,
  onToggleSimpleMode,
  isSimpleMode,
  onStartDemo,
  darkMode,
  onToggleDarkMode,
  unreadAlertsCount,
  onOpenNotifications,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 px-4 md:px-6 backdrop-blur-md transition-colors">
      {/* Left: Farm Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-sm font-medium text-[var(--text-main)] shadow-xs transition hover:bg-[var(--surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
          >
            <Building2 className="h-4 w-4 text-[var(--primary-agri)]" />
            <span className="max-w-[140px] truncate md:max-w-[200px]">
              {activeFarm ? activeFarm.name : 'Select Farm'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </button>

          {/* Farm Dropdown */}
          {farmDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1.5 shadow-lg animate-fade-in z-50">
              <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Your Farms ({farms.length})
              </div>
              <div className="mt-1 space-y-0.5">
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f.id);
                      setFarmDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      activeFarm?.id === f.id
                        ? 'bg-[var(--primary-agri-light)] text-[var(--primary-agri)] font-medium'
                        : 'text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {f.district}, {f.state} • {f.farmAreaAcres} acres
                      </div>
                    </div>
                    {activeFarm?.id === f.id && <Check className="h-4 w-4 text-[var(--primary-agri)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Offline Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
          {isOnline ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--success-green)] animate-pulse" />
              <span className="text-[var(--text-main)]">Synced</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-[var(--warning-amber)]" />
              <span className="text-[var(--warning-amber)]">Offline Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Right Tools & Actions */}
      <div className="flex items-center gap-2">
        {/* Search Bar / Keyboard shortcut */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)]"
        >
          <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span>Search crops, tasks, alerts...</span>
          <kbd className="rounded border border-[var(--border-strong)] bg-[var(--surface-card)] px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Demo Mode Launcher */}
        <button
          onClick={onStartDemo}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--primary-agri)]/30 bg-[var(--primary-agri-light)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-agri)] transition hover:bg-[var(--primary-agri)] hover:text-white"
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">20s Interactive</span> Demo
        </button>

        {/* Farmer Simple Mode Toggle */}
        <button
          onClick={onToggleSimpleMode}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition ${
            isSimpleMode
              ? 'border-[var(--warning-amber)] bg-[var(--warning-bg)] text-[var(--warning-amber)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
          title="Toggle Low-Literacy / Accessible Simple Mode"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{isSimpleMode ? 'Simple Mode ON' : 'Simple Mode'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--critical-red)] text-[10px] font-bold text-white">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 pr-2 transition hover:bg-[var(--surface-hover)]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-agri)] text-xs font-bold text-white">
              RK
            </div>
            <span className="hidden md:inline text-xs font-medium text-[var(--text-main)]">Rajesh</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1 shadow-lg animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                <div className="text-xs font-semibold text-[var(--text-main)]">Rajesh Kumar</div>
                <div className="text-[11px] text-[var(--text-muted)]">+91 98765 43210</div>
              </div>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              >
                <User className="h-3.5 w-3.5" /> Profile Settings
              </button>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--critical-red)] hover:bg-[var(--critical-bg)]"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
