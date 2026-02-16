
import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  Lock, 
  Database,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';
import { AuditLogEntry, AuditEventType, UserRole } from '../types';

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2024-05-20T10:30:00Z',
    actorId: 'user-01',
    actorName: 'James Kariuki',
    actorRole: UserRole.ADMIN,
    eventType: AuditEventType.SHIPMENT_STATUS_CHANGE,
    entityType: 'SHIPMENT',
    entityId: 'SHP-77281',
    action: 'Approved Shipment for Dispatch',
    payload: {
      before: { status: 'DRAFT' },
      after: { status: 'APPROVED' },
      metadata: { ip: '192.168.1.45', region: 'Global' }
    },
    integrityHash: 'sha256-a1b2c3d4...'
  },
  {
    id: 'log-002',
    timestamp: '2024-05-20T11:15:00Z',
    actorId: 'user-02',
    actorName: 'Wei Chen',
    actorRole: UserRole.OPS_CHINA,
    eventType: AuditEventType.PKG_SCAN_EVENT,
    entityType: 'PACKAGE',
    entityId: 'PKG-20240520-001',
    action: 'Staged Package in Container',
    payload: {
      before: { status: 'SCANNED', location: 'GZ-WH-01' },
      after: { status: 'STAGED', shipmentId: 'SHP-77281' },
      metadata: { device: 'Zebra-Scanner-A9' }
    },
    integrityHash: 'sha256-e5f6g7h8...'
  },
  {
    id: 'log-003',
    timestamp: '2024-05-20T14:05:00Z',
    actorId: 'user-03',
    actorName: 'Sarah Mbeki',
    actorRole: UserRole.FINANCE,
    eventType: AuditEventType.PAYMENT_CONFIRMED,
    entityType: 'INVOICE',
    entityId: 'INV-9901',
    action: 'Confirmed Wire Transfer',
    payload: {
      before: { status: 'PENDING_PAYMENT' },
      after: { status: 'PAYMENT_RECEIVED' },
      metadata: { bankReference: 'TX-992281', amount: 4500.00 }
    },
    integrityHash: 'sha256-i9j0k1l2...'
  }
];

export const AuditTrail: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="text-slate-900" /> Immutable Audit Trail
          </h2>
          <p className="text-gray-500 text-sm">Comprehensive forensic log of all critical system mutations.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by ID/Actor..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Infrastructure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tamper Resistance</h4>
            <p className="text-[11px] leading-relaxed">Append-only table with cryptographic hash chaining (SHA-256) per entry.</p>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Status Enforcement</h4>
            <p className="text-[11px] leading-relaxed">Every status change requires a state-machine valid trigger, logged before execution.</p>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Snapshotting</h4>
            <p className="text-[11px] leading-relaxed">Logs capture "before" and "after" JSON snapshots for precise state reconstruction.</p>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {mockAuditLogs.map((log) => (
            <div key={log.id} className="group hover:bg-gray-50/50 transition-colors">
              <div 
                className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    log.eventType.includes('SHIPMENT') ? 'bg-blue-500' :
                    log.eventType.includes('PKG') ? 'bg-purple-500' : 'bg-emerald-500'
                  }`}></div>
                  <div className="w-0.5 h-10 bg-gray-100 group-last:hidden"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.id}</span>
                    <span className="text-xs font-semibold text-gray-900">{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-mono">
                      {log.entityId}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {log.actorName} ({log.actorRole})
                    </div>
                  </div>
                </div>

                {expandedId === log.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
              </div>

              {expandedId === log.id && (
                <div className="px-16 pb-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase">State Change</h5>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono text-xs">
                        <div className="text-red-500">{JSON.stringify(log.payload.before)}</div>
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <div className="text-green-600">{JSON.stringify(log.payload.after)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase">System Metadata</h5>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono text-[10px] text-gray-600">
                        {JSON.stringify(log.payload.metadata, null, 2)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between p-2 bg-emerald-50 rounded text-[10px] text-emerald-800 border border-emerald-100">
                    <div className="flex items-center gap-1 uppercase font-bold tracking-widest">
                      <ShieldCheck className="w-3 h-3" /> Integrity Verified
                    </div>
                    <div className="font-mono text-emerald-600">{log.integrityHash}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Query Documentation section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Forensic Query Interface</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <p className="text-gray-500 leading-relaxed">
              Standardized query operators allow Admins to isolate issues by entity or actor within specific time windows.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs text-blue-700">
              SELECT * FROM audit_logs <br/>
              WHERE entity_id = 'SHP-77281' <br/>
              AND timestamp BETWEEN '2024-05-01' AND '2024-05-31' <br/>
              ORDER BY timestamp DESC;
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Compliance Note
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
              <li>Logs are immutable (cannot be edited or deleted).</li>
              <li>Stored in a separate schema from operational data.</li>
              <li>Retention period: 7 years for financial compliance.</li>
              <li>Auto-alerts triggered on high-risk transitions (Price reduction > 10%).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
