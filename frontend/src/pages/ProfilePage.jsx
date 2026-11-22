import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserCircle, 
  ShieldCheck, 
  Building, 
  Mail, 
  Phone, 
  Key, 
  CheckCircle2, 
  Lock,
  Layers
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, switchRolePreset, ROLE_PRESETS } = useAuth();

  const rolePermissions = [
    { module: 'Executive Dashboard & Financial Valuation', admin: true, retailer: false, wholesaler: false, supplier: false, mfg: false, delivery: false },
    { module: 'Product Catalog Management (CRUD)', admin: true, retailer: true, wholesaler: false, supplier: false, mfg: false, delivery: false },
    { module: 'Multi-Warehouse Inventory Stock Adjustment', admin: true, retailer: true, wholesaler: true, supplier: false, mfg: true, delivery: false },
    { module: 'Record Customer Sales Transactions', admin: true, retailer: true, wholesaler: true, supplier: false, mfg: false, delivery: false },
    { module: 'Generate AI Demand Restock Recommendations', admin: true, retailer: true, wholesaler: true, supplier: false, mfg: false, delivery: false },
    { module: 'Create & Issue Purchase Orders to Suppliers', admin: true, retailer: true, wholesaler: true, supplier: false, mfg: true, delivery: false },
    { module: 'Approve Capital Expenditure Purchase Orders', admin: true, retailer: false, wholesaler: false, supplier: false, mfg: false, delivery: false },
    { module: 'Fulfill Purchase Orders & Confirm Dispatches', admin: true, retailer: false, wholesaler: false, supplier: true, mfg: true, delivery: false },
    { module: 'Update Logistics Checkpoints & Delivery Milestones', admin: true, retailer: false, wholesaler: false, supplier: false, mfg: false, delivery: true },
    { module: 'Query Gemini Conversational AI Assistant', admin: true, retailer: true, wholesaler: true, supplier: true, mfg: true, delivery: true },
  ];

  const currentPreset = ROLE_PRESETS.find(p => p.role === user?.role) || ROLE_PRESETS[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Enterprise User Profile & RBAC Security</h1>
        <p className="text-xs text-slate-400 mt-1">
          Role-Based Access Control credentials and operational permissions matrix.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
            {user?.fullName ? user.fullName[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentPreset.color}`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-indigo-400 font-semibold">{user?.companyName}</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 text-xs text-slate-400 space-y-1">
          <div>Authentication: <strong className="text-white font-mono">Stateless JWT (HMAC-SHA256)</strong></div>
          <div>Encryption: <strong className="text-white font-mono">BCrypt ($2a$10$)</strong></div>
          <div>Status: <strong className="text-emerald-400 font-semibold">Active Authorized Session</strong></div>
        </div>
      </div>

      {/* Quick Switch Role Preset for Testing */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Switch Evaluator Persona</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2">Instant Role Persona Quick-Switch</h3>
        <p className="text-xs text-slate-400 mb-4">
          Click any persona below to immediately simulate that user's permissions and workflow restrictions across the platform:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROLE_PRESETS.map((p) => (
            <button
              key={p.role}
              onClick={() => switchRolePreset(p.role)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                user?.role === p.role 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold shadow-md' 
                  : 'bg-slate-850 border-slate-750 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">{p.role}</span>
                <span className="text-[11px] text-slate-400">{p.name}</span>
              </div>
              <span className="text-[10px] text-indigo-400 mt-2 block truncate">{p.company}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Enterprise Role-Based Access Control (RBAC) Matrix</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">System Module / Operation</th>
                <th className="py-2.5 px-2 text-center">Admin</th>
                <th className="py-2.5 px-2 text-center">Retailer</th>
                <th className="py-2.5 px-2 text-center">Wholesaler</th>
                <th className="py-2.5 px-2 text-center">Supplier</th>
                <th className="py-2.5 px-2 text-center">Manufacturer</th>
                <th className="py-2.5 px-2 text-center">Delivery Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rolePermissions.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="py-2.5 px-3 font-medium text-white">{row.module}</td>
                  <td className="py-2.5 px-2 text-center">{row.admin ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                  <td className="py-2.5 px-2 text-center">{row.retailer ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                  <td className="py-2.5 px-2 text-center">{row.wholesaler ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                  <td className="py-2.5 px-2 text-center">{row.supplier ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                  <td className="py-2.5 px-2 text-center">{row.mfg ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                  <td className="py-2.5 px-2 text-center">{row.delivery ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
