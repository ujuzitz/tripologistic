
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  Map as MapIcon, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight, 
  X, 
  Clock, 
  AlertCircle,
  Scan,
  Camera,
  Loader2,
  Phone,
  User,
  ExternalLink,
  Tag,
  History,
  Info
} from 'lucide-react';
import { PackageStatus, UserRole, Package as PackageType, Warehouse, ShipmentStatus } from '../types';

interface InventoryProps {
  role: UserRole;
}

export const Inventory: React.FC<InventoryProps> = ({ role }) => {
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'SCAN_TOOLS' | 'DETAIL'>('DASHBOARD');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'LOCATION' | 'READY' | 'RELEASE'>('LOCATION');

  // Mock Warehouses
  const warehouses: Warehouse[] = [
    { id: 'WH-001', name: 'Dar es Salaam Port WH', region: 'TZ', code: 'DAR-P01' },
    { id: 'WH-002', name: 'Guangzhou Main WH', region: 'CN', code: 'GZ-M01' },
    { id: 'WH-003', name: 'Zanzibar Transit WH', region: 'TZ', code: 'ZNZ-T01' }
  ];

  // Mock Packages
  const [packages, setPackages] = useState<PackageType[]>([
    {
      id: 'PKG-20240518-001221',
      pkgCode: 'PKG-20240518-001',
      description: 'Solar Panels x10',
      weight: 120,
      volume: 1.5,
      customerId: 'CUST-001',
      customerName: 'Tanzania Importers Ltd',
      shipmentId: 'SHP-77281',
      shipmentTrackingNo: 'ST-WAY-9981',
      warehouseId: 'WH-001',
      locationCode: 'TZ-A-R03-L02-S04',
      status: PackageStatus.LOCATED,
      receivedAt: '2024-05-20'
    },
    {
      id: 'PKG-20240518-001222',
      pkgCode: 'PKG-20240518-002',
      description: 'Lithium Battery Bank',
      weight: 45,
      volume: 0.4,
      customerId: 'CUST-001',
      customerName: 'Tanzania Importers Ltd',
      shipmentId: 'SHP-77281',
      shipmentTrackingNo: 'ST-WAY-9981',
      warehouseId: 'WH-001',
      locationCode: undefined,
      status: PackageStatus.ARRIVED,
      receivedAt: '2024-05-20'
    },
    {
      id: 'PKG-20240519-003344',
      pkgCode: 'PKG-20240519-001',
      description: 'Spare Parts Box',
      weight: 12,
      volume: 0.1,
      customerId: 'CUST-002',
      customerName: 'Global Sourcing CN',
      shipmentId: 'SHP-88001',
      shipmentTrackingNo: 'ST-WAY-0021',
      warehouseId: 'WH-001',
      locationCode: 'TZ-A-R01-L05-S02',
      status: PackageStatus.READY_FOR_RELEASE,
      receivedAt: '2024-05-18'
    }
  ]);

  // Filtering Logic
  const filteredPackages = useMemo(() => {
    return packages.filter(p => {
      // Region Lock for Ops
      const wh = warehouses.find(w => w.id === p.warehouseId);
      if (role === UserRole.OPS_CHINA && wh?.region !== 'CN') return false;
      if (role === UserRole.OPS_TANZANIA && wh?.region !== 'TZ') return false;

      const matchesSearch = p.pkgCode.toLowerCase().includes(search.toLowerCase()) || 
                            p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                            p.shipmentTrackingNo?.toLowerCase().includes(search.toLowerCase());
      
      const matchesWH = warehouseFilter === 'ALL' || p.warehouseId === warehouseFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesWH && matchesStatus && p.status !== PackageStatus.RELEASED;
    });
  }, [search, warehouseFilter, statusFilter, packages, role]);

  const stats = {
    total: filteredPackages.length,
    awaitingLocation: filteredPackages.filter(p => p.status === PackageStatus.ARRIVED).length,
    ready: filteredPackages.filter(p => p.status === PackageStatus.READY_FOR_RELEASE).length,
    releasedLast7: 12 // Mock
  };

  const handleUpdateLocation = (pkgId: string, location: string) => {
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, locationCode: location, status: PackageStatus.LOCATED } : p));
  };

  const handleMarkReady = (pkgId: string) => {
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, status: PackageStatus.READY_FOR_RELEASE } : p));
  };

  if (activeView === 'DETAIL' && selectedPackageId) {
    const pkg = packages.find(p => p.id === selectedPackageId)!;
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button onClick={() => setActiveView('DASHBOARD')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{pkg.pkgCode}</h2>
                    <p className="text-gray-500 text-sm">{pkg.description}</p>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                  pkg.status === PackageStatus.READY_FOR_RELEASE ? 'bg-emerald-100 text-emerald-700' :
                  pkg.status === PackageStatus.LOCATED ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {pkg.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-sm font-bold">{pkg.weight} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Volume</p>
                  <p className="text-sm font-bold">{pkg.volume} m³</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Received Date</p>
                  <p className="text-sm font-bold">{pkg.receivedAt || '—'}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storage Location</p>
                    <p className="text-sm font-mono font-bold text-slate-900">{pkg.locationCode || 'UNASSIGNED'}</p>
                  </div>
                </div>
                {role.startsWith('OPS') && pkg.status !== PackageStatus.READY_FOR_RELEASE && (
                   <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                     <Tag className="w-4 h-4" /> UPDATE LOCATION
                   </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <History className="w-4 h-4 text-slate-400" /> Physical Audit Trail
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4 flex items-center justify-between bg-emerald-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-gray-700">Location Assigned: {pkg.locationCode}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">2024-05-20 14:15</span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-xs">Warehouse Receipt Confirmed</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">2024-05-20 10:30</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Shipment Context</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Waybill Tracking</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    {pkg.shipmentTrackingNo} <ExternalLink className="w-3 h-3 text-indigo-500" />
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Consignee</p>
                  <p className="text-sm font-bold text-white">{pkg.customerName}</p>
                </div>
                <div className="pt-4 border-t border-slate-800">
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-400">Payment Status</span>
                     <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold uppercase">PAID</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
               <div className="flex items-center gap-2 mb-3 text-amber-900">
                 <Info className="w-4 h-4" />
                 <h4 className="font-bold text-xs uppercase tracking-widest">Operational Rules</h4>
               </div>
               <p className="text-[11px] text-amber-800 leading-relaxed italic">
                 "Inventory release is only permitted after Shipment status moves to 'READY_FOR_RELEASE'. Verify receiver ID card before scanning final handover."
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'SCAN_TOOLS') {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
           <button onClick={() => setActiveView('DASHBOARD')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
          </button>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {(['LOCATION', 'READY', 'RELEASE'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => setScanMode(m)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                  scanMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {m === 'LOCATION' ? 'Assign Location' : m === 'READY' ? 'Ready Release' : 'Final Release'}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-xl">
           <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {scanMode === 'LOCATION' ? 'Assign Physical Location' : scanMode === 'READY' ? 'Mark Ready for Release' : 'Customer Handover Scan'}
              </h3>
              <p className="text-xs text-gray-500 mt-2 px-8">Point camera at package QR/Barcode to begin. Multi-scan enabled for bulk operations.</p>
           </div>

           {!isScanning ? (
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <Camera className="w-5 h-5" /> OPEN CAMERA SCANNER
              </button>
           ) : (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-48 h-48 border-2 border-white/40 rounded-3xl relative">
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                    </div>
                 </div>
                 <div className="absolute inset-x-0 bottom-6 flex justify-center z-20">
                    <button 
                      onClick={() => setIsScanning(false)}
                      className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-xs border border-white/30 hover:bg-white/30 transition-all"
                    >
                      CANCEL SCAN
                    </button>
                 </div>
                 <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
              </div>
           )}

           <div className="mt-8 space-y-4">
              {scanMode === 'LOCATION' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Manual Location Code</label>
                  <input 
                    type="text" 
                    placeholder="TZ-A-R01-L01-S01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono transition-all"
                  />
                </div>
              )}
              {scanMode === 'RELEASE' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Receiver Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm" />
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h2>
          <p className="text-gray-500 text-sm">Track packages currently stored in your warehouse.</p>
        </div>
        
        {role.startsWith('OPS') && (
          <button 
            onClick={() => setActiveView('SCAN_TOOLS')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Scan className="w-4 h-4" /> SCAN ACTIONS
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Warehouse</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Awaiting Location</p>
          <p className="text-2xl font-bold text-amber-600">{stats.awaitingLocation}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ready Release</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.ready}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Released (7d)</p>
          <p className="text-2xl font-bold text-blue-600">{stats.releasedLast7}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search package, shipment, customer..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value={PackageStatus.ARRIVED}>Awaiting Location</option>
            <option value={PackageStatus.LOCATED}>Located</option>
            <option value={PackageStatus.READY_FOR_RELEASE}>Ready for Release</option>
          </select>

          {role === UserRole.ADMIN && (
            <select 
              className="px-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              value={warehouseFilter}
              onChange={e => setWarehouseFilter(e.target.value)}
            >
              <option value="ALL">All Warehouses</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Package Detail</th>
                <th className="px-6 py-4">Shipment</th>
                <th className="px-6 py-4">Current Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{pkg.pkgCode}</p>
                    <p className="text-[10px] text-gray-400">{pkg.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{pkg.shipmentTrackingNo}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{pkg.customerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    {pkg.locationCode ? (
                       <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px] font-bold">
                         <MapIcon className="w-3 h-3 text-blue-500" /> {pkg.locationCode}
                       </div>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase">
                        <AlertCircle className="w-3 h-3" /> Needs Location
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      pkg.status === PackageStatus.READY_FOR_RELEASE ? 'bg-emerald-100 text-emerald-700' :
                      pkg.status === PackageStatus.LOCATED ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pkg.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedPackageId(pkg.id); setActiveView('DETAIL'); }}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                        title="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {role.startsWith('OPS') && (
                        <>
                          {!pkg.locationCode && (
                            <button 
                              className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-amber-600 transition-all"
                              title="Update Location"
                            >
                              <MapPin className="w-4 h-4" />
                            </button>
                          )}
                          {pkg.status === PackageStatus.LOCATED && (
                             <button 
                              onClick={() => handleMarkReady(pkg.id)}
                              className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-emerald-600 transition-all"
                              title="Mark Ready for Release"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
