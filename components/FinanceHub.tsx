
import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { InvoiceStatus, ExpenseStatus } from '../types';

interface FinanceMetric {
  label: string;
  value: string;
  sub: string;
  color: 'emerald' | 'blue' | 'amber' | 'red';
}

const EXCHANGE_RATES = {
  USD: 1,
  TZS: 2600,
  CNY: 7.2
};

export const FinanceHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Data
  const invoices = [
    { id: 'INV-7701', shipmentId: 'SHP-77281', customer: 'Tanzania Importers Ltd', amount: 4500, currency: 'USD', status: InvoiceStatus.PAYMENT_RECEIVED, date: '2024-05-18' },
    { id: 'INV-7702', shipmentId: 'SHP-88001', customer: 'Global Sourcing CN', amount: 12000000, currency: 'TZS', status: InvoiceStatus.PENDING_PAYMENT, date: '2024-05-19' },
    { id: 'INV-7703', shipmentId: 'SHP-22319', customer: 'East Africa Trade', amount: 850, currency: 'USD', status: InvoiceStatus.PENDING_PAYMENT, date: '2024-05-20' },
  ];

  const expenses = [
    { id: 'EXP-901', shipmentId: 'SHP-77281', title: 'Port Duty TZ', amount: 1200, currency: 'USD', status: ExpenseStatus.FUNDED },
    { id: 'EXP-902', shipmentId: 'SHP-77281', title: 'Local Trucking', amount: 350, currency: 'USD', status: ExpenseStatus.APPROVED },
    { id: 'EXP-903', shipmentId: 'SHP-88001', title: 'Warehouse GZ', amount: 5000, currency: 'CNY', status: ExpenseStatus.APPROVED },
  ];

  // Logic: Profit = Invoice Amount - SUM(Approved/Funded Expenses)
  // Normalizing to USD for comparison
  const profitReport = useMemo(() => {
    return invoices.map(inv => {
      const invInUsd = inv.amount / EXCHANGE_RATES[inv.currency as keyof typeof EXCHANGE_RATES];
      const relatedExpenses = expenses
        .filter(e => e.shipmentId === inv.shipmentId && (e.status === ExpenseStatus.APPROVED || e.status === ExpenseStatus.FUNDED))
        .reduce((sum, e) => sum + (e.amount / EXCHANGE_RATES[e.currency as keyof typeof EXCHANGE_RATES]), 0);
      
      return {
        shipmentId: inv.shipmentId,
        revenueUsd: invInUsd,
        expensesUsd: relatedExpenses,
        profitUsd: invInUsd - relatedExpenses,
        margin: ((invInUsd - relatedExpenses) / invInUsd) * 100
      };
    });
  }, [invoices, expenses]);

  const metrics: FinanceMetric[] = [
    { label: 'Pending Collections', value: '$5,465', sub: '2 Unpaid Invoices', color: 'amber' },
    { label: 'Awaiting Funding', value: '$1,044', sub: '3 Approved Expenses', color: 'blue' },
    { label: 'Net Profit (MTD)', value: '$12,240', sub: 'Normalized to USD', color: 'emerald' },
    { label: 'Overdue Payments', value: '$850', sub: 'Needs Admin Review', color: 'red' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="text-slate-900" /> Global Finance Hub
          </h2>
          <p className="text-gray-500 text-sm">Centralized ledger for multi-currency invoicing and expense reconciliation.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> RECALCULATE MARGINS
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-800 transition-all">
            <FileText className="w-4 h-4" /> GENERATE P&L REPORT
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
            <h3 className={`text-2xl font-bold text-${m.color}-600`}>{m.value}</h3>
            <p className="text-xs text-gray-500 mt-2">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-500" /> Pending Invoices
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search invoices..." className="pl-9 pr-4 py-1.5 bg-gray-50 border-transparent rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"><Filter className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">
            <tr>
              <th className="px-6 py-3">Invoice / Shipment</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Reconciliation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{inv.id}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{inv.shipmentId}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{inv.customer}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono font-bold text-gray-900">
                    {inv.currency} {inv.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    inv.status === InvoiceStatus.PAYMENT_RECEIVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status === InvoiceStatus.PENDING_PAYMENT ? (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors">
                      CONFIRM PAYMENT
                    </button>
                  ) : (
                    <div className="flex justify-end gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                      <Lock className="w-3 h-3" /> Immutable Record
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profitability & Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Profitability by Shipment (Normalized to USD)
              </h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Shipment ID</th>
                    <th className="px-6 py-3 text-right">Revenue</th>
                    <th className="px-6 py-3 text-right">Expenses</th>
                    <th className="px-6 py-3 text-right">Net Profit</th>
                    <th className="px-6 py-3 text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profitReport.map(report => (
                    <tr key={report.shipmentId} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-mono font-bold text-gray-400">{report.shipmentId}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-900">${report.revenueUsd.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono text-red-500">-${report.expensesUsd.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">${report.profitUsd.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${report.margin > 30 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {report.margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Safeguards & Logic Notes */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold uppercase tracking-widest text-[10px]">Reconciliation Safeguards</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span><strong>Invoice Locking:</strong> Paid invoices are marked as <code>READ_ONLY</code>. No edits permitted without Admin audit bypass.</span>
              </li>
              <li className="flex gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span><strong>Double-Entry Guard:</strong> Every Payment Confirmation triggers an automated entry in the Forensic Audit Trail.</span>
              </li>
              <li className="flex gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span><strong>Multi-Currency:</strong> All calculations utilize a daily-synced <code>exchange_rates</code> service for USD normalization.</span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
             <div className="flex items-center gap-2 mb-3 text-indigo-900">
               <AlertCircle className="w-5 h-5" />
               <h4 className="font-bold text-sm">Logic Definition</h4>
             </div>
             <div className="space-y-4 font-mono text-[9px] text-indigo-800 bg-white/50 p-4 rounded-lg border border-indigo-200">
               <div>
                 <span className="text-gray-400">-- Profit Query</span><br/>
                 SELECT s.id, i.amount - SUM(e.amount) as net<br/>
                 FROM shipments s<br/>
                 JOIN invoices i ON i.shipment_id = s.id<br/>
                 JOIN expenses e ON e.shipment_id = s.id<br/>
                 WHERE e.status IN ('APPROVED', 'FUNDED')<br/>
                 GROUP BY s.id, i.amount;
               </div>
               <div className="mt-2 text-indigo-400">
                 // Updates triggered on:<br/>
                 - Invoice payment status change<br/>
                 - Expense approval by Admin
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
