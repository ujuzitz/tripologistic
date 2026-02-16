
import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  Network, 
  Lock, 
  Key, 
  Eye, 
  Layers, 
  Globe,
  Table as TableIcon,
  Zap,
  DollarSign,
  History
} from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Technical Architecture Document</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">Core services and database schema for the SinoTan logistics framework.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audit & Compliance Engine */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <History className="w-6 h-6" />
              <h3 className="text-xl font-bold">1. Audit & Forensic Engine</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <strong>Immutable Log:</strong> Append-only postgres table with <code>sha256</code> row-hash chaining to detect tampering.
              </li>
              <li className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <strong>State Snapshots:</strong> Every mutation stores <code>payload.before</code> and <code>payload.after</code> as JSONB.
              </li>
              <li className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <strong>Event Triggers:</strong> High-risk events (e.g. status bypass attempts) trigger external alerts to Admin.
              </li>
            </ul>
          </section>

          {/* Database Schema Summary */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <TableIcon className="w-6 h-6" />
              <h3 className="text-xl font-bold">2. Database Schema (Postgres)</h3>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="font-bold block">shipments</span>
                  id, tracking_no, status, quoted_price, currency
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="font-bold block">audit_logs</span>
                  id, actor_id, event_type, payload (JSONB), hash
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="font-bold block">invoices</span>
                  id, shipment_id (1:1), status (PAID/UNPAID)
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="font-bold block">expenses</span>
                  id, status (APPROVED/FUNDED), created_by
                </div>
              </div>
            </div>
          </section>

          {/* Business Logic Triggers */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Zap className="w-6 h-6" />
              <h3 className="text-xl font-bold">3. Enforcement Triggers</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span><strong>Status Protector:</strong> Prevents status rollback and blocks DISPATCHED if Invoice != PAID.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg text-xs">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span><strong>Profit Calculator:</strong> View: <code>Invoice.amount - SUM(Expenses.amount)</code> normalized to USD.</span>
              </div>
            </div>
          </section>

          {/* Security & Access */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-slate-700">
              <Lock className="w-6 h-6" />
              <h3 className="text-xl font-bold">4. RBAC & Data Ownership</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Ops China', desc: 'Guangzhou/Yiwu scope only.' },
                { title: 'Ops Tanzania', desc: 'Dar es Salaam port scope.' },
                { title: 'Finance', desc: 'Global ledger & payment approval.' },
                { title: 'Audit Trail', desc: 'Immutable log for every DB mutation.' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
