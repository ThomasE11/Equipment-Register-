
export interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  location: string;
  manufacturer?: string;
  serialNumber?: string;
  modelNumber?: string;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceInterval?: number;
  warrantyExpiration?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'DECOMMISSIONED' | 'IN_SERVICE' | 'OUT_OF_ORDER';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NEEDS_REPAIR';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
  maintenanceRecords?: MaintenanceRecord[];
}

export interface Image {
  id: string;
  filename: string;
  url: string;
  size?: number;
  mimeType?: string;
  description?: string;
  isPrimary: boolean;
  createdAt: Date;
  equipmentId: string;
}

export interface MaintenanceRecord {
  id: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING' | 'REPAIR' | 'REPLACEMENT' | 'UPGRADE' | 'EMERGENCY';
  description: string;
  performedDate: Date;
  performedBy?: string;
  cost?: number;
  notes?: string;
  nextDueDate?: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  equipmentId: string;
}

export interface EquipmentFormData {
  name: string;
  type: string;
  description?: string;
  location: string;
  manufacturer?: string;
  serialNumber?: string;
  modelNumber?: string;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceInterval?: number;
  warrantyExpiration?: Date;
  status: Equipment['status'];
  condition: Equipment['condition'];
  notes?: string;
}

export interface AIAnalysisResult {
  equipmentName?: string;
  equipmentType?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  description?: string;
  maintenanceDate?: string;
  warrantyInfo?: string;
  confidence: number;
  extractedText?: string;
}

export interface EquipmentStats {
  total: number;
  maintenanceDue: number;
  overdue: number;
  byLocation: Record<string, number>;
  byStatus: Record<string, number>;
}

export const EQUIPMENT_LOCATIONS = [
  'Lab B153 (B Block)',
  'Lab 102 (B Block)',
  'Lab 104 (B Block)',
  'Lab FC04 (D Block)',
  'Lab B258 - Gynecology and Obstetrics Lab (B Block)',
  // Import locations from CSV data
  'B102',
  'B103', 
  'GC-1',
  'B102 & GC-1',
  'B102 &GC-1',
  'B102 / B103 / GC-1',
  // Legacy locations (for migration)
  'Lab 1',
  'Lab 2', 
  'Lab 3',
  'Lab 4',
  'Lab 5',
  'Lab 6'
] as const;

export const EQUIPMENT_TYPES = [
  'Monitor',
  'Simulator',
  'Diagnostic Tool',
  'Mannequin',
  'Jump Bag',
  'Defibrillator',
  'Ventilator',
  'IV Pump',
  'Stretcher',
  'Oxygen Equipment',
  'Other'
] as const;

export type EquipmentLocation = typeof EQUIPMENT_LOCATIONS[number];
export type EquipmentType = typeof EQUIPMENT_TYPES[number];

// User and Authentication Types
export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  emailVerified?: Date;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'USER' | 'ADMIN';

// =====================================================
// COMPREHENSIVE LAB MANAGEMENT SYSTEM TYPES
// =====================================================

// 1. PROCUREMENT SYSTEM
export interface ProcurementRequest {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: ProcurementPriority;
  status: ProcurementStatus;
  estimatedCost?: number;
  actualCost?: number;
  quantity: number;
  justification?: string;
  supplier?: string;
  orderNumber?: string;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  requestedById: string;
  requestedBy?: User;
  equipmentId?: string;
  equipment?: Equipment;
  wishListItems?: WishListItem[];
}

export interface WishList {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  items?: WishListItem[];
}

export interface WishListItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  priority: ProcurementPriority;
  estimatedCost?: number;
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  wishListId: string;
  wishList?: WishList;
  procurementRequestId?: string;
  procurementRequest?: ProcurementRequest;
}

export type ProcurementPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProcurementStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ORDERED' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';

// 2. ENHANCED MAINTENANCE
export interface ContactPerson {
  id: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  equipment?: Equipment[];
}

export interface Manufacturer {
  id: string;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  supportEmail?: string;
  supportPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  equipment?: Equipment[];
}

// 3. CONSUMABLES MANAGEMENT
export interface Consumable {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost?: number;
  totalValue?: number;
  supplier?: string;
  location?: string;
  expiryDate?: Date;
  batchNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  categoryDetails?: ConsumableCategory;
  categoryId?: string;
  wishListItems?: ConsumableWishListItem[];
}

