
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Package, Truck, Receipt, AlertCircle, Sparkles } from 'lucide-react';
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
  const [insights, setInsights] = React.useState<string>('Analyzing trends...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      const res = await getLogisticsInsights(data);
      // Ensure we set a string to the insights state
      setInsights(res || "No insights available.");
      setLoading(false);
    };
    fetchInsights();
  }, []);

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
              {/* Fix: cast icon to ReactElement<any> to allow passing className via cloneElement */}
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

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white overflow-hidden relative">
          <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white/10 rotate-12" />
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Gemini AI Insights
          </h3>
          <div className="space-y-4 text-sm leading-relaxed relative z-10">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-blue-50 font-medium whitespace-pre-wrap">{insights}</p>
            )}
          </div>
          <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-colors">
            REFRESH ANALYSIS
          </button>
        </div>
      </div>
    </div>
  );
};
