import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Navigation, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink,
  Edit
} from 'lucide-react';

export const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: 'IN_TRANSIT',
    notes: ''
  });
  const [notification, setNotification] = useState('');

  const loadShipments = async () => {
    setLoading(true);
    try {
      const data = await api.getShipments();
      setShipments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const openUpdate = (s) => {
    setSelectedShipment(s);
    setStatusForm({
      status: s.currentStatus,
      notes: s.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.updateShipmentStatus(selectedShipment.id, statusForm.status, statusForm.notes);
      setShowUpdateModal(false);
      setNotification(`Shipment ${selectedShipment.trackingNumber} updated to '${statusForm.status}'`);
      setTimeout(() => setNotification(''), 4000);
      loadShipments();
    } catch (e) {
      alert('Error updating shipment status');
    }
  };

  const getStepProgress = (status) => {
    const steps = ['PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    if (status === 'DELAYED') return 2;
    const idx = steps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Shipment Tracking & Transit Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated multimodal logistics telemetry, milestone confirmations, and customs clearance monitoring.
          </p>
        </div>

        <button
          onClick={loadShipments}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tracking</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Simulated Tracking Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>Carrier simulation mode active. Standard manual milestone check-ins recorded via API.</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Simulated Pipeline
        </span>
      </div>

      {/* Shipments Cards Grid */}
      <div className="space-y-4">
        {shipments.map((s) => {
          const progress = getStepProgress(s.currentStatus);
          const steps = ['Processing', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];

          return (
            <div 
              key={s.id} 
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-white font-mono">{s.trackingNumber}</span>
                    <StatusBadge status={s.currentStatus} />
                    {s.delayRiskLevel === 'HIGH' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> High Delay Risk ({s.delayRiskScore * 100}%)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Carrier: <strong className="text-slate-200">{s.carrierName}</strong> • PO: <strong className="text-indigo-400 font-mono">{s.poNumber}</strong> ({s.supplierName})
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Delivery</span>
                    <span className="text-xs font-bold text-white font-mono">{s.estimatedDeliveryDate}</span>
                  </div>
                  <button
                    onClick={() => openUpdate(s)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                    title="Update Status"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="relative mb-6">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                  <div 
                    style={{ width: `${(progress / 4) * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      s.currentStatus === 'DELAYED' ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  {steps.map((step, idx) => (
                    <span 
                      key={step} 
                      className={`${idx <= progress ? 'text-white font-bold' : 'text-slate-600'}`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              {/* Route & Delay Reason Details */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Origin: <strong>{s.originLocation}</strong></span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="text-slate-300">
                    <span>Dest: <strong>{s.destinationWarehouseName}</strong></span>
                  </div>
                </div>

                {s.delayReason && (
                  <div className="text-rose-400 font-medium flex items-center space-x-1.5 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{s.delayReason}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Update Shipment Status Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title={`Update Shipment: ${selectedShipment?.trackingNumber || ''}`}>
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Logistics Milestone Status</label>
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="PROCESSING">Processing at Origin Hub</option>
              <option value="DISPATCHED">Dispatched by Carrier</option>
              <option value="IN_TRANSIT">In Transit / Freight Linehaul</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered to Warehouse</option>
              <option value="DELAYED">Delayed / Exception Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Status Notes / Checkpoint Location</label>
            <textarea
              rows={3}
              value={statusForm.notes}
              onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
              placeholder="e.g. Scanned through Chicago sorting junction"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setShowUpdateModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