export interface ConsumableCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  consumables?: Consumable[];
}

export interface ConsumableWishList {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  items?: ConsumableWishListItem[];
}

export interface ConsumableWishListItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  priority: ProcurementPriority;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  wishListId: string;
  wishList?: ConsumableWishList;
  consumableId?: string;
  consumable?: Consumable;
}

// 4. RESERVATION/RENTAL SYSTEM
export interface Reservation {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: ReservationStatus;
  purpose?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  equipmentId: string;
  equipment?: Equipment;
  userId: string;
  user?: User;
  checkInOut?: CheckInOut[];
}

export interface CheckInOut {
  id: string;
  type: CheckType;
  timestamp: Date;
  condition?: string;
  notes?: string;
  images: string[];
  createdAt: Date;
  reservationId: string;
  reservation?: Reservation;
  userId: string;
  user?: User;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
export type CheckType = 'CHECK_IN' | 'CHECK_OUT';

// 5. DOCUMENT REPOSITORY
export interface Document {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  description?: string;
  category: DocumentCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  uploadedById: string;
  uploadedBy?: User;
}

export type DocumentCategory = 'INVOICE' | 'RECEIPT' | 'MANUAL' | 'WARRANTY' | 'SERVICE_RECORD' | 'CERTIFICATE' | 'POLICY' | 'PROCEDURE' | 'TRAINING' | 'OTHER';

// EXTENDED EQUIPMENT INTERFACE
export interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  location: string;
  manufacturer?: string;
  serialNumber?: string;
  modelNumber?: string;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceInterval?: number;
  warrantyExpiration?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'DECOMMISSIONED' | 'IN_SERVICE' | 'OUT_OF_ORDER';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NEEDS_REPAIR';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Enhanced maintenance fields
  contactPersonId?: string;
  manufacturerId?: string;
  
  // Relations
  images?: Image[];
  maintenanceRecords?: MaintenanceRecord[];
  contactPerson?: ContactPerson;
  manufacturerDetails?: Manufacturer;
  reservations?: Reservation[];
  procurementRequests?: ProcurementRequest[];
}

// EXTENDED USER INTERFACE
export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  emailVerified?: Date;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  
  // New relations
  procurementRequests?: ProcurementRequest[];
  wishLists?: WishList[];
  consumableWishLists?: ConsumableWishList[];
  reservations?: Reservation[];
  checkInOuts?: CheckInOut[];
  documents?: Document[];
}

// CONSUMABLE CATEGORIES
export const CONSUMABLE_CATEGORIES = [
  'Bandages & Dressings',
  'IV Supplies',
  'Medications',
  'Diagnostic Supplies',
  'Airway Management',
  'Cardiac Supplies',
  'Trauma Supplies',
  'Infection Control',
  'Miscellaneous'
] as const;

export type ConsumableCategoryType = typeof CONSUMABLE_CATEGORIES[number];

// PROCUREMENT CATEGORIES
export const PROCUREMENT_CATEGORIES = [
  'Medical Equipment',
  'Training Equipment',
  'Consumables',
  'Technology',
  'Furniture',
  'Maintenance Supplies',
  'Safety Equipment',
  'Other'
] as const;

export type ProcurementCategoryType = typeof PROCUREMENT_CATEGORIES[number];

// DOCUMENT TAGS
export const DOCUMENT_TAGS = [
  'Equipment',
  'Maintenance',
  'Procurement',
  'Training',
  'Safety',
  'Compliance',
  'Financial',
  'Technical',
  'Administrative'
] as const;

export type DocumentTagType = typeof DOCUMENT_TAGS[number];

// STATS INTERFACES
export interface ProcurementStats {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface ConsumableStats {
  total: number;
  lowStock: number;
  expired: number;
  byCategory: Record<string, number>;
  totalValue: number;
}

export interface ReservationStats {
  total: number;
  active: number;
  overdue: number;
  upcoming: number;
  byStatus: Record<string, number>;
}

export interface DocumentStats {
  total: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  totalSize: number;
}

// NextAuth types
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
  }
}
