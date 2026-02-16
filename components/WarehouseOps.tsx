
import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Download, 
  Upload, 
  MapPin, 
  CheckSquare, 
  ArrowRightLeft,
  Scan,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Scanning } from './Scanning';

type OpsMode = 'IDLE' | 'STAGE' | 'DISPATCH' | 'RECEIVE' | 'RELEASE' | 'MOVE';

export const WarehouseOps: React.FC = () => {
  const [mode, setMode] = useState<OpsMode>('IDLE');

  const opsCards = [
    {
      id: 'STAGE',
      title: 'Staging (Outgoing)',
      description: 'Scan packages to assign to a container/shipment.',
      icon: <Upload className="w-6 h-6 text-blue-500" />,
      category: 'Outgoing'
    },
    {
      id: 'DISPATCH',
      title: 'Confirm Dispatch',
      description: 'Bulk scan containers for departure (Payment Check).',
      icon: <Truck className="w-6 h-6 text-indigo-500" />,
      category: 'Outgoing'
    },
    {
      id: 'RECEIVE',
      title: 'Confirm Receipt',
      description: 'Scan incoming items & assign warehouse location.',
      icon: <Download className="w-6 h-6 text-emerald-500" />,
      category: 'Incoming'
    },
    {
      id: 'MOVE',
      title: 'Inventory Move',
      description: 'Update physical location of a package.',
      icon: <ArrowRightLeft className="w-6 h-6 text-amber-500" />,
      category: 'Inventory'
    },
    {
      id: 'RELEASE',
      title: 'Customer Release',
      description: 'Final scan before handing over to customer.',
      icon: <CheckSquare className="w-6 h-6 text-purple-500" />,
      category: 'Release'
    }
  ];

  if (mode !== 'IDLE') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setMode('IDLE')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Ops Hub
        </button>
        <Scanning mode={mode} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Scan className="text-slate-900" /> Warehouse Operations Hub
          </h2>
          <p className="text-gray-500 text-sm">Select a workflow to begin scanning operations.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Region: GZ Port (CN)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opsCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setMode(card.id as OpsMode)}
            className="flex flex-col text-left bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="p-3 bg-gray-50 rounded-xl mb-4 group-hover:bg-blue-50 transition-colors">
              {card.icon}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.category}</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{card.description}</p>
            <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Scanner <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* UX & Strategy Guidelines */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">Scanning UX Rules</h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0">1</div>
              <p><strong>Auto-Focus:</strong> Mobile app automatically triggers camera focus on QR/Barcodes upon loading the mode.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0">2</div>
              <p><strong>Feedback Loop:</strong> Successful scans trigger a high-pitch beep and green haptic vibration; errors trigger a low-pitch tone.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0">3</div>
              <p><strong>Offline-First:</strong> Scans are cached locally (IndexedDB) and synced once the warehouse 5G/Wi-Fi is re-established.</p>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">Safety & Validation</h3>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
             <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-[10px] uppercase">
               <AlertCircle className="w-4 h-4" /> State Guard
             </div>
             <p className="text-[11px] text-slate-300 leading-relaxed">
               Every scan is validated server-side against the current Master Waybill state. 
               System blocks "Duplicate Scans" and "Orphan Packages" (items not assigned to an approved shipment).
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
