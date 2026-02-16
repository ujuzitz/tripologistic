
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Architecture } from './components/Architecture';
import { WarehouseOps } from './components/WarehouseOps';
import { Workflow } from './components/Workflow';
import { Authorization } from './components/Authorization';
import { AuditTrail } from './components/AuditTrail';
import { ApiSpec } from './components/ApiSpec';
import { DatabaseEnforcement } from './components/DatabaseEnforcement';
import { ShipmentDetail } from './components/ShipmentDetail';
import { FinanceHub } from './components/FinanceHub';
import { ExpenseManagement } from './components/ExpenseManagement';
import { ShipmentConsole } from './components/ShipmentConsole';
import { Customers } from './components/Customers';
import { Inventory } from './components/Inventory';
import { UserRole } from './types';
import { Search, Bell, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const renderContent = () => {
    if (selectedShipmentId) {
      return <ShipmentDetail shipmentId={selectedShipmentId} onBack={() => setSelectedShipmentId(null)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'finance-dashboard':
        return <FinanceHub />;
      case 'architecture':
        return <Architecture />;
      case 'scanning':
        return <WarehouseOps />;
      case 'workflow':
        return <Workflow />;
      case 'authorization':
        return <Authorization />;
      case 'audit':
        return <AuditTrail />;
      case 'api-spec':
        return <ApiSpec />;
      case 'db-enforcement':
        return <DatabaseEnforcement />;
      case 'expenses':
        return <ExpenseManagement role={userRole} />;
      case 'customers':
        return <Customers role={userRole} />;
      case 'packages':
        return <Inventory role={userRole} />;
      case 'shipments':
        return (
          <ShipmentConsole 
            role={userRole} 
            onViewShipment={(id) => setSelectedShipmentId(id)}
            onScanShipment={(id, mode) => {
              setActiveTab('scanning');
            }}
            onExpensesShipment={() => setActiveTab('expenses')}
          />
        );
      case 'invoices':
        return <div className="p-12 text-center text-gray-400">Global Financial Billing</div>;
      case 'reports':
        return <div className="p-12 text-center text-gray-400">Operational & Financial Reports</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        setUserRole={setUserRole} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center flex-1 max-w-md relative group">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Search tracking numbers, customers..." 
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r pr-6 border-gray-200">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">James Kariuki</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                  {userRole.replace('_', ' ')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                JK
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
