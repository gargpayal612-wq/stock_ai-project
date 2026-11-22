import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Boxes, 
  ShoppingCart, 
  Truck, 
  FileText, 
  TrendingUp, 
  Navigation, 
  AlertTriangle, 
  Bell, 
  Sparkles, 
  UserCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Inventory Control', to: '/inventory', icon: Boxes, badge: 'Live' },
    { name: 'Sales Orders', to: '/sales', icon: ShoppingCart, badge: null },
    { name: 'Suppliers Directory', to: '/suppliers', icon: Truck, badge: null },
    { name: 'Smart Restocking & POs', to: '/purchase-orders', icon: FileText, badge: 'Auto' },
    { name: 'AI Demand Forecast', to: '/forecasting', icon: TrendingUp, badge: 'ML' },
    { name: 'Shipment Tracking', to: '/shipments', icon: Navigation, badge: null },
    { name: 'Delay-Risk Analytics', to: '/delay-risk', icon: AlertTriangle, badge: 'High' },
    { name: 'Alerts & Actions', to: '/alerts', icon: Bell, badge: '5' },
    { name: 'Gemini Assistant', to: '/ai-assistant', icon: Sparkles, badge: 'AI' },
    { name: 'User Profile & Role', to: '/profile', icon: UserCircle, badge: null },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-800 bg-slate-900 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        <div className="px-3 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Enterprise Modules
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    item.badge === 'ML' || item.badge === 'AI' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : item.badge === 'High'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Role Card in Sidebar Footer */}
      <div className="pt-4 mt-6 border-t border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750">
          <div className="flex items-center space-x-2 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Authorized Mode</span>
          </div>
          <div className="text-xs font-semibold text-white">{user?.fullName || 'User'}</div>
          <div className="text-[11px] text-indigo-400 font-mono mt-0.5">ROLE_{user?.role || 'RETAILER'}</div>
        </div>
      </div>
    </aside>
  );
};
