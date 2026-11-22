import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Boxes, 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  History, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await api.getProductById(id);
        const m = await api.getMovements(id);
        setProduct(p);
        setMovements(m);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span>Loading product details...</span>
      </div>
    );
  }

  const margin = product.costPrice && product.sellingPrice 
    ? (((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link 
            to="/inventory"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{product.name}</h1>
              <StatusBadge status={product.stockStatus} />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku} | Category: {product.categoryName}</p>
          </div>
        </div>

        <Link
          to="/purchase-orders"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Replenish via PO</span>
        </Link>
      </div>

      {/* Product Spec Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cost Price</span>
          <div className="text-xl font-extrabold text-white font-mono mt-1">${product.costPrice?.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500">Unit procurement cost</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Selling Price</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">${product.sellingPrice?.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">{margin}% Gross Margin</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Available Stock</span>
          <div className="text-xl font-extrabold text-white font-mono mt-1">{product.totalAvailableStock} {product.unit}</div>
          <span className="text-[10px] text-slate-500">Across active warehouses</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Safety Buffer</span>
          <div className="text-xl font-extrabold text-indigo-400 font-mono mt-1">{product.minSafetyStock} {product.unit}</div>
          <span className="text-[10px] text-slate-500">Threshold: {product.reorderThreshold}</span>
        </div>
      </div>

      {/* Warehouse Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Warehouse Distribution</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Central Midwest Mega Hub</span>
                <span className="text-[10px] text-slate-400 block font-mono">WH-CHI-01 • Joliet, IL</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">{product.totalAvailableStock} units</span>
                <span className="text-[10px] text-indigo-400 block">+{product.totalIncomingStock} in transit</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">West Coast Gateway Depot</span>
                <span className="text-[10px] text-slate-400 block font-mono">WH-LAX-02 • Long Beach, CA</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">0 units</span>
                <span className="text-[10px] text-slate-500 block">Surplus allocation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Sourcing Comparison */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Supplier Sourcing Comparison</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-indigo-500/40 relative">
              <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Preferred Partner
              </span>
              <div className="text-xs font-bold text-white">Nippon Micro Silicon Tech</div>
              <div className="text-[10px] text-slate-400">Tokyo, Japan • Lead Time: 10 Days</div>
              <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Unit Price: <strong className="text-white font-mono">${product.costPrice?.toFixed(2)}</strong></span>
                <span className="text-emerald-400 font-semibold font-mono">96.5% Reliability</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Stock Movements */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Audit Ledger for this SKU</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Reference Order</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {movements.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.movementType === 'SALE' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {m.movementType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{m.referenceId}</td>
                  <td className="py-2.5 px-3 text-slate-400">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
