
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Truck, 
  Package, 
  CreditCard, 
  ArrowRight, 
  MoreHorizontal, 
  Scan, 
  Wallet, 
  Eye,
  AlertCircle,
  ChevronDown,
  Calendar,
  X,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  UserPlus,
  Check,
  ChevronRight,
  Mail,
  // Fix: Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';
import { UserRole, ShipmentStatus, InvoiceStatus, Customer } from '../types';
import { STATUS_COLORS } from '../constants';

interface ShipmentConsoleProps {
  role: UserRole;
  onViewShipment: (id: string) => void;
  onScanShipment: (id: string, mode: string) => void;
  onExpensesShipment: (id: string) => void;
}

// Local mock for initial customer selection
const INITIAL_CUSTOMERS: Customer[] = [
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
  }
];

export const ShipmentConsole: React.FC<ShipmentConsoleProps> = ({ 
  role, 
  onViewShipment, 
  onScanShipment, 
  onExpensesShipment 
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer management within the console
  const [customerList, setCustomerList] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Initial Mock Data
  const [shipments, setShipments] = useState([
    { 
      id: 'SHP-77281', 
      origin: 'Guangzhou (CN)', 
      destination: 'Dar es Salaam (TZ)', 
      customer: 'Tanzania Importers Ltd', 
      status: ShipmentStatus.READY_FOR_DISPATCH, 
      paymentStatus: 'Paid', 
      packageCount: 20, 
      stagedCount: 20, 
      receivedCount: 0, 
      createdAt: '2024-05-18',
      region: 'CN'
    },
    { 
      id: 'SHP-88001', 
      origin: 'Yiwu (CN)', 
      destination: 'Dar es Salaam (TZ)', 
      customer: 'Global Sourcing CN', 
      status: ShipmentStatus.APPROVED, 
      paymentStatus: 'Pending', 
      packageCount: 15, 
      stagedCount: 4, 
      receivedCount: 0, 
      createdAt: '2024-05-19',
      region: 'CN'
    }
  ]);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    packageCount: '1'
  });

  const [quickCustomerData, setQuickCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Sync origin/destination defaults with the current role
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      origin: role === UserRole.OPS_CHINA ? 'Guangzhou (CN)' : 'Dar es Salaam (TZ)',
      destination: role === UserRole.OPS_CHINA ? 'Dar es Salaam (TZ)' : 'Guangzhou (CN)',
    }));
  }, [role, showCreateModal]);

  // Filtering shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(shp => {
      if (role === UserRole.OPS_CHINA && shp.region !== 'CN') return false;
      if (role === UserRole.OPS_TANZANIA && shp.region !== 'TZ') return false;
      const matchesSearch = shp.id.toLowerCase().includes(search.toLowerCase()) || 
                            shp.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || shp.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || shp.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, statusFilter, paymentFilter, role, shipments]);

  // Filtering customers for selection
  const searchedCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    return customerList.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.phone.includes(customerSearch)
    );
  }, [customerSearch, customerList]);

  const stats = [
    { label: 'Draft Waiting Approval', value: filteredShipments.filter(s => s.status === ShipmentStatus.DRAFT).length, color: 'gray' },
    { label: 'Approved (Not Staged)', value: filteredShipments.filter(s => s.status === ShipmentStatus.APPROVED).length, color: 'blue' },
    { label: 'In Transit', value: filteredShipments.filter(s => s.status === ShipmentStatus.IN_TRANSIT).length, color: 'yellow' },
    { label: 'Ready for Release', value: filteredShipments.filter(s => s.status === ShipmentStatus.READY_FOR_RELEASE).length, color: 'emerald' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newShipment = {
        id: `SHP-${Math.floor(10000 + Math.random() * 90000)}`,
        origin: formData.origin,
        destination: formData.destination,
        customer: selectedCustomer.name,
        status: ShipmentStatus.DRAFT,
        paymentStatus: 'Uninvoiced',
        packageCount: parseInt(formData.packageCount),
        stagedCount: 0,
        receivedCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        region: role === UserRole.OPS_CHINA ? 'CN' : 'TZ'
      };

      setShipments([newShipment, ...shipments]);
      setIsSubmitting(false);
      setShowCreateModal(false);
      setSelectedCustomer(null);
      setCustomerSearch('');
    }, 1000);
  };

  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `CUST-00${customerList.length + 1}`,
      accountNumber: `ST-${10000 + customerList.length + 1}`,
      name: quickCustomerData.name,
      phone: quickCustomerData.phone,
      email: quickCustomerData.email,
      address: quickCustomerData.address,
      region: role === UserRole.OPS_CHINA ? 'CN' : 'TZ',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: role,
      balance: 0
    };

    setCustomerList([...customerList, newCust]);
    setSelectedCustomer(newCust);
    setShowQuickAddCustomer(false);
    setQuickCustomerData({ name: '', phone: '', email: '', address: '' });
  };

  const getScanMode = (status: ShipmentStatus) => {
    switch(status) {
      case ShipmentStatus.APPROVED:
      case ShipmentStatus.READY_FOR_DISPATCH: return 'STAGE';
      case ShipmentStatus.IN_TRANSIT: return 'RECEIVE';
      case ShipmentStatus.RECEIVED:
      case ShipmentStatus.READY_FOR_RELEASE: return 'RELEASE';
      default: return 'MOVE';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Management</h2>
          <p className="text-gray-500 text-sm">Create and manage shipments in your region.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className={`p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
          {(role.startsWith('OPS') || role === UserRole.ADMIN) && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> CREATE SHIPMENT
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-gray-50/50 group">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 text-[11px]">{shp.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      {shp.origin.split(' ')[0]} <ArrowRight className="w-3 h-3 text-gray-300" /> {shp.destination.split(' ')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{shp.customer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[shp.status]}`}>
                      {shp.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-500 font-mono">{shp.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onViewShipment(shp.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> New Shipment Master
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              {/* Route Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Origin Port</label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-slate-900">
                    <MapPin className="w-3 h-3 text-blue-600" /> {formData.origin}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination Port</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-bold transition-all"
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                  >
                    <option value="Dar es Salaam (TZ)">Dar es Salaam (TZ)</option>
                    <option value="Zanzibar (TZ)">Zanzibar (TZ)</option>
                    <option value="Guangzhou (CN)">Guangzhou (CN)</option>
                    <option value="Yiwu (CN)">Yiwu (CN)</option>
                  </select>
                </div>
              </div>

              {/* Customer Selection Section */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer Selection</label>
                {selectedCustomer ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900 text-sm">{selectedCustomer.name}</p>
                        <p className="text-[10px] text-blue-600 font-mono">{selectedCustomer.phone} • {selectedCustomer.accountNumber}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="p-1 hover:bg-blue-100 rounded-full text-blue-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search existing customer by name or phone..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                      />
                    </div>
                    
                    {customerSearch.trim() && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto divide-y divide-gray-50">
                        {searchedCustomers.length === 0 ? (
                          <div className="p-4 text-center">
                            <p className="text-xs text-gray-500 mb-2">No customers found</p>
                            <button 
                              type="button"
                              onClick={() => {
                                setQuickCustomerData({ ...quickCustomerData, name: customerSearch });
                                setShowQuickAddCustomer(true);
                              }}
                              className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                              <Plus className="w-3 h-3" /> Create "{customerSearch}"
                            </button>
                          </div>
                        ) : (
                          searchedCustomers.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedCustomer(c)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{c.phone}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    
                    {!customerSearch.trim() && (
                      <button 
                        type="button"
                        onClick={() => setShowQuickAddCustomer(true)}
                        className="w-full mt-2 py-2 border border-dashed border-gray-200 rounded-xl text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-3 h-3" /> Quick Add New Customer
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Pkg Count</label>
                <div className="relative">
                   <Package className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                   <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-mono transition-all"
                    value={formData.packageCount}
                    onChange={e => setFormData({...formData, packageCount: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl flex gap-4">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  <strong>Master Waybill Generation:</strong> Creating this shipment will lock the initial route and customer details. Changes to pricing must be approved by Global Finance.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !selectedCustomer}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {isSubmitting ? 'GENERATING MASTER...' : 'CREATE SHIPMENT MASTER'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {showQuickAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">
                <UserPlus className="w-4 h-4 text-blue-600" /> Quick Add Customer
              </h3>
              <button onClick={() => setShowQuickAddCustomer(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleQuickAddCustomer} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    value={quickCustomerData.name}
                    onChange={e => setQuickCustomerData({...quickCustomerData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    type="tel" 
                    placeholder="+255..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono transition-all"
                    value={quickCustomerData.phone}
                    onChange={e => setQuickCustomerData({...quickCustomerData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    value={quickCustomerData.email}
                    onChange={e => setQuickCustomerData({...quickCustomerData, email: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Check className="w-4 h-4" /> SAVE & SELECT CUSTOMER
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
