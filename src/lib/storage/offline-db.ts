import { Farm, CropItem, LivestockAnimal, DiseaseScanResult, FarmTask, TimelineEvent, AdvisoryItem, AlertNotification } from '@/types/schema';
import { INITIAL_FARMS, INITIAL_FIELDS, INITIAL_CROPS, INITIAL_PROGRESSION, INITIAL_LIVESTOCK, INITIAL_ADVISORIES, INITIAL_ALERTS, INITIAL_TASKS, INITIAL_TIMELINE, INITIAL_FEED, INITIAL_SUBSCRIPTION } from '@/lib/mock-data';

export type SyncState = 'Synced' | 'Syncing' | 'Offline';

const STORAGE_KEYS = {
  FARMS: 'agrivision_farms',
  CROPS: 'agrivision_crops',
  FIELDS: 'agrivision_fields',
  LIVESTOCK: 'agrivision_livestock',
  ADVISORIES: 'agrivision_advisories',
  ALERTS: 'agrivision_alerts',
  TASKS: 'agrivision_tasks',
  TIMELINE: 'agrivision_timeline',
  SCANS: 'agrivision_scans',
  ACTIVE_FARM_ID: 'agrivision_active_farm_id',
  SYNC_QUEUE: 'agrivision_sync_queue',
  USER_PROFILE: 'agrivision_user_profile',
};

class OfflineStorageManager {
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDefaultData();
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(INITIAL_FARMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FIELDS)) {
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(INITIAL_FIELDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIVESTOCK)) {
      localStorage.setItem(STORAGE_KEYS.LIVESTOCK, JSON.stringify(INITIAL_LIVESTOCK));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADVISORIES)) {
      localStorage.setItem(STORAGE_KEYS.ADVISORIES, JSON.stringify(INITIAL_ADVISORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMELINE)) {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(INITIAL_TIMELINE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_FARM_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, 'farm-1');
    }
  }

  public getFarms(): Farm[] {
    if (typeof window === 'undefined') return INITIAL_FARMS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARMS);
      return data ? JSON.parse(data) : INITIAL_FARMS;
    } catch {
      return INITIAL_FARMS;
    }
  }

  public getActiveFarmId(): string {
    if (typeof window === 'undefined') return 'farm-1';
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_FARM_ID) || 'farm-1';
  }

  public setActiveFarmId(farmId: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, farmId);
    this.notify();
  }

  public addFarm(farm: Farm) {
    const farms = this.getFarms();
    farms.push(farm);
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
    this.setActiveFarmId(farm.id);
    this.notify();
  }

  public getCrops(farmId: string): CropItem[] {
    if (typeof window === 'undefined') return INITIAL_CROPS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CROPS);
      const crops: CropItem[] = data ? JSON.parse(data) : INITIAL_CROPS;
      const filtered = crops.filter((c) => c.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_CROPS.map((c) => ({ ...c, farmId }));
    } catch {
      return INITIAL_CROPS.map((c) => ({ ...c, farmId }));
    }
  }

  public addCrop(crop: CropItem) {
    const data = localStorage.getItem(STORAGE_KEYS.CROPS);
    const crops: CropItem[] = data ? JSON.parse(data) : INITIAL_CROPS;
    crops.unshift(crop);
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    this.notify();
  }

  public updateCrop(updatedCrop: CropItem) {
    const data = localStorage.getItem(STORAGE_KEYS.CROPS);
    let crops: CropItem[] = data ? JSON.parse(data) : INITIAL_CROPS;
    crops = crops.map((c) => (c.id === updatedCrop.id ? updatedCrop : c));
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    this.notify();
  }

  public getLivestock(farmId: string): LivestockAnimal[] {
    if (typeof window === 'undefined') return INITIAL_LIVESTOCK;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIVESTOCK);
      const animals: LivestockAnimal[] = data ? JSON.parse(data) : INITIAL_LIVESTOCK;
      const filtered = animals.filter((a) => a.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_LIVESTOCK.map((a) => ({ ...a, farmId }));
    } catch {
      return INITIAL_LIVESTOCK.map((a) => ({ ...a, farmId }));
    }
  }

  public addLivestock(animal: LivestockAnimal) {
    const data = localStorage.getItem(STORAGE_KEYS.LIVESTOCK);
    const list: LivestockAnimal[] = data ? JSON.parse(data) : INITIAL_LIVESTOCK;
    list.unshift(animal);
    localStorage.setItem(STORAGE_KEYS.LIVESTOCK, JSON.stringify(list));
    this.notify();
  }

  public getTasks(farmId: string): FarmTask[] {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      const tasks: FarmTask[] = data ? JSON.parse(data) : INITIAL_TASKS;
      const filtered = tasks.filter((t) => t.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_TASKS.map((t) => ({ ...t, farmId }));
    } catch {
      return INITIAL_TASKS.map((t) => ({ ...t, farmId }));
    }
  }

  public addTask(task: FarmTask) {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    const tasks: FarmTask[] = data ? JSON.parse(data) : INITIAL_TASKS;
    tasks.unshift(task);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    this.notify();
  }

  public toggleTaskStatus(taskId: string) {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    let tasks: FarmTask[] = data ? JSON.parse(data) : INITIAL_TASKS;
    tasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    this.notify();
  }

  public getAlerts(farmId: string): AlertNotification[] {
    if (typeof window === 'undefined') return INITIAL_ALERTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      const alerts: AlertNotification[] = data ? JSON.parse(data) : INITIAL_ALERTS;
      const filtered = alerts.filter((a) => a.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_ALERTS.map((a) => ({ ...a, farmId }));
    } catch {
      return INITIAL_ALERTS.map((a) => ({ ...a, farmId }));
    }
  }

  public addAlert(alert: AlertNotification) {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const alerts: AlertNotification[] = data ? JSON.parse(data) : INITIAL_ALERTS;
    alerts.unshift(alert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.notify();
  }

  public getTimeline(farmId: string): TimelineEvent[] {
    if (typeof window === 'undefined') return INITIAL_TIMELINE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      const events: TimelineEvent[] = data ? JSON.parse(data) : INITIAL_TIMELINE;
      const filtered = events.filter((e) => e.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_TIMELINE.map((e) => ({ ...e, farmId }));
    } catch {
      return INITIAL_TIMELINE.map((e) => ({ ...e, farmId }));
    }
  }

  public addTimelineEvent(event: TimelineEvent) {
    const data = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    const events: TimelineEvent[] = data ? JSON.parse(data) : INITIAL_TIMELINE;
    events.unshift(event);
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(events));
    this.notify();
  }

  public getAdvisories(farmId: string): AdvisoryItem[] {
    if (typeof window === 'undefined') return INITIAL_ADVISORIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADVISORIES);
      const list: AdvisoryItem[] = data ? JSON.parse(data) : INITIAL_ADVISORIES;
      const filtered = list.filter((a) => a.farmId === farmId);
      if (filtered.length > 0) return filtered;
      return INITIAL_ADVISORIES.map((a) => ({ ...a, farmId }));
    } catch {
      return INITIAL_ADVISORIES.map((a) => ({ ...a, farmId }));
    }
  }
}

export const offlineStorage = new OfflineStorageManager();
