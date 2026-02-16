
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, 
  User, Phone, Mail, MapPin, ExternalLink, ArrowRight, X, AlertCircle, 
  CheckCircle2, ShieldAlert, History, Clock, ArrowLeft
} from 'lucide-react';
import { Customer, UserRole, ShipmentStatus } from '../types';

interface CustomersProps {
  role: UserRole;
}

export const Customers: React.FC<CustomersProps> = ({ role }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Mock Customers Data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      accountNumber: 'ST-10001',
      name: 'Tanzania Importers Ltd',
      phone: '+255 712 345 678',
      email: 'logistics@tzimporters.co.tz',
      address: 'Plot 45, Nyerere Rd, Dar es Salaam',
      region: 'TZ',
      createdAt: '2024-01-15',
      createdBy: 'Admin Global',
      balance: 4500.50
    },
    {
      id: 'CUST-002',
      accountNumber: 'ST-10002',
      name: 'Global Sourcing CN',
      phone: '+86 138 9988 7766',
      email: 'chen.wei@globalsourcing.cn',
      address: 'Unit 402, Yiwu Trade Mart, Zhejiang',
      region: 'CN',
      createdAt: '2024-02-10',
      createdBy: 'Ops China',
      balance: 0.00
    },
    {
      id: 'CUST-003',
      accountNumber: 'ST-10003',
      name: 'East Africa Trade House',
      phone: '+255 655 112 233',
      email: 'info@eath.com',
      address: 'Kariakoo Market, Dar es Salaam',
      region: 'TZ',
      createdAt: '2024-03-05',
      createdBy: 'Admin Global',
      balance: 1200.00
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, customers]);

  const canEditPhone = role === UserRole.ADMIN;
  const canModify = role !== UserRole.FINANCE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicates
    const existing = customers.find(c => c.phone.replace(/\s/g, '') === formData.phone.replace(/\s/g, ''));
    if (existing && !duplicateWarning) {
      setDuplicateWarning(existing.id);
      return;
    }

    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      accountNumber: `ST-${10000 + customers.length + 1}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      region: role === UserRole.OPS_CHINA ? 'CN' : 'TZ',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: role.replace('_', ' '),
      balance: 0
    };

    setCustomers([...customers, newCust]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setDuplicateWarning(null);
  };

  const openCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setView('DETAIL');
  };

  if (view === 'DETAIL' && selectedCustomerId) {
    const customer = customers.find(c => c.id === selectedCustomerId)!;
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => setView('LIST')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                <span className="text-xs font-bold text-gray-400 font-mono mt-1">{customer.accountNumber}</span>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Active</span>
                  <span className={`px-3 py-1 ${customer.region === 'CN' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'} rounded-full text-[10px] font-bold uppercase`}>
                    {customer.region === 'CN' ? 'China' : 'Tanzania'} Origin
                  </span>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Primary Phone</p>
                    <p className="text-sm font-semibold">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                    <p className="text-sm font-semibold">{customer.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Warehouse/Delivery Address</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{customer.address || 'No address saved'}</p>
                  </div>
                </div>
              </div>

              {canModify && (
                <button className="w-full mt-8 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                  <Edit className="w-3 h-3" /> EDIT PROFILE
                </button>
              )}
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Financial Overview</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-white font-mono">${customer.balance.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Volume</p>
                    <p className="text-sm font-bold">1.2 Tons</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Spend</p>
                    <p className="text-sm font-bold font-mono">$12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" /> Recent Shipments
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase text-left">
                    <tr>
                      <th className="px-6 py-3 tracking-wider">Tracking ID</th>
                      <th className="px-6 py-3 tracking-wider">Route</th>
                      <th className="px-6 py-3 tracking-wider">Status</th>
                      <th className="px-6 py-3 tracking-wider">Created</th>
                      <th className="px-6 py-3 tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">SHP-772{i}1</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <span className="font-semibold">GZ (CN)</span>
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                          <span className="font-semibold">DAR (TZ)</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">Ready Dispatch</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs font-mono">2024-05-{10+i}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit History Specific to Customer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-xs uppercase tracking-widest mb-4">
                <ShieldAlert className="w-4 h-4 text-slate-800" /> Administrative Audit
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <History className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Customer Profile Created</p>
                    <p className="text-[10px] text-gray-500">Actor: {customer.createdBy} • Timestamp: {customer.createdAt} 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-gray-500 text-sm">Manage global customer accounts and track cross-border engagement.</p>
        </div>
        
        {canModify && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> ADD CUSTOMER
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, phone, email..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Customer Account</th>
              <th className="px-6 py-4">Contact Detail</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center justify-center opacity-30">
                     <Users className="w-12 h-12 mb-4" />
                     <p className="font-bold">No customers found</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-gray-50/50 transition-all cursor-pointer group"
                  onClick={() => openCustomer(c.id)}
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">{c.accountNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Phone className="w-3 h-3 text-gray-400" /> {c.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Mail className="w-3 h-3" /> {c.email || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.region === 'CN' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {c.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-gray-500">{c.createdAt}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">By {c.createdBy}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      {canModify && (
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-amber-600 transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Add Customer Master
                </h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">New Account Registry</p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setDuplicateWarning(null);
                }} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {duplicateWarning ? (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl space-y-4 animate-in slide-in-from-top-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">Potential Duplicate Found</h4>
                      <p className="text-xs text-amber-700 leading-relaxed mt-1">
                        A customer with the phone <strong>{formData.phone}</strong> already exists in our master registry.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => openCustomer(duplicateWarning)}
                      className="w-full py-3 bg-white border border-amber-200 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> VIEW EXISTING RECORD
                    </button>
                    {role === UserRole.ADMIN ? (
                      <button 
                        type="submit"
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" /> FORCE CREATE (BYPASS CHECK)
                      </button>
                    ) : (
                      <p className="text-[10px] text-amber-600 text-center italic mt-1 font-medium">
                        * Only Administrators can bypass duplicate warnings.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            minLength={2}
                            type="text" 
                            placeholder="John Doe / Acme TZ Ltd"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium transition-all"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number (E.164)</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                              required
                              type="tel" 
                              placeholder="+255..."
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-mono transition-all"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email (Optional)</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                              type="email" 
                              placeholder="customer@email.com"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address & Delivery Zone</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea 
                            rows={3}
                            placeholder="Street, Building, City, Region..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm leading-relaxed transition-all"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 border border-blue-100">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-800 leading-tight">
                      New customer will be assigned a global <strong>Account ID</strong>. Data will be searchable across both China and Tanzania offices.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> REGISTER CUSTOMER
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
