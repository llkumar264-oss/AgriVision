'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, ChevronDown, Search, Bell, Moon, Sun, 
  Wifi, WifiOff, Sparkles, User, LogOut, Settings, Check, Zap, Eye,
  Globe, Edit3, X, Save, ShieldCheck
} from 'lucide-react';
import { offlineStorage } from '@/lib/storage/offline-db';
import { Farm, UserProfile } from '@/types/schema';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { AppLanguage } from '@/lib/i18n/translations';

interface HeaderProps {
  activeFarm: Farm | null;
  farms: Farm[];
  userProfile?: UserProfile | null;
  onUpdateProfile?: (updated: Partial<UserProfile>, updatedFarm?: Partial<Farm>) => void;
  onSelectFarm: (farmId: string) => void;
  onOpenSearch: () => void;
  onToggleSimpleMode: () => void;
  isSimpleMode: boolean;
  onStartDemo: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeFarm,
  farms,
  userProfile,
  onUpdateProfile,
  onSelectFarm,
  onOpenSearch,
  onToggleSimpleMode,
  isSimpleMode,
  onStartDemo,
  darkMode,
  onToggleDarkMode,
  unreadAlertsCount,
  onOpenNotifications,
  onSignOut,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(userProfile?.name || activeFarm?.farmerName || 'Rajesh Kumar');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '+91 98765 43210');
  const [editFarmName, setEditFarmName] = useState(activeFarm?.name || 'Rajasthan Green Fields');
  const [editDistrict, setEditDistrict] = useState(activeFarm?.district || 'Jaipur');
  const [editState, setEditState] = useState(activeFarm?.state || 'Rajasthan');

  useEffect(() => {
    if (userProfile?.name) setEditName(userProfile.name);
    if (userProfile?.phone) setEditPhone(userProfile.phone);
    if (activeFarm?.name) setEditFarmName(activeFarm.name);
    if (activeFarm?.district) setEditDistrict(activeFarm.district);
    if (activeFarm?.state) setEditState(activeFarm.state);
  }, [userProfile, activeFarm]);

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

  const currentDisplayName = userProfile?.name || activeFarm?.farmerName || 'Farmer';
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0]?.[0] || 'F').toUpperCase();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(
        { name: editName, phone: editPhone },
        { name: editFarmName, district: editDistrict, state: editState, farmerName: editName }
      );
    }
    setEditProfileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 px-4 md:px-6 backdrop-blur-md transition-colors">
        {/* Left: Farm Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-xs transition hover:bg-[var(--surface-hover)] focus:outline-none"
            >
              <Building2 className="h-4 w-4 text-[var(--primary-agri)]" />
              <span className="max-w-[140px] truncate md:max-w-[200px]">
                {activeFarm ? activeFarm.name : 'Select Farm'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </button>

            {/* Farm Dropdown */}
            {farmDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xl animate-fade-in z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                  Your Farms ({farms.length})
                </div>
                <div className="mt-1 space-y-1">
                  {farms.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectFarm(f.id);
                        setFarmDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                        activeFarm?.id === f.id
                          ? 'bg-[var(--primary-agri-light)] text-[var(--primary-agri)] font-bold'
                          : 'text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{f.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
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

          {/* Sync Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
            {isOnline ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[var(--success-green)] animate-pulse" />
                <span className="text-[var(--text-main)]">{t.header.synced}</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-[var(--warning-amber)]" />
                <span className="text-[var(--warning-amber)]">{t.header.offline}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Search Bar / Keyboard shortcut */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)]"
          >
            <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span>{t.header.searchPlaceholder.slice(0, 24)}...</span>
            <kbd className="rounded border border-[var(--border-strong)] bg-[var(--surface-card)] px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2.5 py-1.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition"
              title="Change Language (English / हिंदी / Hinglish)"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="capitalize">{language === 'hi' ? 'हिंदी' : language === 'hinglish' ? 'Hinglish' : 'English'}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1.5 shadow-xl animate-fade-in z-50">
                {[
                  { code: 'en', label: 'English (EN)' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'hinglish', label: 'Hinglish (Mix)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as AppLanguage);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                      language === l.code
                        ? 'bg-[var(--primary-agri)] text-white'
                        : 'text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Demo Mode Launcher */}
          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--primary-agri)]/30 bg-[var(--primary-agri-light)] px-3 py-1.5 text-xs font-bold text-[var(--primary-agri)] transition hover:bg-[var(--primary-agri)] hover:text-white"
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">20s Interactive</span> Demo
          </button>

          {/* Farmer Simple Mode Toggle */}
          <button
            onClick={onToggleSimpleMode}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold border transition ${
              isSimpleMode
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Toggle Low-Literacy / Accessible Simple Mode"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{isSimpleMode ? 'Simple Mode ON' : t.header.simpleMode}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--critical-red)] text-[10px] font-bold text-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown with Dynamic User Name & Edit Modal */}
          <div className="relative ml-1">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 pr-2.5 transition hover:bg-[var(--surface-hover)]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-agri)] text-xs font-black text-white shadow-xs">
                {getInitials(currentDisplayName)}
              </div>
              <span className="hidden md:inline text-xs font-bold text-[var(--text-main)]">
                {currentDisplayName.split(' ')[0]}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xl animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                  <div className="text-xs font-extrabold text-[var(--text-main)]">{currentDisplayName}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{userProfile?.phone || '+91 98765 43210'}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{activeFarm?.name}</div>
                </div>

                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setEditProfileOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-emerald-600" /> {t.header.editProfile}
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[var(--critical-red)] hover:bg-[var(--critical-bg)]"
                  >
                    <LogOut className="h-3.5 w-3.5" /> {t.header.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── EDIT FARMER PROFILE & FARM DETAILS MODAL ───────────────────────── */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[var(--text-main)]">{t.header.editProfile}</h2>
                  <span className="text-[10px] text-[var(--text-muted)]">Live dynamic farmer &amp; farm name</span>
                </div>
              </div>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">{t.header.farmerName}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name (e.g. Ramesh Patel)..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">{t.header.phone}</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">{t.header.farmName}</label>
                <input
                  type="text"
                  value={editFarmName}
                  onChange={(e) => setEditFarmName(e.target.value)}
                  placeholder="Farm Name (e.g. Kisan Smart Agro Fields)"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">District / City</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    placeholder="Jaipur"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-main)] mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="Rajasthan"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary-agri)] py-3 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-agri-hover)] transition"
              >
                <Save className="h-4 w-4" /> {t.header.saveChanges}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
