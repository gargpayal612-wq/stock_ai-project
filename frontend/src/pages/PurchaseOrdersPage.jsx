import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Clock, 
  Plus, 
  AlertTriangle,
  RefreshCw,
  Calculator
} from 'lucide-react';

export const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Generate PO Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [createData, setCreateData] = useState({
    supplierId: 1,
    warehouseId: 1,
    quantity: 100,
    expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: 'Generated from Smart Restocking recommendations'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pos, recs] = await Promise.all([
        api.getPurchaseOrders(),
        api.getRestockRecommendations()
      ]);
      setPurchaseOrders(pos);
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (poId, newStatus) => {
    try {
      await api.updatePOStatus(poId, newStatus);
      setNotification(`Purchase Order status updated to '${newStatus}'!`);
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (e) {
      alert('Error updating purchase order status');
    }
  };

  const openGeneratePO = (rec) => {
    setSelectedRec(rec);
    setCreateData({
      supplierId: rec.preferredSupplierId || 1,
      warehouseId: 1,
      quantity: rec.recommendedPurchaseQuantity,
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: `Restock replenishment for ${rec.productName} (SKU: ${rec.sku}) based on AI 30-day forecast.`
    });
    setShowCreateModal(true);
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      await api.createPurchaseOrder({
        supplierId: createData.supplierId,
        warehouseId: createData.warehouseId,
        expectedDeliveryDate: createData.expectedDeliveryDate,
        notes: createData.notes,
        items: [
          {
            productId: selectedRec.productId,
            orderedQuantity: createData.quantity,
            unitCost: selectedRec.supplierUnitPrice || 4.40
          }
        ]
      });

      setShowCreateModal(false);
      setNotification(`Purchase order issued for ${selectedRec.productName}!`);
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (e) {
      alert('Error creating purchase order');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Smart Restocking & Purchase Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Predictive replenishment based on Scikit-Learn demand forecasting and supplier lead times.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Recommendations</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Smart Restock Calculation Formula Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Dynamic Inventory Replenishment Formula</span>
        </div>
        <div className="font-mono text-sm sm:text-base text-white font-bold mb-2">
          Recommended Purchase Quantity = Predicted Demand + Safety Stock − Available Stock − Expected Incoming Stock
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Automated recommendation pipeline evaluates projected 30-day velocity, minimum buffer stocks, and vendor lead times to eliminate both stockouts and holding cost penalties.
        </p>
      </div>

      {/* AI Restock Recommendations List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Recommended Purchase Orders</h2>
          </div>
          <span className="text-xs text-slate-400">{recommendations.length} products flagged for reorder</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.productId} 
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{rec.sku}</span>
                <h3 className="text-sm font-bold text-white tracking-tight mt-0.5 line-clamp-1">{rec.productName}</h3>
                
                {/* Stats Breakdown */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Predicted 30d Demand:</span>
                    <strong className="text-white font-mono">{rec.predictedDemand}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Safety Buffer:</span>
                    <strong className="text-indigo-400 font-mono">+{rec.safetyStock}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Stock:</span>
                    <strong className="text-amber-400 font-mono">{rec.currentStock}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Incoming Pipeline:</span>
                    <strong className="text-slate-300 font-mono">+{rec.incomingStock}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Recommended Order</span>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {rec.recommendedPurchaseQuantity} <span className="text-xs text-slate-400 font-normal">units</span>
                  </div>
                  {rec.preferredSupplierName && (
                    <span className="text-[10px] text-slate-400 block mt-1 truncate">
                      Vendor: <strong>{rec.preferredSupplierName}</strong>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => openGeneratePO(rec)}
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition flex items-center justify-center space-x-1.5"
              >
                <span>Create Purchase Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Orders Workflow Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Active & Historical Purchase Orders</h2>
          </div>
          <span className="text-xs text-slate-400">{purchaseOrders.length} orders total</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Destination Hub</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{po.poNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{po.supplierName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{po.warehouseName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">${po.totalAmount?.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{po.expectedDeliveryDate}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {po.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => handleUpdateStatus(po.id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold"
                      >
                        Approve
                      </button>
                    )}
                    {po.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(po.id, 'SENT')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold"
                      >
                        Dispatch / Sent
                      </button>
                    )}
                    {po.status === 'SENT' && (
                      <button
                        onClick={() => handleUpdateStatus(po.id, 'RECEIVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                      >
                        Receive Goods
                      </button>
                    )}
                    {po.status === 'RECEIVED' && (
                      <span className="text-[11px] text-slate-500 font-mono">Fulfilled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate PO Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title={`Generate Purchase Order: ${selectedRec?.productName || ''}`}
      >
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-[11px] block">Product & SKU</span>
              <span className="text-xs font-bold text-white">{selectedRec?.productName}</span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{selectedRec?.sku}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Unit Procurement Cost</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">${selectedRec?.supplierUnitPrice?.toFixed(2) || '4.40'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Order Quantity</label>
              <input
                type="number"
                min={1}
                required
                value={createData.quantity}
                onChange={(e) => setCreateData({ ...createData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Expected Delivery Date</label>
              <input
                type="date"
                required
                value={createData.expectedDeliveryDate}
                onChange={(e) => setCreateData({ ...createData, expectedDeliveryDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Destination Warehouse</label>
            <select
              value={createData.warehouseId}
              onChange={(e) => setCreateData({ ...createData, warehouseId: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value={1}>Central Midwest Mega Hub (Joliet, IL)</option>
              <option value={2}>West Coast Gateway Depot (Long Beach, CA)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">PO Notes / Special Instructions</label>
            <textarea
              rows={2}
              value={createData.notes}
              onChange={(e) => setCreateData({ ...createData, notes: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Estimated PO Total:</span>
            <span className="text-lg font-bold text-white font-mono">
              ${((selectedRec?.supplierUnitPrice || 4.40) * createData.quantity).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-750"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <span>Submit Purchase Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
