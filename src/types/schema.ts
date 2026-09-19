export type UserRole = 'owner' | 'manager' | 'worker' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  profileImage?: string;
  language: string; // 'en' | 'hi' | 'rj' | 'pb' | 'mr' | 'gu' | 'ta' | 'te' | 'bn'
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  simpleMode?: boolean;
}

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  farmerName: string;
  state: string;
  district: string;
  village: string;
  farmAreaAcres: number;
  primaryCrop: string;
  livestockCount: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldZone {
  id: string;
  farmId: string;
  name: string; // e.g. "North Field", "South Field", "East Field", "Livestock Zone", "Water Source", "Grain Storage"
  type: 'field' | 'livestock' | 'water' | 'storage' | 'greenhouse' | 'sensor_hub';
  areaAcres: number;
  currentCrop?: string;
  healthScore: number;
  soilMoisture: number; // %
  phLevel: number;
  nitrogenLevel: string; // "Optimal" | "Low" | "High"
  irrigationStatus: 'Active' | 'Idle' | 'Scheduled';
  lastScanDate: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export type GrowthStage = 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvesting';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface CropItem {
  id: string;
  farmId: string;
  fieldId: string;
  name: string; // Tomato, Potato, Onion, Chilli, Brinjal, Okra, Cabbage, etc.
  variety: string;
  areaAcres: number;
  sowingDate: string;
  growthStage: GrowthStage;
  healthScore: number; // 0 - 100
  diseaseRisk: RiskLevel;
  expectedYieldKg: number;
  lastScanDate: string;
  activeCondition?: string;
  imageUrl?: string;
}

export interface DiseaseScanResult {
  id: string;
  farmId: string;
  cropId: string;
  cropName: string;
  imageUrl: string;
  timestamp: string;
  condition: string;
  confidence: number; // 0.0 to 1.0
  severity: 'low' | 'moderate' | 'high' | 'critical';
  affectedAreaPercent: number;
  riskLevel: RiskLevel;
  visibleSymptoms: string[];
  recommendations: string[];
  followUpDays: number;
  scanMode?: 'original' | 'overlay' | 'heatmap' | 'severity' | 'comparison';
}

export interface DiseaseProgressionEntry {
  dayLabel: string; // Day 1, Day 4, Day 8, Day 12
  date: string;
  affectedAreaPercent: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  healthScore: number;
  treatmentApplied?: string;
  weatherHumidity: number;
  aiInterpretation: string;
}

export type AnimalType = 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Chicken';

export interface LivestockAnimal {
  id: string;
  farmId: string;
  tagNumber: string;
  type: AnimalType;
  breed: string;
  ageMonths: number;
  weightKg: number;
  healthScore: number;
  riskLevel: RiskLevel;
  lastVaccinationDate: string;
  nextVaccinationDue: string;
  lastCheckDate: string;
  imageUrl?: string;
  notes?: string;
}

export interface FeedingRecord {
  id: string;
  animalId: string;
  date: string;
  feedType: string;
  quantityKg: number;
}

export interface VaccinationRecord {
  id: string;
  animalId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string;
  veterinarian: string;
}

export interface WeatherData {
  city: string;
  temperatureC: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmh: number;
  uvIndex: number;
  precipitationMm: number;
  condition: string;
  icon: string;
  forecast7Days: {
    day: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
  }[];
  hourlyForecast: {
    time: string;
    temp: number;
    rainProb: number;
  }[];
}

export interface AdvisoryItem {
  id: string;
  farmId: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Crop' | 'Livestock' | 'Weather' | 'Preventive';
  title: string;
  reason: string;
  recommendedActions: string[];
  relatedCropId?: string;
  relatedScanId?: string;
  createdAt: string;
  status: 'active' | 'resolved' | 'dismissed';
}

export interface AlertNotification {
  id: string;
  farmId: string;
  type: 'Disease' | 'Weather' | 'Task' | 'Livestock' | 'System';
  severity: 'Critical' | 'Attention' | 'Information';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  sourceEvidenceId?: string;
}

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  assignedTo?: string;
  relatedCropOrAnimal?: string;
  reason?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  farmId: string;
  timestamp: string;
  timeLabel: string;
  title: string;
  description: string;
  type: 'scan' | 'disease' | 'treatment' | 'irrigation' | 'weather' | 'livestock' | 'advisory';
  icon: string;
  actor: string;
  metadata?: Record<string, any>;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  evidence?: {
    type: 'scan' | 'weather' | 'crop' | 'history';
    title: string;
    detail: string;
    scanId?: string;
  };
  recommendedAction?: {
    type: 'create_task';
    taskTitle: string;
    taskPriority: 'High' | 'Medium' | 'Low';
    taskDueDate: string;
  };
}

export interface FarmFeedPost {
  id: string;
  farmId: string;
  farmName: string;
  farmerName: string;
  farmerAvatar?: string;
  timestamp: string;
  imageUrl: string;
  category: 'Crops' | 'Livestock' | 'Diseases' | 'Treatments' | 'Observations';
  targetName: string; // e.g. "Tomato - North Field"
  description: string;
  aiAnalysis?: {
    condition: string;
    confidence: number;
    severity: string;
  };
  likesCount: number;
  commentsCount: number;
  userLiked?: boolean;
}

export interface UserSubscription {
  plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
  status: 'active' | 'canceled' | 'trialing';
  scansUsedThisMonth: number;
  scansLimit: number;
  aiChatsUsedThisMonth: number;
  aiChatsLimit: number;
  renewalDate: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeFarms: number;
  scansToday: number;
  aiRequestsCount: number;
  alertsTriggered: number;
  systemHealthPercent: number;
}

export type MarketCategory = 'Seeds' | 'Fertilizers' | 'Protection' | 'Machinery' | 'Livestock' | 'Feed';

export interface MarketplaceItem {
  id: string;
  title: string;
  category: MarketCategory;
  price: number; // in INR ₹
  originalPrice?: number;
  unit: string; // e.g. "kg", "bag (50kg)", "liter", "unit"
  sellerName: string;
  sellerRating: number; // 4.8
  sellerLocation: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
  allowBargain: boolean;
  minAcceptablePrice?: number;
  tag?: 'Hybrid' | 'High Yield' | 'Organic' | 'Government Certified' | 'Fast Germination';
}

export interface BargainOffer {
  id: string;
  itemId: string;
  itemTitle: string;
  originalPrice: number;
  offeredPrice: number;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  counterPrice?: number;
  messages: { sender: 'user' | 'seller'; text: string; price?: number; timestamp: string }[];
}

export interface MandiPriceItem {
  id: string;
  commodity: string;
  variety: string;
  mandiName: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number; // ₹ / Quintal
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  date: string;
}

export interface TreatmentScheduleItem {
  id: string;
  cropName: string;
  diseaseName: string;
  activeIngredient: string;
  brandNames: string[];
  dosagePerAcre: string; // e.g. "500g in 200L water"
  applicationMethod: string;
  sprayingIntervalDays: number;
  preHarvestIntervalDays: number;
  safetyLevel: 'Organic Safe' | 'Moderate Precaution' | 'Strict Safety Kit Required';
}

export interface CommunityPost {
  id: string;
  farmerName: string;
  villageState: string;
  avatarUrl: string;
  category: 'Crop Pathology' | 'Live Mandi Price' | 'Organic Farming' | 'Livestock Care' | 'Equipment Share';
  title: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  userLiked?: boolean;
  timestamp: string;
  verifiedSolution?: boolean;
}

