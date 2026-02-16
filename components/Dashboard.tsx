import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Package, Truck, Receipt, AlertCircle, FileText, ClipboardList } from 'lucide-react';

const data = [
  { name: 'Jan', shipments: 400, revenue: 2400 },
  { name: 'Feb', shipments: 300, revenue: 1398 },
  { name: 'Mar', shipments: 600, revenue: 9800 },
  { name: 'Apr', shipments: 800, revenue: 3908 },
  { name: 'May', shipments: 500, revenue: 4800 },
  { name: 'Jun', shipments: 700, revenue: 3800 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Logistics Command Center</h2>
        <div className="flex gap-2">
           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             System Online
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

        <div className="bg-slate-900 p-6 rounded-xl shadow-md text-white overflow-hidden relative border border-slate-800">
          <div className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12 bg-blue-500 rounded-full blur-3xl opacity-20" />
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" /> Operational Summary
          </h3>
          <div className="space-y-4 text-sm leading-relaxed relative z-10">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-slate-300">Transit times have improved by 12% following the new route optimizations in the Dar es Salaam corridor.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Financials</p>
              <p className="text-slate-300">Net margins stabilized at 32% MTD. Revenue is trending up for the Q2 forecast.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Risk Alert</p>
              <p className="text-slate-300">3 high-priority shipments are awaiting documentation approval at Guangzhou customs.</p>
            </div>
          </div>
          <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors">
            DOWNLOAD DETAILED REPORT
          </button>
        </div>
      </div>
    </div>
  );
};