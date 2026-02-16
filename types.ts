
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
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED'
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
  pkgCode: string; 
  description: string;
  weight: number;
  volume: number;
  customerId: string;
  shipmentId?: string;
  locationCode: string;
  status: PackageStatus;
}

export interface Shipment {
  id: string;
  trackingNo: string;
  status: ShipmentStatus;
  approvalStatus: 'draft' | 'approved' | 'rejected';
  quotedPrice: number;
  currency: 'USD' | 'TZS' | 'CNY';
  originRegion: 'CN' | 'TZ';
  destinationRegion: 'CN' | 'TZ';
  createdAt: string;
}
