
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { CreditCard, TrendingUp, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const financeData = [
  { name: 'Week 1', revenue: 45000, expenses: 32000 },
  { name: 'Week 2', revenue: 52000, expenses: 28000 },
  { name: 'Week 3', revenue: 48000, expenses: 41000 },
  { name: 'Week 4', revenue: 61000, expenses: 35000 },
];

export const FinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Total Revenue (MTD)</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">$206,400</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Pending Collections</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">$34,200</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
              -4% <ArrowDownRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">OpEx Burn Rate</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">$136,000</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Profitability Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
           <div>
              <h3 className="font-bold text-indigo-400 mb-4 uppercase tracking-widest text-xs">Financial Compliance Health</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Profit margins are currently holding at <strong>34%</strong>. The highest expense spike originated from port clearance delays in Dar es Salaam during Week 3.
              </p>
           </div>
           
           <div className="space-y-4 mt-8">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Audit Readiness Score</span>
                <span className="text-xl font-bold text-emerald-400">98%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[98%] rounded-full shadow-[0_0_10px_#34d399]"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
