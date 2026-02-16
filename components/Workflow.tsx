
import React from 'react';
import { 
  GitMerge, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';

export const Workflow: React.FC = () => {
  const rules = [
    {
      title: "Shipment Approval",
      from: "DRAFT",
      to: "APPROVED",
      actor: "Admin Only",
      condition: "quoted_price > 0",
      error: "Approval Blocked: A valid quote must be provided before approval.",
      icon: <UserCheck className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Dispatch Lock",
      from: "READY_FOR_DISPATCH",
      to: "IN_TRANSIT",
      actor: "Ops Officer",
      condition: "Invoice = PAYMENT_RECEIVED",
      error: "Dispatch Blocked: Finance has not confirmed payment for this shipment.",
      icon: <Lock className="w-5 h-5 text-red-500" />
    },
    {
      title: "Package Integrity",
      from: "Any",
      to: "Next Stage",
      actor: "System",
      condition: "ALL packages must reach the target status",
      error: "Transition Blocked: Package dependencies not met (e.g. some items not yet located).",
      icon: <GitMerge className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Expense Funding",
      from: "APPROVED",
      to: "FUNDED",
      actor: "Finance Only",
      condition: "Admin must approve expenses first",
      error: "Funding Blocked: Unapproved expenses cannot be processed.",
      icon: <Coins className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-slate-800" />
        <div>
          <h2 className="text-2xl font-bold">Strict State Machines</h2>
          <p className="text-gray-500">Business rules enforced at the database and application level.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{rule.icon}</div>
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">
                Rule #{idx + 1}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{rule.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="font-mono bg-gray-100 px-2 rounded">{rule.from}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="font-mono bg-blue-50 text-blue-700 px-2 rounded">{rule.to}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <UserCheck className="w-3 h-3 text-gray-400" />
                <span className="font-semibold">Actor:</span> {rule.actor}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="font-semibold">Precondition:</span> {rule.condition}
              </div>
              <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2 border border-red-100">
                <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-800 leading-tight"><strong>Error:</strong> {rule.error}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldAlert className="w-32 h-32" />
        </div>
        <h3 className="text-xl font-bold mb-4">State Transition Integrity</h3>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          The system utilizes a <strong>Stateless Transition Engine</strong>. Each update request validates the 
          current state against the target state. Any attempt to bypass stages (e.g., DRAFT → IN_TRANSIT) 
          triggers an automatic security alert and audit log entry.
        </p>
      </div>
    </div>
  );
};
