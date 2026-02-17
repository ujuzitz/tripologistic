import React, { useState, useEffect } from 'react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis 
} from 'recharts';
import { Package, Truck, Receipt, AlertCircle, Sparkles, ClipboardList, RefreshCw } from 'lucide-react';
import { getLogisticsInsights } from '../services/geminiService';

const data = [
  { name: 'Jan', shipments: 400, revenue: 2400 },
  { name: 'Feb', shipments: 300, revenue: 1398 },
  { name: 'Mar', shipments: 600, revenue: 9800 },
  { name: 'Apr', shipments: 800, revenue: 3908 },
  { name: 'May', shipments: 500, revenue: 4800 },
  { name: 'Jun', shipments: 700, revenue: 3800 },
];

export const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const dashboardStats = {
      activeShipments: 124,
      pendingDelivery: 45,
      unpaidInvoices: 12400,
      opsAlerts: 3,
      revenueTrend: data
    };
    const result = await getLogisticsInsights(dashboardStats);
    setInsights(result || "Unable to generate insights at this time.");
    setLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Logistics Command Center</h2>
          <p className="text-gray-500 text-sm">Real-time China-Tanzania Operational Feed</p>
        </div>
        <div className="flex gap-2">
           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             Live Sync
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: '124', icon: <Truck />, color: 'blue' },
          { label: 'Pending Delivery', value: '45', icon: <Package />, color: 'purple' },
          { label: 'Unpaid Invoices', value: '$12,400', icon: <Receipt />, color: 'red' },
          { label: 'Ops Alerts', value: '3', icon: <AlertCircle />, color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Revenue Performance (USD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow-md text-white overflow-hidden relative border border-slate-800 flex flex-col">
          <div className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12 bg-blue-500 rounded-full blur-3xl opacity-20" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" /> AI Insights
            </h3>
            <button 
              onClick={fetchInsights} 
              disabled={loadingInsights}
              className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loadingInsights ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 space-y-4 text-sm leading-relaxed relative z-10">
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                <p className="text-xs font-mono">Analyzing logistics data...</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 h-full overflow-y-auto">
                <p className="text-slate-300 whitespace-pre-line text-xs italic">
                  {insights || "Click refresh to generate AI operational analysis."}
                </p>
              </div>
            )}
          </div>
          
          <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors">
            DOWNLOAD FULL REPORT
          </button>
        </div>
      </div>
    </div>
  );
};
