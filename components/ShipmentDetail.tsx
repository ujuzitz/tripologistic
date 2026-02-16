
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  User, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  MoreHorizontal,
  MapPin,
  CreditCard,
  Phone,
  Clock,
  ExternalLink,
  Plus,
  ShieldCheck,
  Receipt,
  Wallet,
  Scan,
  CheckSquare,
  ArrowRight,
  Lock,
  Info,
  Printer
} from 'lucide-react';
import { ShipmentStatus, PackageStatus, UserRole, ExpenseStatus, Shipment } from '../types';
import { STATUS_COLORS } from '../constants';
import { TrackingLabel } from './TrackingLabel';

interface ShipmentDetailProps {
  shipmentId: string;
  onBack: () => void;
}

export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onBack }) => {
  // Mock data representing a waybill in the "Ready for Dispatch" phase
  const [shipment] = useState<Shipment>({
    id: shipmentId,
    trackingNo: shipmentId,
    originRegion: 'CN',
    destinationRegion: 'TZ',
    customerName: 'Tanzania Importers Ltd',
    customerPhone: '+255 712 345 678',
    status: ShipmentStatus.READY_FOR_DISPATCH,
    approvalStatus: 'approved',
    paymentStatus: 'Paid',
    quotedPrice: 4500,
    currency: 'USD',
    createdAt: '2024-05-18',
    packageCount: 3
  });

  const packages = [
    { id: 'PKG-20240518-001', desc: 'Solar Panels (Pallet)', weight: '120kg', dim: '1.2x1.0x0.8m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
    { id: 'PKG-20240518-002', desc: 'Battery Inverters', weight: '45kg', dim: '0.6x0.6x0.4m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
    { id: 'PKG-20240518-003', desc: 'Mounting Rails', weight: '85kg', dim: '3.0x0.2x0.2m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
  ];

  const expenses = [
    { id: 'EXP-901', title: 'Loading Labor', amount: 150, currency: 'USD', status: ExpenseStatus.FUNDED, reason: '' },
  ];

  const audit = [
    { id: 'A1', event: 'Payment Confirmed', actor: 'Sarah M. (Finance)', time: '2024-05-19 10:15' },
    { id: 'A2', event: 'Approved by Admin', actor: 'James K. (Admin)', time: '2024-05-18 14:20' },
    { id: 'A3', event: 'Status Updated: READY_FOR_DISPATCH (All Packages Staged)', actor: 'System', time: '2024-05-18 11:45' },
  ];

  const packageCounts = useMemo(() => {
    const total = packages.length;
    return {
      total,
      staged: packages.filter(p => p.status === PackageStatus.STAGED).length,
      received: packages.filter(p => p.status === PackageStatus.ARRIVED || p.status === PackageStatus.LOCATED).length,
      released: packages.filter(p => p.status === PackageStatus.RELEASED).length,
    };
  }, [packages]);

  // Derived Logic for Automated Transition Rules
  const logicFlags = {
    isPaid: shipment.paymentStatus === 'Paid',
    isAdminApproved: shipment.approvalStatus === 'approved',
    isAllStaged: packageCounts.staged === packageCounts.total,
    isAllReceived: packageCounts.received === packageCounts.total,
    isAllReleased: packageCounts.released === packageCounts.total,
    canStage: shipment.status === ShipmentStatus.APPROVED && !shipment.id.startsWith('DRAFT'),
    canDispatch: shipment.status === ShipmentStatus.READY_FOR_DISPATCH,
    canReceive: shipment.status === ShipmentStatus.IN_TRANSIT,
    canRelease: shipment.status === ShipmentStatus.READY_FOR_RELEASE || shipment.status === ShipmentStatus.RECEIVED
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Shipment Header - NO MANUAL STATUS DROPDOWN */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{shipment.id}</h2>
            <div className="flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[shipment.status]}`}>
                {shipment.status.replace(/_/g, ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                logicFlags.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {shipment.paymentStatus}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1 font-mono">
            {shipment.originRegion} <ArrowRight className="w-3 h-3" /> {shipment.destinationRegion}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" /> PRINT LABEL
          </button>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-gray-100 hidden md:block">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">State Integrity</p>
            <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Locked by Workflow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          
          {/* Transition Rule Awareness - Informs the user why they can/cannot act */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4">
             <Info className="w-5 h-5 text-blue-600 shrink-0" />
             <div className="text-[11px] text-blue-800 space-y-1">
                <p className="font-bold uppercase tracking-wider">Automated Transition Logic</p>
                <div className="grid grid-cols-2 gap-x-8">
                   <p className={logicFlags.isAllStaged ? 'text-blue-700 font-bold' : 'text-blue-400'}>
                     {logicFlags.isAllStaged ? '✓' : '○'} Staging: {packageCounts.staged}/{packageCounts.total} items staged.
                   </p>
                   <p className={logicFlags.isPaid ? 'text-blue-700 font-bold' : 'text-blue-400'}>
                     {logicFlags.isPaid ? '✓' : '○'} Payment: {shipment.paymentStatus}.
                   </p>
                </div>
                <p className="text-[10px] italic mt-2 opacity-80">
                  Note: Status moves to "In Transit" only after <strong>Payment is Received</strong> and <strong>Dispatch is Confirmed</strong>.
                </p>
             </div>
          </div>

          {/* Package Inventory */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" /> Package Progress
              </h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Internal Code</th>
                  <th className="px-6 py-3">Current Status</th>
                  <th className="px-6 py-3">Location Code</th>
                  <th className="px-6 py-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{pkg.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        pkg.status === PackageStatus.STAGED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-400">{pkg.location}</td>
                    <td className="px-6 py-4 text-right">
                       {pkg.status === PackageStatus.STAGED ? <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" /> : <Circle className="w-4 h-4 text-gray-200 ml-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Log (Read Only) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <ShieldCheck className="w-4 h-4 text-slate-800" /> System Integrity Log
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {audit.map((log) => (
                <div key={log.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-[11px] font-bold text-gray-700">{log.event}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS PANEL - STRICTLY GATED BY STATUS & PROGRESS */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Workflow Actions</h3>
            
            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canStage || logicFlags.isAllStaged}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              >
                <Scan className="w-4 h-4" /> STAGE PACKAGES
              </button>
            </div>

            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canDispatch || !logicFlags.isPaid}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-md"
              >
                <Truck className="w-4 h-4" /> CONFIRM DISPATCH
              </button>
            </div>

            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canReceive}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 transition-all"
              >
                <MapPin className="w-4 h-4" /> RECEIVE AT DESTINATION
              </button>
            </div>

            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canRelease || !logicFlags.isAllReceived}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              >
                <CheckSquare className="w-4 h-4" /> RELEASE TO CUSTOMER
              </button>
            </div>
          </div>

          {/* Finance Panel (Immutable for Ops) */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Receipt className="w-3 h-3" /> Financial Control
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Payment Confirmation</p>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                  logicFlags.isPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {logicFlags.isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase">{shipment.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Label for Printing */}
      <div className="hidden">
        <TrackingLabel shipment={shipment} />
      </div>
    </div>
  );
};
