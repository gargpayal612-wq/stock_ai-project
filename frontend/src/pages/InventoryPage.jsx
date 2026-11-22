import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  SlidersHorizontal, 
  History, 
  RefreshCw, 
  ArrowUpDown,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showMovementsModal, setShowMovementsModal] = useState(false);
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState(null);
  const [movements, setMovements] = useState([]);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    categoryId: 1,
    costPrice: 5.00,
    sellingPrice: 12.00,
    unit: 'units',
    reorderThreshold: 100,
    minSafetyStock: 30,
    leadTimeDays: 7,
    description: ''
  });

  const [adjustData, setAdjustData] = useState({
    delta: 50,
    reason: 'Inventory count reconciliation'
  });

  const [notification, setNotification] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(selectedWarehouse, selectedCategory, lowStockFilter);
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedWarehouse, selectedCategory, lowStockFilter]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(newProduct);
      setShowAddModal(false);
      setNotification(`Product '${newProduct.name}' added successfully!`);
      setTimeout(() => setNotification(''), 4000);
      fetchInventory();
    } catch (err) {
      alert('Error creating product');
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!selectedItemForAdjust) return;
    try {
      await api.adjustStock(
        selectedItemForAdjust.productId, 
        selectedItemForAdjust.warehouseId, 
        adjustData.delta, 
        adjustData.reason
      );
      setShowAdjustModal(false);
      setNotification(`Stock updated for ${selectedItemForAdjust.productName}`);
      setTimeout(() => setNotification(''), 4000);
      fetchInventory();
    } catch (err) {
      alert('Stock adjustment error');
    }
  };

  const openMovements = async (productId = null) => {
    const data = await api.getMovements(productId);
    setMovements(data);
    setShowMovementsModal(true);
  };

  const filteredInventory = inventory.filter(item => {
    const q = search.toLowerCase();
    return item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory Control & Stock Master</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock monitoring across warehouses, reorder thresholds, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => openMovements()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Audit Trail</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="1">Electronics & Semiconductors</option>
            <option value="2">Industrial Hardware & Fasteners</option>
            <option value="3">Consumer Electronics & Gadgets</option>
            <option value="4">Packaging & Shipping Supplies</option>
            <option value="5">Automotive & Robotics Sensors</option>
          </select>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Warehouses</option>
            <option value="1">Central Midwest Hub (Joliet, IL)</option>
            <option value="2">West Coast Gateway (Long Beach, CA)</option>
          </select>

          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              lowStockFilter 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Low Stock Only</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Warehouse</th>
                <th className="py-3.5 px-4">Available</th>
                <th className="py-3.5 px-4">Reserved</th>
                <th className="py-3.5 px-4">Incoming</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <Link to={`/products/${item.productId}`} className="font-bold text-white hover:text-indigo-400 transition flex items-center space-x-1">
                      <span>{item.productName}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </Link>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{item.sku}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{item.categoryName}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-medium">{item.warehouseName}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{item.warehouseCode}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">{item.availableStock}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{item.reservedStock}</td>
                  <td className="py-3.5 px-4 font-mono text-indigo-400">+{item.incomingStock}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{item.reorderThreshold}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.stockStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItemForAdjust(item);
                        setShowAdjustModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
                    >
                      Adjust
                    </button>
                    <Link
                      to={`/products/${item.productId}`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-semibold transition inline-block"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product to Catalog">
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
            <input 
              type="text" 
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g. ESP32-S3 Dual Core WiFi/BLE Module"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">SKU</label>
              <input 
                type="text" 
                required
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="ELEC-WIFI-009"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={1}>Electronics & Semiconductors</option>
                <option value={2}>Industrial Hardware</option>
                <option value={3}>Consumer Electronics</option>
                <option value={4}>Packaging Supplies</option>
                <option value={5}>Automotive & Robotics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cost Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={newProduct.costPrice}
                onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Selling Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={newProduct.sellingPrice}
                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit</label>
              <input 
                type="text" 
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reorder Threshold</label>
              <input 
                type="number" 
                value={newProduct.reorderThreshold}
                onChange={(e) => setNewProduct({ ...newProduct, reorderThreshold: parseInt(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Safety Stock</label>
              <input 
                type="number" 
                value={newProduct.minSafetyStock}
                onChange={(e) => setNewProduct({ ...newProduct, minSafetyStock: parseInt(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lead Time (Days)</label>
              <input 
                type="number" 
                value={newProduct.leadTimeDays}
                onChange={(e) => setNewProduct({ ...newProduct, leadTimeDays: parseInt(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea 
              rows={2}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-750"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal 
        isOpen={showAdjustModal} 
        onClose={() => setShowAdjustModal(false)} 
        title={`Adjust Stock: ${selectedItemForAdjust?.productName || ''}`}
      >
        <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <span className="text-slate-400 block text-[11px]">Current Available</span>
              <span className="text-xl font-bold text-white font-mono">{selectedItemForAdjust?.availableStock} units</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Warehouse</span>
              <span className="text-xs font-semibold text-slate-200">{selectedItemForAdjust?.warehouseName}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delta Quantity (+ or -)</label>
            <input 
              type="number" 
              required
              value={adjustData.delta}
              onChange={(e) => setAdjustData({ ...adjustData, delta: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Resulting available stock will be: <strong>{Math.max(0, (selectedItemForAdjust?.availableStock || 0) + adjustData.delta)} units</strong>
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reason for Adjustment</label>
            <input 
              type="text" 
              required
              value={adjustData.reason}
              onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setShowAdjustModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-750"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </Modal>

      {/* Audit Movements Modal */}
      <Modal isOpen={showMovementsModal} onClose={() => setShowMovementsModal(false)} title="Immutable Stock Audit Ledger" maxWidth="max-w-3xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Prev → New</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {movements.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.movementType === 'SALE' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {m.movementType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {m.previousStock} → {m.newStock}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{m.referenceId}</td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

    </div>
  );
};
