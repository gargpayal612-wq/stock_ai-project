import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Modal } from '../components/common/Modal';
import { 
  Truck, 
  Plus, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState('');

  const [newSup, setNewSup] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    country: 'USA',
    paymentTerms: 'Net 30'
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await api.createSupplier(newSup);
      setShowAddModal(false);
      setNotification(`Supplier '${newSup.name}' registered successfully!`);
      setTimeout(() => setNotification(''), 4000);
      loadSuppliers();
    } catch (err) {
      alert('Error registering supplier');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Supplier Intelligence & Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Verifiable vendor performance scorecards evaluated from historical on-time delivery and quality metrics.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div 
            key={sup.id} 
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{sup.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">{sup.code}</span>
                </div>
                <div className="text-right">
                  <div className={`text-base font-extrabold font-mono ${
                    sup.reliabilityScore >= 90 ? 'text-emerald-400' : (sup.reliabilityScore >= 80 ? 'text-amber-400' : 'text-rose-400')
                  }`}>
                    {sup.reliabilityScore}%
                  </div>
                  <span className="text-[10px] text-slate-500 block">Reliability Score</span>
                </div>
              </div>

              {/* Badges and location */}
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-4">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{sup.city}, {sup.country}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-850 border border-slate-750 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">On-Time</span>
                  <span className="text-xs font-bold text-white font-mono">{sup.onTimeDeliveryRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quality</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{sup.qualityRating} / 5.0</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Orders</span>
                  <span className="text-xs font-bold text-indigo-400 font-mono">{sup.totalOrdersCompleted}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sup.phone || '+1 555-0100'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Terms: <strong className="text-white">{sup.paymentTerms}</strong></span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                sup.reliabilityScore >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {sup.reliabilityScore >= 90 ? 'Verified Tier 1' : 'Active Vendor'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register Enterprise Supplier">
        <form onSubmit={handleAddSupplier} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Supplier Name</label>
            <input 
              type="text" 
              required
              value={newSup.name}
              onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
              placeholder="e.g. Nippon Micro Silicon Tech"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Supplier Code</label>
              <input 
                type="text" 
                required
                value={newSup.code}
                onChange={(e) => setNewSup({ ...newSup, code: e.target.value })}
                placeholder="SUP-NIP-09"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
              <input 
                type="text" 
                value={newSup.contactPerson}
                onChange={(e) => setNewSup({ ...newSup, contactPerson: e.target.value })}
                placeholder="Kenji Takahashi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input 
                type="email" 
                required
                value={newSup.email}
                onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                placeholder="procure@supplier.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone</label>
              <input 
                type="text" 
                value={newSup.phone}
                onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                placeholder="+1 555-0100"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input 
                type="text" 
                value={newSup.city}
                onChange={(e) => setNewSup({ ...newSup, city: e.target.value })}
                placeholder="Tokyo"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Terms</label>
              <select
                value={newSup.paymentTerms}
                onChange={(e) => setNewSup({ ...newSup, paymentTerms: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
