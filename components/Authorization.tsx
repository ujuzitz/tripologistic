
import React from 'react';
import { 
  ShieldCheck, 
  UserCircle, 
  MapPin, 
  Eye, 
  Lock, 
  Server, 
  Key,
  Database
} from 'lucide-react';

export const Authorization: React.FC = () => {
  const permissions = [
    { action: "Create shipment", roles: ["Admin", "Ops (Region)"] },
    { action: "Approve shipment", roles: ["Admin"] },
    { action: "Create invoice", roles: ["Admin", "Finance"] },
    { action: "Mark payment status", roles: ["Admin", "Finance"] },
    { action: "Record expense", roles: ["Admin", "Ops (Region)"] },
    { action: "Approve expense", roles: ["Admin"] },
    { action: "Fund expense", roles: ["Admin", "Finance"] },
    { action: "Dispatch shipment", roles: ["Ops (Origin) *if paid*"] },
    { action: "Receive shipment", roles: ["Ops (Destination)"] },
    { action: "Stage packages", roles: ["Ops (Region)"] },
    { action: "Release to customer", roles: ["Ops (Destination)"] },
    { action: "View dashboards", roles: ["All (Scoped)"] },
  ];

  const scoping = [
    { module: "Shipments", rule: "Ops see only where Origin or Destination matches their assigned region." },
    { module: "Packages", rule: "Ops visibility limited strictly to the current warehouse location (Region-lock)." },
    { module: "Expenses", rule: "Ops see only their region's submissions. Finance/Admin see global P&L." },
    { module: "Invoices", rule: "Finance visibility is global. Ops have read-only access to verify payment status." },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Authorization & Security Model</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">Enforcing granular access control across the China-Tanzania logistics corridor.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Permissions Matrix */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-xl font-bold">1. Permissions Matrix</h3>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Allowed Roles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {permissions.map((p, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.action}</td>
                      <td className="px-6 py-4 flex gap-1 flex-wrap">
                        {p.roles.map((r, ri) => (
                          <span key={ri} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.includes('Admin') ? 'bg-red-100 text-red-700' :
                            r.includes('Finance') ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {r}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Region Scoping */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-amber-600">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl font-bold">2. Region Scoping</h3>
            </div>
            <div className="space-y-4">
              {scoping.map((s, i) => (
                <div key={i} className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 text-sm mb-1">{s.module}</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">{s.rule}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
               <div className="flex items-center gap-2 text-indigo-400">
                 <Server className="w-5 h-5" />
                 <h4 className="font-bold text-sm">3. Enforcement Layer</h4>
               </div>
               <div className="space-y-3 text-[11px] text-slate-300">
                 <div className="flex gap-2">
                   <Key className="w-3 h-3 mt-0.5 shrink-0 text-indigo-400" />
                   <p><strong>Middleware:</strong> JWT payload contains `role` and `region_id`. Every API route wraps a `checkPermission(role, action)` and `checkRegion(user, entity)` validator.</p>
                 </div>
                 <div className="flex gap-2">
                   <Database className="w-3 h-3 mt-0.5 shrink-0 text-indigo-400" />
                   <p><strong>Postgres RLS:</strong> Row Level Security policies enforce `user_region = entity_region` for all Ops-level queries, ensuring data leakage is blocked even if application code is bypassed.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
