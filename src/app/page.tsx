'use client';

import React, { useState, useEffect } from 'react';
import { offlineStorage } from '@/lib/storage/offline-db';
import { Farm, CropItem, LivestockAnimal, FieldZone, AdvisoryItem, AlertNotification, FarmTask, TimelineEvent, WeatherData, UserProfile } from '@/types/schema';
import { fetchFarmWeather } from '@/lib/services/weather-service';

// App Shell Components
import { Header } from '@/components/shell/Header';
import { Sidebar, NavTab } from '@/components/shell/Sidebar';
import { MobileNav } from '@/components/shell/MobileNav';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { AuthFlow } from '@/components/auth/AuthFlow';

// Dashboard & Module Components
import { FarmHealthScore } from '@/components/dashboard/FarmHealthScore';
import { FarmTwin } from '@/components/farm/FarmTwin';
import { CropManagement } from '@/components/crops/CropManagement';
import { CropScanner } from '@/components/ai-vision/CropScanner';
import { FarmFeed } from '@/components/feed/FarmFeed';
import { LivestockManager } from '@/components/livestock/LivestockManager';
import { AdvisoryCenter } from '@/components/advisory/AdvisoryCenter';
import { AgriAssistant } from '@/components/ai-assistant/AgriAssistant';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { TimelineView } from '@/components/timeline/TimelineView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { TasksView } from '@/components/tasks/TasksView';
import { AlertsView } from '@/components/alerts/AlertsView';
import { FarmerSimpleMode } from '@/components/simple-mode/FarmerSimpleMode';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DemoModeModal } from '@/components/demo/DemoModeModal';

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<string>('farm-1');
  
  // Data States
  const [fields, setFields] = useState<FieldZone[]>([]);
  const [crops, setCrops] = useState<CropItem[]>([]);
  const [livestock, setLivestock] = useState<LivestockAnimal[]>([]);
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // App Navigation & Modals
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState('');

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('agrivision_user_profile');
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
      }
    }

    const loadData = () => {
      const fList = offlineStorage.getFarms();
      setFarms(fList);
      const curFarmId = offlineStorage.getActiveFarmId();
      setActiveFarmId(curFarmId);

      setCrops(offlineStorage.getCrops(curFarmId));
      setLivestock(offlineStorage.getLivestock(curFarmId));
      setAdvisories(offlineStorage.getAdvisories(curFarmId));
      setAlerts(offlineStorage.getAlerts(curFarmId));
      setTasks(offlineStorage.getTasks(curFarmId));
      setTimeline(offlineStorage.getTimeline(curFarmId));
    };

    loadData();
    const unsubscribe = offlineStorage.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Fetch weather data for active farm
  useEffect(() => {
    const activeFarm = farms.find(f => f.id === activeFarmId);
    fetchFarmWeather(activeFarm?.latitude || 26.8206, activeFarm?.longitude || 75.8055, activeFarm?.district || 'Jaipur')
      .then(setWeather);
  }, [activeFarmId, farms]);

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0] || null;

  const handleSelectFarm = (fId: string) => {
    setActiveFarmId(fId);
    offlineStorage.setActiveFarmId(fId);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleAddTask = (title: string, description: string) => {
    const newTask: FarmTask = {
      id: `task-${Date.now()}`,
      farmId: activeFarmId,
      title,
      description,
      priority: 'High',
      status: 'Todo',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: userProfile?.name || 'Farm Owner',
      createdAt: new Date().toISOString(),
    };
    offlineStorage.addTask(newTask);

    const newEvent: TimelineEvent = {
      id: `time-${Date.now()}`,
      farmId: activeFarmId,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Task Created: ${title}`,
      description,
      type: 'advisory',
      icon: 'CheckSquare',
      actor: userProfile?.name || 'Farm Owner',
    };
    offlineStorage.addTimelineEvent(newEvent);
    setActiveTab('tasks');
  };

  const handleOpenAssistant = (query: string) => {
    setAssistantInitialQuery(query);
    setActiveTab('assistant');
  };

  const defaultFields: FieldZone[] = [
    { id: 'field-north', farmId: 'farm-1', name: 'North Field', type: 'field', areaAcres: 5.5, currentCrop: 'Tomato & Chilli', healthScore: 74, soilMoisture: 42, phLevel: 6.8, nitrogenLevel: 'Optimal', irrigationStatus: 'Active', lastScanDate: '', coordinates: { x: 5, y: 5, width: 40, height: 40 } },
    { id: 'field-south', farmId: 'farm-1', name: 'South Field', type: 'field', areaAcres: 6.0, currentCrop: 'Potato & Wheat', healthScore: 94, soilMoisture: 58, phLevel: 7.1, nitrogenLevel: 'Optimal', irrigationStatus: 'Scheduled', lastScanDate: '', coordinates: { x: 50, y: 5, width: 45, height: 40 } },
    { id: 'field-east', farmId: 'farm-1', name: 'East Field', type: 'field', areaAcres: 4.0, currentCrop: 'Onion', healthScore: 88, soilMoisture: 50, phLevel: 6.9, nitrogenLevel: 'Low', irrigationStatus: 'Idle', lastScanDate: '', coordinates: { x: 5, y: 50, width: 40, height: 45 } },
    { id: 'zone-livestock', farmId: 'farm-1', name: 'Livestock Shed', type: 'livestock', areaAcres: 1.5, healthScore: 90, soilMoisture: 30, phLevel: 7.0, nitrogenLevel: 'Optimal', irrigationStatus: 'Idle', lastScanDate: '', coordinates: { x: 50, y: 50, width: 22, height: 22 } },
    { id: 'zone-water', farmId: 'farm-1', name: 'Solar Borewell', type: 'water', areaAcres: 0.5, healthScore: 98, soilMoisture: 100, phLevel: 7.2, nitrogenLevel: 'Optimal', irrigationStatus: 'Active', lastScanDate: '', coordinates: { x: 75, y: 50, width: 20, height: 22 } },
    { id: 'zone-storage', farmId: 'farm-1', name: 'Grain Storage', type: 'storage', areaAcres: 1.0, healthScore: 95, soilMoisture: 12, phLevel: 7.0, nitrogenLevel: 'Optimal', irrigationStatus: 'Idle', lastScanDate: '', coordinates: { x: 50, y: 75, width: 45, height: 20 } },
  ];

  const activeFields = fields.length ? fields : defaultFields;

  // Unauthenticated OTP Authentication View
  if (!userProfile) {
    return (
      <AuthFlow
        onCompleteAuth={(u, f) => {
          setUserProfile(u);
          if (typeof window !== 'undefined') {
            localStorage.setItem('agrivision_user_profile', JSON.stringify(u));
          }
          offlineStorage.addFarm(f);
        }}
      />
    );
  }

  // Accessible Farmer Simple Mode view
  if (isSimpleMode) {
    return (
      <FarmerSimpleMode
        crops={crops}
        advisories={advisories}
        onExit={() => setIsSimpleMode(false)}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[var(--bg-app)] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unresolvedAdvisoriesCount={advisories.filter(a => a.status === 'active').length}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          activeFarm={activeFarm}
          farms={farms}
          onSelectFarm={handleSelectFarm}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleSimpleMode={() => setIsSimpleMode(true)}
          isSimpleMode={isSimpleMode}
          onStartDemo={() => setDemoOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          unreadAlertsCount={alerts.filter(a => !a.read).length}
          onOpenNotifications={() => setActiveTab('alerts')}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD (12-column Multi-Grid) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Greeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h1 className="text-xl font-extrabold text-[var(--text-main)]">
                    Good morning, {userProfile?.name || activeFarm?.farmerName || 'Farmer'}
                  </h1>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Your farm is healthy overall. 2 areas need attention in {activeFarm?.name || 'Your Farm'}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('agrivision_user_profile');
                      setUserProfile(null);
                    }}
                    className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100 transition"
                  >
                    Switch Account / Logout
                  </button>
                  <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface-card)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-xl">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* 12-Column Multi-Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Farm Health Index Score (8 columns) */}
                <div className="md:col-span-8">
                  <FarmHealthScore
                    score={87}
                    crops={crops}
                    livestock={livestock}
                    fields={activeFields}
                  />
                </div>

                {/* Live Weather Widget (4 columns) */}
                <div className="md:col-span-4">
                  {weather && <WeatherCard weather={weather} />}
                </div>

                {/* Farm Digital Twin Map (12 columns) */}
                <div className="md:col-span-12">
                  <FarmTwin fields={activeFields} />
                </div>

                {/* Priority Advisories (7 columns) */}
                <div className="md:col-span-7">
                  <AdvisoryCenter
                    advisories={advisories}
                    onAddTask={handleAddTask}
                    onOpenAssistant={handleOpenAssistant}
                  />
                </div>

                {/* Tasks Snapshot (5 columns) */}
                <div className="md:col-span-5">
                  <TasksView
                    tasks={tasks}
                    onToggleTask={(id) => offlineStorage.toggleTaskStatus(id)}
                    onAddTask={handleAddTask}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FARM DIGITAL TWIN */}
          {activeTab === 'twin' && (
            <FarmTwin fields={activeFields} />
          )}

          {/* TAB 3: CROP MANAGEMENT */}
          {activeTab === 'crops' && (
            <CropManagement
              crops={crops}
              onAddCrop={(c) => offlineStorage.addCrop(c)}
              onOpenAssistant={handleOpenAssistant}
            />
          )}

          {/* TAB 4: LIVESTOCK MANAGEMENT */}
          {activeTab === 'livestock' && (
            <LivestockManager
              livestock={livestock}
              onAddAnimal={(a) => offlineStorage.addLivestock(a)}
              onOpenAssistant={handleOpenAssistant}
            />
          )}

          {/* TAB 5: AI VISION CROP SCANNER */}
          {activeTab === 'vision' && (
            <CropScanner
              crops={crops}
              onSaveScan={(scan) => {
                const newEv: TimelineEvent = {
                  id: `time-${Date.now()}`,
                  farmId: activeFarmId,
                  timestamp: new Date().toISOString(),
                  timeLabel: 'Just Now',
                  title: `AI Crop Scan: ${scan.condition}`,
                  description: `Affected area ${scan.affectedAreaPercent}%, Confidence ${Math.round(scan.confidence * 100)}%`,
                  type: 'scan',
                  icon: 'Camera',
                  actor: userProfile?.name || 'Farm Owner',
                };
                offlineStorage.addTimelineEvent(newEv);
                setActiveTab('timeline');
              }}
              onAddTask={handleAddTask}
              onOpenAssistant={handleOpenAssistant}
            />
          )}

          {/* TAB 6: AI ADVISORY CENTER */}
          {activeTab === 'advisory' && (
            <AdvisoryCenter
              advisories={advisories}
              onAddTask={handleAddTask}
              onOpenAssistant={handleOpenAssistant}
            />
          )}

          {/* TAB 7: FARM FEED */}
          {activeTab === 'feed' && (
            <FarmFeed
              onAddTask={handleAddTask}
              onOpenAssistant={handleOpenAssistant}
            />
          )}

          {/* TAB 8: TIMELINE */}
          {activeTab === 'timeline' && <TimelineView timeline={timeline} />}

          {/* TAB 9: ANALYTICS */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 10: WEATHER INTELLIGENCE */}
          {activeTab === 'weather' && weather && <WeatherCard weather={weather} />}

          {/* TAB 11: TASKS CENTER */}
          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={(id) => offlineStorage.toggleTaskStatus(id)}
              onAddTask={handleAddTask}
            />
          )}

          {/* TAB 12: ALERTS & NOTIFICATIONS */}
          {activeTab === 'alerts' && <AlertsView alerts={alerts} />}

          {/* TAB 13: AGRI ASSISTANT */}
          {activeTab === 'assistant' && (
            <AgriAssistant
              initialQuery={assistantInitialQuery}
              onAddTask={handleAddTask}
            />
          )}

          {/* TAB 14: SAAS ADMIN PANEL */}
          {activeTab === 'admin' && <AdminDashboard />}

          {/* TAB 15: SETTINGS & PROFILE */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-xs space-y-4 max-w-xl mx-auto">
              <h2 className="text-lg font-bold text-[var(--text-main)]">User Profile & Account</h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)]">Farmer Name</span>
                  <span className="font-bold text-[var(--text-main)]">{userProfile?.name}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)]">Verified Contact</span>
                  <span className="font-bold text-[var(--text-main)]">{userProfile?.phone}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)]">Active Farm</span>
                  <span className="font-bold text-[var(--text-main)]">{activeFarm?.name}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-muted)]">Subscription Tier</span>
                  <span className="font-bold text-[var(--primary-agri)]">Professional SaaS Tier</span>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('agrivision_user_profile');
                  setUserProfile(null);
                }}
                className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition mt-4"
              >
                Log Out & Switch User
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadAlertsCount={alerts.filter(a => !a.read).length}
      />

      {/* Global Command Palette Search */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        crops={crops}
        livestock={livestock}
        tasks={tasks}
        advisories={advisories}
        onSelectResult={(type, id) => {
          if (type === 'crop') setActiveTab('crops');
          if (type === 'livestock') setActiveTab('livestock');
          if (type === 'task') setActiveTab('tasks');
          if (type === 'advisory') setActiveTab('advisory');
        }}
      />

      {/* Guided 20-Second Demo Modal */}
      <DemoModeModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
