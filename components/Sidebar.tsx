
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import { UserRole } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, setUserRole }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">ST</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SinoTan</h1>
            <p className="text-xs text-slate-400">Logistics Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.filter(item => item.roles.includes(userRole)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-600' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase">
            <UserIcon className="w-3 h-3" /> User Role
          </div>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full bg-slate-900 text-sm border border-slate-700 rounded p-1 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value={UserRole.ADMIN}>Administrator</option>
            <option value={UserRole.FINANCE}>Finance Global</option>
            <option value={UserRole.OPS_CHINA}>Ops China</option>
            <option value={UserRole.OPS_TANZANIA}>Ops Tanzania</option>
          </select>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
