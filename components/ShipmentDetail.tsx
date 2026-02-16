
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
  Info
} from 'lucide-react';
import { ShipmentStatus, PackageStatus, UserRole, ExpenseStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ShipmentDetailProps {
  shipmentId: string;
  onBack: () => void;
}

export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onBack }) => {
  // Mock data representing a waybill in the "Ready for Dispatch" phase
  const [shipment] = useState({
    id: shipmentId,
    trackingNo: shipmentId,
    origin: 'Guangzhou (CN)',
    destination: 'Dar es Salaam (TZ)',
    customer: { name: 'Tanzania Importers Ltd', phone: '+255 712 345 678' },
    status: ShipmentStatus.READY_FOR_DISPATCH,
    approvalStatus: 'Approved',
    paymentStatus: 'Paid',
    invoice: { id: 'INV-77281', amount: 4500, currency: 'USD', status: 'Paid', paidAt: '2024-05-19 10:15' },
    packages: [
      { id: 'PKG-20240518-001', desc: 'Solar Panels (Pallet)', weight: '120kg', dim: '1.2x1.0x0.8m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
      { id: 'PKG-20240518-002', desc: 'Battery Inverters', weight: '45kg', dim: '0.6x0.6x0.4m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
      { id: 'PKG-20240518-003', desc: 'Mounting Rails', weight: '85kg', dim: '3.0x0.2x0.2m', status: PackageStatus.STAGED, location: 'CN-GZ-B1' },
    ],
    expenses: [
      { id: 'EXP-901', title: 'Loading Labor', amount: 150, currency: 'USD', status: ExpenseStatus.FUNDED, reason: '' },
    ],
    audit: [
      { id: 'A1', event: 'Payment Confirmed', actor: 'Sarah M. (Finance)', time: '2024-05-19 10:15' },
      { id: 'A2', event: 'Approved by Admin', actor: 'James K. (Admin)', time: '2024-05-18 14:20' },
      { id: 'A3', event: 'Status Updated: READY_FOR_DISPATCH (All Packages Staged)', actor: 'System', time: '2024-05-18 11:45' },
    ]
  });

  const packageCounts = useMemo(() => {
    const total = shipment.packages.length;
    return {
      total,
      staged: shipment.packages.filter(p => p.status === PackageStatus.STAGED).length,
      received: shipment.packages.filter(p => p.status === PackageStatus.ARRIVED || p.status === PackageStatus.LOCATED).length,
      released: shipment.packages.filter(p => p.status === PackageStatus.RELEASED).length,
    };
  }, [shipment.packages]);

  // Derived Logic for Automated Transition Rules
  const logicFlags = {
    isPaid: shipment.paymentStatus === 'Paid',
    isAdminApproved: shipment.approvalStatus === 'Approved',
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
          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
            {shipment.origin} <ArrowRight className="w-3 h-3" /> {shipment.destination}
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-gray-100">
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">State Integrity</p>
           <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Locked by Workflow</span>
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
                {shipment.packages.map((pkg) => (
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
              {shipment.audit.map((log) => (
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
            
            {/* Action 1: STAGE */}
            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canStage || logicFlags.isAllStaged}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              >
                <Scan className="w-4 h-4" /> STAGE PACKAGES
              </button>
              {(!logicFlags.canStage || logicFlags.isAllStaged) && (
                <div className="absolute bottom-full mb-2 left-0 right-0 hidden group-hover/btn:block bg-slate-900 text-white p-2 rounded text-[9px] text-center shadow-xl z-50">
                  {logicFlags.isAllStaged ? 'All items staged. Shipment auto-moved to "Ready for Dispatch".' : 'Staging only available for Approved shipments.'}
                </div>
              )}
            </div>

            {/* Action 2: DISPATCH */}
            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canDispatch || !logicFlags.isPaid}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-md"
              >
                <Truck className="w-4 h-4" /> CONFIRM DISPATCH
              </button>
              {(!logicFlags.canDispatch || !logicFlags.isPaid) && (
                <div className="absolute bottom-full mb-2 left-0 right-0 hidden group-hover/btn:block bg-slate-900 text-white p-2 rounded text-[9px] text-center shadow-xl z-50">
                   {!logicFlags.isPaid 
                    ? 'Dispatch Blocked: Payment not confirmed by Finance.' 
                    : 'Dispatch Blocked: Shipment not in "Ready for Dispatch" state.'}
                </div>
              )}
            </div>

            {/* Action 3: RECEIVE */}
            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canReceive}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 transition-all"
              >
                <MapPin className="w-4 h-4" /> RECEIVE AT DESTINATION
              </button>
              {!logicFlags.canReceive && (
                <div className="absolute bottom-full mb-2 left-0 right-0 hidden group-hover/btn:block bg-slate-900 text-white p-2 rounded text-[9px] text-center shadow-xl z-50">
                   Only available for shipments in "In Transit" status.
                </div>
              )}
            </div>

            {/* Action 4: RELEASE */}
            <div className="relative group/btn">
              <button 
                disabled={!logicFlags.canRelease || !logicFlags.isAllReceived}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              >
                <CheckSquare className="w-4 h-4" /> RELEASE TO CUSTOMER
              </button>
              {(!logicFlags.canRelease || !logicFlags.isAllReceived) && (
                <div className="absolute bottom-full mb-2 left-0 right-0 hidden group-hover/btn:block bg-slate-900 text-white p-2 rounded text-[9px] text-center shadow-xl z-50">
                   {!logicFlags.isAllReceived 
                    ? 'Release Blocked: Some packages are not yet received at warehouse.' 
                    : 'Shipment must be in "Ready for Release" state.'}
                </div>
              )}
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
              <p className="text-[10px] text-slate-500 leading-tight">
                Status is controlled exclusively by the Finance module. Ops cannot modify payment records.
              </p>
            </div>
          </div>

          {/* Expenses Quick Access */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Shipment Expenses</h3>
            <div className="space-y-2">
               {shipment.expenses.map(e => (
                 <div key={e.id} className="flex justify-between text-[11px] py-1 border-b border-gray-50">
                    <span className="text-gray-600">{e.title}</span>
                    <span className="font-bold text-gray-900">{e.currency} {e.amount}</span>
                 </div>
               ))}
               <button className="w-full mt-2 py-2 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-dashed border-gray-200 hover:bg-gray-100 hover:text-gray-600 transition-all">
                 + Submit Expense
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
