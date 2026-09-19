'use client';

import React from 'react';
import { 
  LayoutDashboard, Map, Sprout, ShieldAlert, Sparkles, 
  MessageSquareText, Rss, History, BarChart3, CloudSun, 
  CheckSquare, Bell, Settings, ChevronLeft, ChevronRight,
  Shield, Layers, UserCheck, ShoppingBag, Users
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'twin' 
  | 'crops' 
  | 'livestock' 
  | 'vision' 
  | 'advisory' 
  | 'marketplace'
  | 'community'
  | 'timeline' 
  | 'analytics' 
  | 'weather' 
  | 'tasks' 
  | 'alerts' 
  | 'assistant' 
  | 'settings'
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unresolvedAdvisoriesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  unresolvedAdvisoriesCount,
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'twin' as NavTab, label: 'Farm Twin', icon: Map },
    { id: 'crops' as NavTab, label: 'Crops (35+)', icon: Sprout },
    { id: 'livestock' as NavTab, label: 'Livestock (USP)', icon: UserCheck, badge: 'Flagship' },
    { id: 'marketplace' as NavTab, label: 'Marketplace', icon: ShoppingBag, badge: 'Bargain' },
    { id: 'community' as NavTab, label: 'Community Hub', icon: Users, badge: 'Live Mandi' },
    { id: 'vision' as NavTab, label: 'AI Vision', icon: Sparkles, badge: 'AI' },
    { id: 'advisory' as NavTab, label: 'Advisory', icon: ShieldAlert, count: unresolvedAdvisoriesCount },
    { id: 'timeline' as NavTab, label: 'Timeline', icon: History },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'weather' as NavTab, label: 'Weather', icon: CloudSun },
    { id: 'tasks' as NavTab, label: 'Tasks', icon: CheckSquare },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Bell },
    { id: 'assistant' as NavTab, label: 'AI Assistant', icon: MessageSquareText },
    { id: 'admin' as NavTab, label: 'SaaS Admin', icon: Shield },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-card)] transition-all duration-300 relative ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border-subtle)]">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-agri)] text-white font-bold text-lg shadow-sm">
              A
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[var(--text-main)]">AgriVision</span>
              <span className="block text-[10px] font-medium text-[var(--text-muted)] tracking-wider uppercase">Unified Farm Intel</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-[var(--primary-agri)] text-white font-bold text-lg">
            A
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-muted)] shadow-xs hover:text-[var(--text-main)]"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[var(--primary-agri)] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-main)]'
              } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`} />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && (
                <div className="flex items-center gap-1">
                  {item.badge && (
                    <span className="rounded bg-[var(--primary-agri-light)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--primary-agri)] group-hover:bg-emerald-100">
                      {item.badge}
                    </span>
                  )}
                  {item.count && item.count > 0 ? (
                    <span className="rounded-full bg-[var(--warning-amber)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.count}
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Plan Tier Badge */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-main)]">Pro Plan</span>
            <span className="text-[10px] text-[var(--primary-agri)] font-medium">18 / 500 scans</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
            <div className="h-full bg-[var(--primary-agri)] w-[12%]" />
          </div>
        </div>
      )}
    </aside>
  );
};
