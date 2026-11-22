import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  User,
  ArrowRight
} from 'lucide-react';

export const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [notification, setNotification] = useState('');

  // New Sale Form
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    customerType: 'COMMERCIAL',
    warehouseId: 1,
    paymentMethod: 'CREDIT_CARD',
    discountAmount: 0,
    notes: ''
  });

  const [cartItems, setCartItems] = useState([
    { productId: 1, quantity: 5, unitPrice: 9.80 }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, prodsData, invData] = await Promise.all([
        api.getSales(),
        api.getProducts(),
        api.getInventory()
      ]);
      setSales(salesData);
      setProducts(prodsData);
      setInventory(invData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = () => {
    setCartItems([...cartItems, { productId: products[0]?.id || 1, quantity: 1, unitPrice: products[0]?.sellingPrice || 10.0 }]);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...cartItems];
    updated[index][field] = value;
    if (field === 'productId') {
      const p = products.find(prod => prod.id === Number(value));
      if (p) updated[index].unitPrice = p.sellingPrice;
    }
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax - Number(saleForm.discountAmount || 0);

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    try {
      // Stock validation
      for (const item of cartItems) {
        const inv = inventory.find(i => i.productId === Number(item.productId));
        if (inv && inv.availableStock < item.quantity) {
          alert(`Insufficient stock for ${inv.productName}. Available: ${inv.availableStock}`);
          return;
        }
      }

      await api.createSale({
        ...saleForm,
        items: cartItems
      });

      setShowNewSaleModal(false);
      setNotification('Sale order processed and warehouse inventory updated!');
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (err) {
      alert('Error recording sale order');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sales & Customer Fulfillment</h1>
          <p className="text-xs text-slate-400 mt-1">
            Order processing with transactional stock deductions and velocity analysis.
          </p>
        </div>

        <button
          onClick={() => setShowNewSaleModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Sale</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sales Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Historical Order Transactions</span>
          <span className="text-xs text-slate-400 font-mono">{sales.length} orders recorded</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Fulfilled From</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{s.saleOrderNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{s.customerName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {s.customerType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{s.warehouseName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                    ${s.finalAmount?.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      PAID
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{s.saleDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Sale Modal */}
      <Modal isOpen={showNewSaleModal} onClose={() => setShowNewSaleModal(false)} title="Record New Customer Sale Order" maxWidth="max-w-3xl">
        <form onSubmit={handleSubmitSale} className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer / Client Name</label>
              <input
                type="text"
                required
                value={saleForm.customerName}
                onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
                placeholder="e.g. Cascade Robotics LLC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Type</label>
              <select
                value={saleForm.customerType}
                onChange={(e) => setSaleForm({ ...saleForm, customerType: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="RETAIL">Retail Consumer</option>
                <option value="COMMERCIAL">Commercial Enterprise</option>
                <option value="WHOLESALE">Wholesale Distributor</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fulfillment Warehouse</label>
              <select
                value={saleForm.warehouseId}
                onChange={(e) => setSaleForm({ ...saleForm, warehouseId: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value={1}>Central Midwest Mega Hub (Joliet, IL)</option>
                <option value={2}>West Coast Gateway Depot (Long Beach, CA)</option>
              </select>
            </div>
          </div>

          {/* Cart Items */}
          <div className="border-t border-b border-slate-800 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">Ordered Product Items</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center space-x-1 hover:bg-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-850 p-2.5 rounded-xl border border-slate-750">
                  <div className="col-span-6">
                    <label className="text-[10px] text-slate-400 block mb-1">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.sellingPrice})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="col-span-1 text-center pt-4">
                    {cartItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(index)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-xs">
              <div>Subtotal: <strong className="text-white font-mono">${subtotal.toFixed(2)}</strong></div>
              <div>Estimated Tax (7%): <strong className="text-white font-mono">${tax.toFixed(2)}</strong></div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Sale Amount</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button 
              type="button" 
              onClick={() => setShowNewSaleModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <span>Authorize & Fulfill Sale</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
