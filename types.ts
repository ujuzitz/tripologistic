
export enum UserRole {
  OPS_CHINA = 'OPS_CHINA',
  OPS_TANZANIA = 'OPS_TANZANIA',
  FINANCE = 'FINANCE',
  ADMIN = 'ADMIN'
}

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  READY_FOR_DISPATCH = 'READY_FOR_DISPATCH',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  COMPLETED = 'COMPLETED'
}

export enum PackageStatus {
  SCANNED = 'SCANNED',
  STAGED = 'STAGED',
  DISPATCHED = 'DISPATCHED',
  ARRIVED = 'ARRIVED',
  LOCATED = 'LOCATED',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  RELEASED = 'RELEASED'
}

export enum AuditEventType {
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  SHIPMENT_STATUS_CHANGE = 'SHIPMENT_STATUS_CHANGE',
  PRICE_MODIFIED = 'PRICE_MODIFIED',
  PKG_SCAN_EVENT = 'PKG_SCAN_EVENT',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  EXPENSE_SUBMITTED = 'EXPENSE_SUBMITTED',
  EXPENSE_APPROVED = 'EXPENSE_APPROVED',
  FUNDING_RELEASED = 'FUNDING_RELEASED',
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  PKG_LOCATION_ASSIGNED = 'PKG_LOCATION_ASSIGNED',
  PKG_RELEASED = 'PKG_RELEASED',
  SHIPMENT_LABEL_PRINTED = 'SHIPMENT_LABEL_PRINTED',
  SHIPMENT_PRICE_LOCKED = 'SHIPMENT_PRICE_LOCKED'
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  eventType: AuditEventType;
  entityType: 'SHIPMENT' | 'PACKAGE' | 'INVOICE' | 'EXPENSE' | 'CUSTOMER';
  entityId: string;
  action: string;
  payload: {
    before?: any;
    after?: any;
    metadata?: any;
  };
  integrityHash: string;
}

export enum InvoiceStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED'
}

export enum ExpenseStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FUNDED = 'FUNDED'
}

export interface Warehouse {
  id: string;
  name: string;
  region: 'CN' | 'TZ';
  code: string;
}

export interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  region: 'CN' | 'TZ';
  createdAt: string;
  createdBy: string;
  balance: number;
}

export interface Package {
  id: string;
  pkgCode?: string; 
  name: string;
  description: string;
  weight: number;
  volume: number;
  qty: number;
  dimensions?: string;
  notes?: string;
  customerId: string;
  customerName?: string;
  shipmentId?: string;
  shipmentTrackingNo?: string;
  warehouseId: string;
  locationCode?: string;
  status: PackageStatus;
  receivedAt?: string;
}

export interface AdditionalCharge {
  name: string;
  amount: number;
}

export interface Shipment {
  id: string;
  trackingNo: string;
  status: ShipmentStatus;
  approvalStatus: 'draft' | 'approved' | 'rejected';
  
  // Pricing Fields
  pricingType: 'flat' | 'package' | 'weight' | 'custom';
  basePrice: number;
  currency: 'USD' | 'TZS' | 'CNY';
  additionalCharges: AdditionalCharge[];
  discountValue: number;
  discountType: 'amount' | 'percent';
  finalTotal: number;
  pricingNotes?: string;
  priceLocked: boolean;
  priceLockedAt?: string;
  priceLockedBy?: string;

  quotedPrice: number; // Legacy, kept for compatibility
  originRegion: 'CN' | 'TZ';
  destinationRegion: 'CN' | 'TZ';
  createdAt: string;
  paymentStatus: 'Unpaid' | 'Paid';
  customerName?: string;
  customerPhone?: string;
  packageCount?: number;
}
