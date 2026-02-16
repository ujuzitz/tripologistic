
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  Receipt, 
  Wallet, 
  History, 
  Scan, 
  ShieldCheck,
  GitBranch,
  Lock,
  Code2,
  Database,
  PieChart,
  FileText
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE', 'OPS_CHINA', 'OPS_TANZANIA'] },
  { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE', 'OPS_CHINA', 'OPS_TANZANIA'] },
  { id: 'finance-dashboard', label: 'Finance Hub', icon: <PieChart className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE'] },
  { id: 'shipments', label: 'Shipments', icon: <Truck className="w-5 h-5" />, roles: ['ADMIN', 'OPS_CHINA', 'OPS_TANZANIA', 'FINANCE'] },
  { id: 'packages', label: 'Inventory', icon: <Package className="w-5 h-5" />, roles: ['ADMIN', 'OPS_CHINA', 'OPS_TANZANIA'] },
  { id: 'workflow', label: 'Workflow Rules', icon: <GitBranch className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE'] },
  { id: 'scanning', label: 'Warehouse Ops', icon: <Scan className="w-5 h-5" />, roles: ['OPS_CHINA', 'OPS_TANZANIA', 'ADMIN'] },
  { id: 'invoices', label: 'Billing', icon: <Receipt className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE'] },
  { id: 'expenses', label: 'Expense Flow', icon: <Wallet className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE', 'OPS_CHINA', 'OPS_TANZANIA'] },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" />, roles: ['ADMIN', 'FINANCE'] },
  { id: 'audit', label: 'Forensic Audit', icon: <History className="w-5 h-5" />, roles: ['ADMIN'] },
  { id: 'authorization', label: 'Auth Model', icon: <Lock className="w-5 h-5" />, roles: ['ADMIN'] },
  { id: 'db-enforcement', label: 'DB Enforcement', icon: <Database className="w-5 h-5" />, roles: ['ADMIN'] },
  { id: 'api-spec', label: 'API Specification', icon: <Code2 className="w-5 h-5" />, roles: ['ADMIN'] },
  { id: 'architecture', label: 'Architecture', icon: <ShieldCheck className="w-5 h-5" />, roles: ['ADMIN'] },
];

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  READY_FOR_DISPATCH: 'bg-indigo-100 text-indigo-800',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-purple-100 text-purple-800',
  READY_FOR_RELEASE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  PENDING_PAYMENT: 'bg-red-100 text-red-800',
  PAYMENT_RECEIVED: 'bg-green-100 text-green-800',
};
