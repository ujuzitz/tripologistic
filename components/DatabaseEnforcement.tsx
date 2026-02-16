
import React from 'react';
import { 
  Database, 
  ShieldAlert, 
  Terminal, 
  Lock, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle,
  Layers
} from 'lucide-react';

export const DatabaseEnforcement: React.FC = () => {
  const constraints = [
    {
      title: "Shipment Price Validation",
      type: "CHECK CONSTRAINT",
      code: "ALTER TABLE shipments ADD CONSTRAINT approved_price_check \nCHECK (approval_status != 'approved' OR quoted_price > 0);",
      description: "Ensures no shipment is moved to 'approved' without a valid financial quote."
    },
    {
      title: "Invoice Uniqueness",
      type: "UNIQUE / FK CONSTRAINT",
      code: "ALTER TABLE invoices ADD CONSTRAINT unique_shipment_invoice \nUNIQUE (shipment_id);",
      description: "Strict 1-to-1 relationship between a shipment and its billing record."
    }
  ];

  const triggers = [
    {
      title: "Dispatch Payment Guard",
      event: "BEFORE UPDATE ON shipments",
      logic: "IF NEW.status = 'IN_TRANSIT' AND (SELECT status FROM invoices WHERE shipment_id = NEW.id) != 'PAYMENT_RECEIVED' THEN \n  RAISE EXCEPTION 'Dispatch blocked: Payment not confirmed';\nEND IF;",
      icon: <Lock className="w-5 h-5 text-red-500" />
    },
    {
      title: "Package Integrity Guard",
      event: "BEFORE UPDATE ON shipments",
      logic: "IF NEW.status = 'READY_FOR_DISPATCH' AND EXISTS (SELECT 1 FROM packages WHERE shipment_id = NEW.id AND status != 'STAGED') THEN \n  RAISE EXCEPTION 'Transition blocked: Some packages are not staged';\nEND IF;",
      icon: <GitCompare className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-slate-900" />
          <h2 className="text-3xl font-extrabold text-gray-900">Database Enforcement</h2>
        </div>
        <p className="text-gray-500 mb-8 max-w-2xl">Rules enforced at the storage layer to prevent application-layer bypass or data corruption.</p>

        {/* RLS Policies */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4 uppercase tracking-wider text-sm">
            <ShieldAlert className="w-4 h-4" /> Row Level Security (RLS)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
              <div className="flex items-center gap-2 mb-4 text-indigo-400 font-mono text-xs">
                <Terminal className="w-3 h-3" /> postgres_rls_ops.sql
              </div>
              <pre className="text-[10px] leading-relaxed text-indigo-200">
{`CREATE POLICY ops_region_isolation ON shipments
FOR ALL TO ops_role
USING (
  origin_region = current_setting('app.region') OR 
  destination_region = current_setting('app.region')
);`}
              </pre>
              <div className="mt-4 text-[10px] text-slate-400 bg-slate-800 p-2 rounded">
                <strong>Effect:</strong> Ops Officers cannot SELECT/UPDATE shipments outside their assigned China or Tanzania region.
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-mono text-xs">
                <Terminal className="w-3 h-3" /> postgres_rls_finance.sql
              </div>
              <pre className="text-[10px] leading-relaxed text-emerald-200">
{`CREATE POLICY finance_global_access ON invoices
FOR ALL TO finance_role
USING (true); -- Global visibility for Finance`}
              </pre>
              <div className="mt-4 text-[10px] text-slate-400 bg-slate-800 p-2 rounded">
                <strong>Effect:</strong> Finance users have unrestricted access to the global ledger regardless of region.
              </div>
            </div>
          </div>
        </section>

        {/* Constraints & Triggers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Integrity Constraints
            </h3>
            {constraints.map((c, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-gray-800">{c.title}</h4>
                  <span className="text-[9px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{c.type}</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">{c.description}</p>
                <pre className="bg-gray-50 p-3 rounded font-mono text-[10px] text-blue-600 border border-gray-100 overflow-x-auto">
                  {c.code}
                </pre>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Operational Triggers
            </h3>
            {triggers.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm border-l-4 border-l-amber-400">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-50 rounded-lg">{t.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{t.title}</h4>
                    <p className="text-[10px] text-amber-600 font-mono">{t.event}</p>
                  </div>
                </div>
                <pre className="bg-slate-50 p-3 rounded font-mono text-[10px] text-slate-600 border border-slate-100 overflow-x-auto">
                  {t.logic}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Defense in Depth Note */}
        <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-indigo-900">Defense in Depth Strategy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <h4 className="font-bold text-indigo-800">Database Responsibility</h4>
              <ul className="list-disc list-inside space-y-2 text-indigo-700 text-xs">
                <li><strong>Immutability:</strong> Tracking numbers and IDs cannot be updated after insert.</li>
                <li><strong>State Safety:</strong> Rejects invalid status jumps (e.g. DRAFT -> RECEIVED).</li>
                <li><strong>Financial Safety:</strong> Invoices cannot be deleted if payment is received.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-indigo-800">Application Responsibility</h4>
              <ul className="list-disc list-inside space-y-2 text-indigo-700 text-xs">
                <li><strong>UX Feedback:</strong> Provide clear, localized error messages for blocked transitions.</li>
                <li><strong>OCR/Vision:</strong> Pre-validate scans before committing to the DB log.</li>
                <li><strong>Audit Metadata:</strong> Enrichment of logs with User-Agent, IP, and Request Path.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
