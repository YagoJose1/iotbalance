// Core Types for IoT Balance System

export type DeviceStatus = 'provisioned' | 'active' | 'offline' | 'maintenance' | 'retired';
export type AlertStatus = 'open' | 'acknowledged' | 'closed';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type OrderStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'received' | 'canceled';
export type NotificationChannel = 'panel' | 'email' | 'sms' | 'webhook';
export type RefillMethod = 'swap' | 'refill';
export type PolicyScopeType = 'organization' | 'location' | 'device' | 'product' | 'container';
export type PolicyRuleType = 'percent' | 'weight' | 'eta_days';
export type AuditActorType = 'user' | 'system';

// Organization & Structure
export interface MqttConfig {
  broker: string;
  port: number;
  username?: string;
  password?: string;
  topicPrefix: string;
  useTls: boolean;
}

export interface Organization {
  id: string;
  name: string;
  cnpj?: string;
  status: 'active' | 'inactive';
  mqttConfig?: MqttConfig;
  createdAt: string;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  timezone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Zone {
  id: string;
  locationId: string;
  name: string;
  description?: string;
}

// User & Permissions
export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

// Devices
export interface Device {
  id: string;
  organizationId: string;
  locationId: string;
  zoneId?: string;
  serial: string;
  model: string;
  firmwareVersion: string;
  status: DeviceStatus;
  lastSeenAt?: string;
  batteryLevel?: number; // 0-1
  rssi?: number;
  calibrationFactor: number;
  offset: number;
  unit: 'g' | 'kg';
  minReportingIntervalS: number;
  maxReportingIntervalS: number;
  minWeight?: number;
  maxWeight?: number;
  lowLevelPercent?: number;
  criticalLevelPercent?: number;
  createdAt: string;
  // Current assignment
  currentProduct?: Product;
  currentContainer?: Container;
  currentWeight?: number;
  currentPercent?: number;
  predictedRunoutAt?: string;
}

// Products & Containers
export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  densityKgPerL?: number;
  unitLabel: string;
  active: boolean;
  createdAt: string;
}

export interface Container {
  id: string;
  organizationId: string;
  name: string;
  tareWeightG: number;
  capacityG?: number;
  capacityL?: number;
  material: string;
  reusable: boolean;
  active: boolean;
  createdAt: string;
}

export interface DeviceAssignment {
  id: string;
  deviceId: string;
  productId: string;
  containerId: string;
  startedAt: string;
  endedAt?: string;
}

// Policies & Alerts
export interface ThresholdPolicy {
  id: string;
  organizationId: string;
  name: string;
  scopeType: PolicyScopeType;
  scopeId?: string;
  ruleType: PolicyRuleType;
  ruleValue: number;
  hysteresisValue: number;
  evaluateEveryS: number;
  minDurationS: number;
  active: boolean;
  priority: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  organizationId: string;
  deviceId: string;
  policyId: string;
  status: AlertStatus;
  severity: AlertSeverity;
  openedAt: string;
  acknowledgedAt?: string;
  closedAt?: string;
  reasonCode: string;
  message: string;
  // Extended data
  device?: Device;
  policy?: ThresholdPolicy;
  location?: Location;
}

export interface Notification {
  id: string;
  alertId: string;
  channel: NotificationChannel;
  target: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  responseCode?: string;
  retries: number;
}

// Refill & Orders
export interface RefillEvent {
  id: string;
  deviceId: string;
  userId?: string;
  eventAt: string;
  quantityG: number;
  method: RefillMethod;
  notes?: string;
  // Extended
  device?: Device;
  user?: User;
}

export interface Order {
  id: string;
  organizationId: string;
  locationId: string;
  status: OrderStatus;
  totalQtyG: number;
  vendorId?: string;
  createdBy: string;
  createdAt: string;
  items: OrderItem[];
  // Extended
  location?: Location;
  vendor?: Vendor;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  qtyG: number;
  unitPrice?: number;
  // Extended
  product?: Product;
}

export interface Vendor {
  id: string;
  organizationId: string;
  name: string;
  cnpj?: string;
  contactInfo: string;
}

// Telemetry & Analytics
export interface SensorReading {
  id: string;
  deviceId: string;
  readingAt: string;
  grossWeightG: number;
  netWeightG: number;
  temperatureC?: number;
  flags?: Record<string, any>;
}

export interface ConsumptionStat {
  id: string;
  deviceId: string;
  periodStart: string;
  periodEnd: string;
  avgConsumptionGPerH: number;
  predictedRunoutAt?: string;
}

// OTA & Maintenance
export interface OTAFirmware {
  id: string;
  model: string;
  version: string;
  fileUrl: string;
  checksum: string;
  releaseNotes: string;
  createdAt: string;
}

export interface OTAJob {
  id: string;
  firmwareId: string;
  organizationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  scheduledFor: string;
  createdBy: string;
  createdAt: string;
  targets: OTAJobTarget[];
}

export interface OTAJobTarget {
  jobId: string;
  deviceId: string;
  status: 'pending' | 'downloading' | 'applying' | 'completed' | 'failed';
  appliedAt?: string;
  errorMsg?: string;
}

// Webhooks
export interface WebhookSubscription {
  id: string;
  organizationId: string;
  url: string;
  secret: string;
  eventTypes: string[];
  active: boolean;
}

// Audit
export interface AuditLog {
  id: string;
  organizationId: string;
  actorType: AuditActorType;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  dataBefore?: Record<string, any>;
  dataAfter?: Record<string, any>;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  criticalAlerts: number;
  warningAlerts: number;
  avgBatteryLevel: number;
  devicesRunningLow: number;
}

// Chart data
export interface WeightDataPoint {
  timestamp: string;
  weight: number;
  percent: number;
}
