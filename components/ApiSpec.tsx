
import React, { useState } from 'react';
import { 
  Code2, 
  Globe, 
  Lock, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  Terminal,
  Activity,
  Box,
  Truck,
  CreditCard,
  History
} from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  roles: string[];
  scope: string;
  description: string;
  body?: string;
  response: string;
  validation: string[];
}

const apiGroups = [
  {
    title: "Warehouse & Scan Ops",
    icon: <Box className="w-5 h-5" />,
    endpoints: [
      {
        method: 'POST',
        path: '/v1/scan-ops/stage',
        roles: ['Ops (Region)', 'Admin'],
        scope: 'Region Lock',
        description: 'Assigns a package to a shipment container.',
        body: '{ "package_id": "PKG-X", "shipment_id": "SHP-Y" }',
        response: '{ "status": "STAGED", "timestamp": "..." }',
        validation: [
          'Package must be in SCANNED state',
          'Shipment must be in DRAFT or APPROVED state',
          'Actor region must match Package location'
        ]
      },
      {
        method: 'POST',
        path: '/v1/scan-ops/dispatch',
        roles: ['Ops (Origin)', 'Admin'],
        scope: 'Origin Only',
        description: 'Bulk marks shipment as In Transit.',
        body: '{ "shipment_id": "SHP-Y", "carrier_id": "..." }',
        response: '{ "status": "IN_TRANSIT", "dispatched_at": "..." }',
        validation: [
          'Associated Invoice must be PAID',
          'All packages must be STAGED',
          'Shipment must be READY_FOR_DISPATCH'
        ]
      },
      {
        method: 'POST',
        path: '/v1/scan-ops/receive',
        roles: ['Ops (Destination)', 'Admin'],
        scope: 'Destination Only',
        description: 'Confirms arrival at target warehouse.',
        body: '{ "shipment_id": "SHP-Y", "location_code": "TZ-A-01" }',
        response: '{ "status": "ARRIVED", "received_at": "..." }',
        validation: [
          'Shipment must be IN_TRANSIT',
          'Physical scan of Master Waybill required'
        ]
      }
    ]
  },
  {
    title: "Finance & Expenses",
    icon: <CreditCard className="w-5 h-5" />,
    endpoints: [
      {
        method: 'PATCH',
        path: '/v1/invoices/:id/payment',
        roles: ['Finance', 'Admin'],
        scope: 'Global',
        description: 'Confirms funds receipt for a shipment.',
        body: '{ "payment_ref": "BANK-123", "amount": 5000 }',
        response: '{ "status": "PAYMENT_RECEIVED", "invoice_id": "..." }',
        validation: [
          'Amount must match invoice total',
          'Triggers state change for linked Shipment'
        ]
      },
      {
        method: 'POST',
        path: '/v1/expenses/fund',
        roles: ['Finance', 'Admin'],
        scope: 'Global',
        description: 'Disburses funds for approved operational expenses.',
        body: '{ "expense_ids": ["EXP-1", "EXP-2"] }',
        response: '{ "batch_id": "TXN-998", "status": "FUNDED" }',
        validation: [
          'Expense must be APPROVED by Admin',
          'Expense must be in SUBMITTED state'
        ]
      }
    ]
  },
  {
    title: "Audit & Forensic",
    icon: <History className="w-5 h-5" />,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/audit/logs',
        roles: ['Admin'],
        scope: 'Global',
        description: 'Queries the immutable trail with filters.',
        body: 'Query Params: ?entity_id=X&actor_id=Y&start_date=Z',
        response: '{ "data": [...logs], "integrity_verified": true }',
        validation: [
          'Max range 90 days per query',
          'ReadOnly access for compliance reviews'
        ]
      }
    ]
  }
];

export const ApiSpec: React.FC = () => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Warehouse & Scan Ops");

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">REST API v1 Specification</h2>
            <p className="text-gray-500 max-w-2xl">Standardized endpoints for SinoTan internal services and warehouse mobile apps.</p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
               <Globe className="w-3 h-3" /> https://api.sinotan.logistics
             </div>
          </div>
        </div>

        {/* Global Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
              <Lock className="w-4 h-4" /> Auth Strategy
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Bearer Authentication using JWT. Every request must include <code>X-Region-ID</code> header for Ops scoping.
            </p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <Zap className="w-4 h-4" /> Rate Limiting
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              100 req/min for Ops. 1000 req/min for Admin. Burst allowed for bulk scanning operations.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-2">
              <ShieldCheck className="w-4 h-4" /> Validation
            </div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Zod-based schema validation on all inputs. Automatic 403 Forbidden if State Machine rules are violated.
            </p>
          </div>
        </div>

        {/* Endpoint List */}
        <div className="space-y-4">
          {apiGroups.map((group) => (
            <div key={group.title} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setExpandedGroup(expandedGroup === group.title ? null : group.title)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100 text-slate-700">
                    {group.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{group.title}</h3>
                </div>
                {expandedGroup === group.title ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              {expandedGroup === group.title && (
                <div className="divide-y divide-gray-100">
                  {group.endpoints.map((ep, idx) => (
                    <div key={idx} className="p-6 bg-white space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ep.method === 'POST' ? 'bg-blue-600 text-white' : 
                          ep.method === 'GET' ? 'bg-emerald-600 text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {ep.path}
                        </code>
                        <div className="flex gap-1">
                          {ep.roles.map(r => (
                            <span key={r} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">
                              {r}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1">
                          <Activity className="w-3 h-3" /> {ep.scope}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{ep.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase">Request Body</h5>
                          <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[10px] font-mono overflow-x-auto">
                            {ep.body}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase">Validation Rules</h5>
                          <ul className="space-y-1">
                            {ep.validation.map((v, i) => (
                              <li key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                                <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0" />
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
