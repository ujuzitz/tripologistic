
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Truck, 
  Package as PackageIcon, 
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
  ShieldCheck,
  Printer,
  FileText,
  Trash2,
  Layers,
  ArrowLeft,
  ChevronUp,
  Boxes,
  Info,
  DollarSign,
  Receipt,
  Tag,
  Calculator,
  Percent,
  Lock
} from 'lucide-react';
import { UserRole, ShipmentStatus, InvoiceStatus, Customer, Shipment, PackageStatus, Package, AdditionalCharge } from '../types';
import { STATUS_COLORS } from '../constants';
import { TrackingLabel } from './TrackingLabel';

interface ShipmentConsoleProps {
  role: UserRole;
  onViewShipment: (id: string) => void;
  onScanShipment: (id: string, mode: string) => void;
  onExpensesShipment: (id: string) => void;
}

interface DraftPackage {
  id: string;
  name: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  qty: number;
  notes: string;
}

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
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);
  
  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerList, setCustomerList] = useState<Customer[]>(INITIAL_CUSTOMERS);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('Dar es Salaam (TZ)');
  
  const [draftPackages, setDraftPackages] = useState<DraftPackage[]>([
    { id: 'pkg-1', name: '', description: '', weight: '', length: '', width: '', height: '', qty: 1, notes: '' }
  ]);

  // Pricing States
  const [pricingType, setPricingType] = useState<'flat' | 'package' | 'weight' | 'custom'>('flat');
  const [basePrice, setBasePrice] = useState<string>('0');
  const [currency, setCurrency] = useState<'USD' | 'TZS' | 'CNY'>('TZS');
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);
  const [discountValue, setDiscountValue] = useState<string>('0');
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [pricingNotes, setPricingNotes] = useState('');

  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkPrefix, setBulkPrefix] = useState('Carton');

  const [shipments, setShipments] = useState<Shipment[]>([
    { 
      id: 'SHP-77281', 
      trackingNo: 'SHP-77281',
      status: ShipmentStatus.READY_FOR_DISPATCH, 
      paymentStatus: 'Paid', 
      packageCount: 20, 
      createdAt: '2024-05-18',
      originRegion: 'CN',
      destinationRegion: 'TZ',
      customerName: 'Tanzania Importers Ltd',
      quotedPrice: 4500,
      currency: 'USD',
      approvalStatus: 'approved',
      pricingType: 'flat',
      basePrice: 4500,
      additionalCharges: [],
      discountValue: 0,
      discountType: 'amount',
      finalTotal: 4500,
      priceLocked: true
    },
    { 
      id: 'SHP-88001', 
      trackingNo: 'SHP-88001',
      status: ShipmentStatus.APPROVED, 
      paymentStatus: 'Unpaid', 
      packageCount: 15, 
      createdAt: '2024-05-19',
      originRegion: 'CN',
      destinationRegion: 'TZ',
      customerName: 'Global Sourcing CN',
      quotedPrice: 1200,
      currency: 'USD',
      approvalStatus: 'approved',
      pricingType: 'weight',
      basePrice: 10,
      additionalCharges: [],
      discountValue: 0,
      discountType: 'amount',
      finalTotal: 1200,
      priceLocked: true
    }
  ]);

  const [quickCustomerData, setQuickCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    setOrigin(role === UserRole.OPS_CHINA ? 'Guangzhou (CN)' : 'Dar es Salaam (TZ)');
    setDestination(role === UserRole.OPS_CHINA ? 'Dar es Salaam (TZ)' : 'Guangzhou (CN)');
  }, [role, showCreateModal]);

  // Derived Values
  const totalQty = useMemo(() => draftPackages.reduce((sum, p) => sum + (p.qty || 0), 0), [draftPackages]);
  const totalWeight = useMemo(() => draftPackages.reduce((sum, p) => sum + (parseFloat(p.weight) || 0) * (p.qty || 0), 0), [draftPackages]);
  
  const pricingCalculations = useMemo(() => {
    const base = parseFloat(basePrice) || 0;
    let subTotal = 0;
    if (pricingType === 'flat' || pricingType === 'custom') subTotal = base;
    else if (pricingType === 'package') subTotal = base * totalQty;
    else if (pricingType === 'weight') subTotal = base * totalWeight;

    const chargesSum = additionalCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
    const discVal = parseFloat(discountValue) || 0;
    let discountAmount = 0;
    if (discountType === 'amount') discountAmount = discVal;
    else discountAmount = (subTotal + chargesSum) * (discVal / 100);

    const finalTotal = subTotal + chargesSum - discountAmount;

    return { subTotal, chargesSum, discountAmount, finalTotal };
  }, [pricingType, basePrice, totalQty, totalWeight, additionalCharges, discountValue, discountType]);

  const searchedCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    return customerList.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.phone.includes(customerSearch)
    );
  }, [customerSearch, customerList]);

  const filteredShipments = useMemo(() => {
    return shipments.filter(shp => {
      if (role === UserRole.OPS_CHINA && shp.originRegion !== 'CN') return false;
      if (role === UserRole.OPS_TANZANIA && shp.originRegion !== 'TZ') return false;
      const matchesSearch = shp.id.toLowerCase().includes(search.toLowerCase()) || 
                            shp.customerName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || shp.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || shp.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, statusFilter, paymentFilter, role, shipments]);

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
    if (!selectedCustomer || pricingCalculations.finalTotal <= 0) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const trackingId = `SHP-${Math.floor(10000 + Math.random() * 90000)}`;
      const newShipment: Shipment = {
        id: trackingId,
        trackingNo: trackingId,
        status: ShipmentStatus.DRAFT,
        paymentStatus: 'Unpaid',
        packageCount: totalQty,
        createdAt: new Date().toISOString().split('T')[0],
        originRegion: origin.includes('(CN)') ? 'CN' : 'TZ',
        destinationRegion: destination.includes('(CN)') ? 'CN' : 'TZ',
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        approvalStatus: 'draft',
        
        // Final Pricing Data
        pricingType,
        basePrice: parseFloat(basePrice),
        currency,
        additionalCharges,
        discountValue: parseFloat(discountValue),
        discountType,
        finalTotal: pricingCalculations.finalTotal,
        pricingNotes,
        priceLocked: true,
        priceLockedAt: new Date().toISOString(),
        priceLockedBy: role,
        
        quotedPrice: pricingCalculations.finalTotal, // compatibility
      };

      setShipments([newShipment, ...shipments]);
      setCreatedShipment(newShipment);
      setIsSubmitting(false);
    }, 1200);
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
      region: origin.includes('(CN)') ? 'CN' : 'TZ',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: role,
      balance: 0
    };

    setCustomerList([...customerList, newCust]);
    setSelectedCustomer(newCust);
    setShowQuickAddCustomer(false);
    setQuickCustomerData({ name: '', phone: '', email: '', address: '' });
  };

  const validateStep = () => {
    if (wizardStep === 1) return origin && destination;
    if (wizardStep === 2) return selectedCustomer !== null;
    if (wizardStep === 3) return draftPackages.length > 0 && draftPackages.every(p => p.name.trim().length >= 2);
    if (wizardStep === 4) return parseFloat(basePrice) > 0 && pricingCalculations.finalTotal > 0;
    return true;
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 mb-2">
               <Info className="w-5 h-5 text-blue-600 shrink-0" />
               <p className="text-xs text-blue-800">Select the shipping route. This determines which regional operations team will manage the master waybill.</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Origin Port</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm font-bold" value={origin} onChange={e => setOrigin(e.target.value)}>
                    <option value="Guangzhou (CN)">Guangzhou (CN)</option>
                    <option value="Yiwu (CN)">Yiwu (CN)</option>
                    <option value="Dar es Salaam (TZ)">Dar es Salaam (TZ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination Port</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm font-bold" value={destination} onChange={e => setDestination(e.target.value)}>
                    <option value="Dar es Salaam (TZ)">Dar es Salaam (TZ)</option>
                    <option value="Guangzhou (CN)">Guangzhou (CN)</option>
                  </select>
                </div>
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Consignee / Customer Selection</label>
              {selectedCustomer ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User className="w-5 h-5" /></div>
                    <div>
                      <p className="font-bold text-blue-900 text-sm">{selectedCustomer.name}</p>
                      <p className="text-[10px] text-blue-600 font-mono">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-blue-100 rounded-full text-blue-400"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm transition-all focus:bg-white focus:ring-2 focus:ring-blue-500" 
                    value={customerSearch} 
                    onChange={e => setCustomerSearch(e.target.value)} 
                  />
                  {customerSearch.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-gray-50">
                      {searchedCustomers.length === 0 ? (
                        <div className="p-4 text-center">
                          <button type="button" onClick={() => { setQuickCustomerData({ ...quickCustomerData, name: customerSearch }); setShowQuickAddCustomer(true); }} className="text-xs font-bold text-blue-600 flex items-center gap-1 mx-auto"><Plus className="w-3 h-3" /> Create "{customerSearch}"</button>
                        </div>
                      ) : (
                        searchedCustomers.map(c => (
                          <button 
                            key={c.id} 
                            type="button" 
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerSearch('');
                            }} 
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
                          >
                            <div><p className="text-sm font-bold text-gray-900">{c.name}</p><p className="text-[10px] text-gray-400 font-mono">{c.phone}</p></div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {!customerSearch.trim() && (
                    <button type="button" onClick={() => setShowQuickAddCustomer(true)} className="w-full mt-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-gray-400 text-[10px] font-bold uppercase hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                      <UserPlus className="w-3 h-3" /> Quick Add New Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cargo Manifest</h4>
               <button type="button" onClick={() => setDraftPackages([...draftPackages, { id: Date.now().toString(), name: '', description: '', weight: '', length: '', width: '', height: '', qty: 1, notes: '' }])} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest"><Plus className="w-3 h-3" /> Add Item</button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {draftPackages.map((pkg, idx) => (
                <div key={pkg.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Package Name *</label>
                      <input type="text" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" value={pkg.name} onChange={e => {
                        const newPkgs = [...draftPackages];
                        newPkgs[idx].name = e.target.value;
                        setDraftPackages(newPkgs);
                      }} />
                    </div>
                    <div className="w-20">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Qty</label>
                      <input type="number" min="1" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono" value={pkg.qty} onChange={e => {
                        const newPkgs = [...draftPackages];
                        newPkgs[idx].qty = parseInt(e.target.value) || 1;
                        setDraftPackages(newPkgs);
                      }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Description</label>
                      <input type="text" className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-[10px]" value={pkg.description} onChange={e => {
                        const newPkgs = [...draftPackages];
                        newPkgs[idx].description = e.target.value;
                        setDraftPackages(newPkgs);
                      }} />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Weight (kg)</label>
                      <input type="number" className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-[10px]" value={pkg.weight} onChange={e => {
                        const newPkgs = [...draftPackages];
                        newPkgs[idx].weight = e.target.value;
                        setDraftPackages(newPkgs);
                      }} />
                    </div>
                    {draftPackages.length > 1 && (
                      <button type="button" onClick={() => setDraftPackages(draftPackages.filter(p => p.id !== pkg.id))} className="mt-4 p-1 text-gray-300 hover:text-red-500 transition-colors self-end"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Shipment Pricing</h3>
                  <p className="text-xs text-gray-500 mb-6">Define how the customer will be billed for this shipment.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    {['flat', 'package', 'weight', 'custom'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPricingType(type as any)}
                        className={`py-2 px-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                          pricingType === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                        }`}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Base Price</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-black font-mono"
                        value={basePrice}
                        onChange={e => setBasePrice(e.target.value)}
                      />
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Currency</label>
                    <select 
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold"
                      value={currency}
                      onChange={e => setCurrency(e.target.value as any)}
                    >
                      <option value="TZS">TZS</option>
                      <option value="USD">USD</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Charges</label>
                    <button type="button" onClick={() => setAdditionalCharges([...additionalCharges, { name: '', amount: 0 }])} className="text-[10px] font-bold text-blue-600 hover:underline">+ ADD CHARGE</button>
                  </div>
                  {additionalCharges.map((charge, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" placeholder="e.g. Documentation" className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs" value={charge.name} onChange={e => {
                        const newCharges = [...additionalCharges];
                        newCharges[idx].name = e.target.value;
                        setAdditionalCharges(newCharges);
                      }} />
                      <input type="number" className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono" value={charge.amount} onChange={e => {
                        const newCharges = [...additionalCharges];
                        newCharges[idx].amount = parseFloat(e.target.value) || 0;
                        setAdditionalCharges(newCharges);
                      }} />
                      <button type="button" onClick={() => setAdditionalCharges(additionalCharges.filter((_, i) => i !== idx))} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-72">
                <div className="bg-slate-900 text-white p-6 rounded-3xl sticky top-0 shadow-2xl space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Receipt className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Pricing Summary</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Sub-Total</span>
                      <span className="font-mono">{pricingCalculations.subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Addtl Charges</span>
                      <span className="font-mono">+{pricingCalculations.chargesSum.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-indigo-400">Final Total</span>
                      <span className="text-2xl font-black font-mono">{pricingCalculations.finalTotal.toLocaleString()} <span className="text-xs">{currency}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="w-32 h-32" /></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
                   <h4 className="text-lg font-black text-white uppercase tracking-widest">Master Manifest Review</h4>
                   <span className="px-4 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full text-[10px] font-black tracking-widest">PENDING SUBMISSION</span>
                </div>
                <div className="grid grid-cols-2 gap-12 relative z-10">
                   <section>
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin className="w-3 h-3 text-indigo-400" /> Routing</h5>
                      <p className="text-lg font-black">{origin} <ArrowRight className="w-4 h-4 text-indigo-500 inline-block mx-2" /> {destination}</p>
                      <div className="mt-4 flex items-center gap-4">
                         <div>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">Consignee</p>
                            <p className="text-sm font-bold text-slate-300">{selectedCustomer?.name}</p>
                         </div>
                      </div>
                   </section>
                   <section>
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><DollarSign className="w-3 h-3 text-emerald-400" /> Financials</h5>
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] text-slate-400 uppercase font-bold">Total Billable</span>
                         <span className="text-3xl font-black text-emerald-400 font-mono">{pricingCalculations.finalTotal.toLocaleString()} {currency}</span>
                      </div>
                   </section>
                </div>
                <div className="relative z-10">
                   <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Boxes className="w-3 h-3 text-indigo-400" /> Package List ({draftPackages.length})</h5>
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                      {draftPackages.map((p, i) => (
                        <div key={p.id} className="flex justify-between items-center text-[11px] font-mono py-1 border-b border-white/5 last:border-0">
                           <span className="text-slate-300">{i+1}. {p.name} {p.qty > 1 ? `(x${p.qty})` : ''}</span>
                           <span className="text-slate-500">{p.weight ? `${p.weight}kg` : '--'}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Management</h2>
          <p className="text-gray-500 text-sm">Create and track cross-border freight master waybills.</p>
        </div>
        <div className="flex items-center gap-3">
          {(role.startsWith('OPS') || role === UserRole.ADMIN) && (
            <button 
              onClick={() => {
                setCreatedShipment(null);
                setWizardStep(1);
                setDraftPackages([{ id: 'pkg-1', name: '', description: '', weight: '', length: '', width: '', height: '', qty: 1, notes: '' }]);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> CREATE SHIPMENT
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-gray-50/50 group">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{shp.id}</td>
                  <td className="px-6 py-4 font-semibold">{shp.originRegion} → {shp.destinationRegion}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[shp.status]}`}>
                      {shp.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-black">{shp.finalTotal?.toLocaleString()} {shp.currency}</td>
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {createdShipment ? (
              <div className="p-12 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Shipment Registered</h3>
                <p className="text-gray-500 text-sm mb-8">Master waybill created. Pricing is now locked for operations.</p>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-8 grid grid-cols-2 gap-4 text-left">
                  <div><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tracking ID</p><p className="text-2xl font-mono font-black text-blue-600">{createdShipment.trackingNo}</p></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Final Total</p><p className="text-2xl font-mono font-black text-slate-900">{createdShipment.finalTotal.toLocaleString()} {createdShipment.currency}</p></div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all">CLOSE WIZARD</button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit}>
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg uppercase tracking-tight"><Plus className="w-5 h-5 text-blue-600" /> New Shipment Master</h3>
                    <div className="flex items-center gap-4 mt-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${wizardStep >= s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                          {s < 5 && <div className={`h-1 w-6 rounded-full ${wizardStep > s ? 'bg-blue-600' : 'bg-gray-100'}`} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8">{renderWizardStep()}</div>
                <div className="px-8 py-6 border-t border-gray-100 flex justify-between bg-gray-50/50">
                  <button type="button" disabled={wizardStep === 1} onClick={() => setWizardStep(prev => prev - 1)} className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-white disabled:opacity-0 transition-all"><ArrowLeft className="w-4 h-4" /> BACK</button>
                  {wizardStep < 5 ? (
                    <button type="button" disabled={!validateStep()} onClick={() => setWizardStep(prev => prev + 1)} className="flex items-center gap-2 bg-blue-600 text-white px-10 py-2.5 rounded-xl text-xs font-bold shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-black">CONTINUE <ArrowRight className="w-4 h-4" /></button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-slate-900 text-white px-12 py-3 rounded-2xl text-xs font-black shadow-2xl hover:bg-slate-800 disabled:opacity-50 transition-all">{isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} SUBMIT FOR APPROVAL</button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showQuickAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs"><UserPlus className="w-4 h-4 text-blue-600" /> Quick Add Customer</h3>
              <button onClick={() => setShowQuickAddCustomer(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleQuickAddCustomer} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={quickCustomerData.name} onChange={e => setQuickCustomerData({...quickCustomerData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input required type="tel" className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono" value={quickCustomerData.phone} onChange={e => setQuickCustomerData({...quickCustomerData, phone: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"><Check className="w-4 h-4" /> SAVE & SELECT</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};
