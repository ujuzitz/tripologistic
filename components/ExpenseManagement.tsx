
import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  X,
  AlertCircle
} from 'lucide-react';
import { ExpenseStatus, UserRole } from '../types';

export const ExpenseManagement: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeFilter, setActiveFilter] = useState<ExpenseStatus>(ExpenseStatus.SUBMITTED);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [expenses, setExpenses] = useState([
    { id: 'EXP-101', title: 'Port Clearance Fees', amount: 1200, currency: 'USD', status: ExpenseStatus.APPROVED, date: '2024-05-18', region: 'TZ' },
    { id: 'EXP-102', title: 'Warehouse Rent GZ', amount: 8000, currency: 'CNY', status: ExpenseStatus.SUBMITTED, date: '2024-05-19', region: 'CN' },
    { id: 'EXP-103', title: 'Local Transport (Trucking)', amount: 450, currency: 'USD', status: ExpenseStatus.FUNDED, date: '2024-05-17', region: 'TZ' },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    shipmentId: ''
  });

  const handleAction = (id: string, newStatus: ExpenseStatus) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: newStatus } : exp));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newExp = {
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        title: formData.title,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        status: ExpenseStatus.SUBMITTED,
        date: new Date().toISOString().split('T')[0],
        region: role === UserRole.OPS_CHINA ? 'CN' : 'TZ'
      };

      setExpenses([newExp, ...expenses]);
      setIsSubmitting(false);
      setShowForm(false);
      setFormData({ title: '', amount: '', currency: 'USD', shipmentId: '' });
    }, 800);
  };

  const filteredExpenses = expenses.filter(exp => exp.status === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-slate-900" /> Operational Expenses
          </h2>
          <p className="text-gray-500 text-sm">Manage region-based spending and global funding disbursements.</p>
        </div>
        
        {role.startsWith('OPS') && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> SUBMIT EXPENSE
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Approval</p>
          <p className="text-xl font-bold text-slate-900">
            {expenses.filter(e => e.status === ExpenseStatus.SUBMITTED).length} Entries
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approved & Ready</p>
          <p className="text-xl font-bold text-blue-600">
            {expenses.filter(e => e.status === ExpenseStatus.APPROVED).length} Entries
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Disbursed (MTD)</p>
          <p className="text-xl font-bold text-emerald-600">
            {expenses.filter(e => e.status === ExpenseStatus.FUNDED).length} Entries
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-max">
        {[ExpenseStatus.SUBMITTED, ExpenseStatus.APPROVED, ExpenseStatus.FUNDED].map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Expense ID</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                  No expenses found for this status.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{exp.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{exp.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{exp.date}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                    {exp.amount.toLocaleString()} {exp.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{exp.region}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      exp.status === ExpenseStatus.FUNDED ? 'bg-emerald-100 text-emerald-700' :
                      exp.status === ExpenseStatus.APPROVED ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {exp.status === ExpenseStatus.FUNDED ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {role === UserRole.ADMIN && exp.status === ExpenseStatus.SUBMITTED && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(exp.id, ExpenseStatus.APPROVED)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(exp.id, ExpenseStatus.REJECTED)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {role === UserRole.FINANCE && exp.status === ExpenseStatus.APPROVED && (
                      <button 
                        onClick={() => handleAction(exp.id, ExpenseStatus.FUNDED)}
                        className="bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-slate-800 transition-colors"
                      >
                        RELEASE FUNDS
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> New Operational Expense
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expense Description</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Port Duties, Local Fuel, Warehouse Rent"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</label>
                  <input 
                    required
                    type="number" 
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-mono transition-all"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Currency</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-bold transition-all"
                    value={formData.currency}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="CNY">CNY</option>
                    <option value="TZS">TZS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Related Shipment ID (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. SHP-77281"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-mono transition-all"
                  value={formData.shipmentId}
                  onChange={e => setFormData({...formData, shipmentId: e.target.value})}
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg flex gap-3 border border-blue-100">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-800 leading-tight">
                  Expense will be submitted to <strong>Global Admin</strong> for approval. Region auto-set to <strong>{role === UserRole.OPS_CHINA ? 'China' : 'Tanzania'}</strong> based on your profile.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isSubmitting ? 'SUBMITTING...' : 'CONFIRM SUBMISSION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
