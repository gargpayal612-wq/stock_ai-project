import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatsCard } from '../components/common/StatsCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Boxes, 
  Truck, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Navigation, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardSummary();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Aggregating live supply chain metrics...</span>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Supply Chain Operations Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise Network Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-warehouse telemetry, replenishment triggers, and delay-risk forecasting.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchDashboard}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Data</span>
          </button>
          <Link
            to="/purchase-orders"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
          >
            <span>Smart Restock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Products"
          value={data?.totalProducts || 15}
          change="+2 new"
          isPositive={true}
          icon={Boxes}
          color="indigo"
          subtitle="Across 5 product categories"
        />
        <StatsCard 
          title="Active Suppliers"
          value={data?.totalSuppliers || 6}
          change="96.5% avg"
          isPositive={true}
          icon={Truck}
          color="emerald"
          subtitle="Avg reliability score"
        />
        <StatsCard 
          title="Total Inventory Value"
          value={`$${(data?.totalInventoryCostValue || 48250).toLocaleString()}`}
          change="$104k retail"
          isPositive={true}
          icon={DollarSign}
          color="blue"
          subtitle="Cost basis across warehouses"
        />
        <StatsCard 
          title="Low & Out of Stock"
          value={`${data?.lowStockCount || 5} / ${data?.outOfStockCount || 1}`}
          change="Needs Action"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
          subtitle="5 low stock, 1 out of stock"
        />
        <StatsCard 
          title="Pending Purchase Orders"
          value={data?.pendingPurchaseOrders || 3}
          change="Awaiting PO"
          isPositive={true}
          icon={FileText}
          color="amber"
          subtitle="Replenishment pipeline"
        />
        <StatsCard 
          title="Active Shipments"
          value={data?.activeShipments || 3}
          change="In Transit"
          isPositive={true}
          icon={Navigation}
          color="cyan"
          subtitle="Inter-hub & import logistics"
        />
        <StatsCard 
          title="Delayed Shipments"
          value={data?.delayedShipments || 1}
          change="High Risk"
          isPositive={false}
          icon={Clock}
          color="rose"
          subtitle="TRK-OPT-4419 held at customs"
        />
        <StatsCard 
          title="30-Day Sales Revenue"
          value={`$${(data?.totalSalesRevenue || 18210).toLocaleString()}`}
          change="+18.4%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
          subtitle="POS & Wholesale commercial"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Sales Revenue Velocity</h3>
              <p className="text-xs text-slate-400">Daily gross revenue and order volume trends</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Last 7 Days
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.recentSalesTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Stock Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Stock Distribution</h3>
              <span className="text-xs text-slate-400">By Category</span>
            </div>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryStockDistribution || []}
                    dataKey="totalStock"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {(data?.categoryStockDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                    formatter={(val) => [`${val} units`, 'Stock']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {(data?.categoryStockDistribution || []).slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300 truncate">{item.category}</span>
                </div>
                <span className="text-slate-400 font-mono font-medium">{item.totalStock} units</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Low Stock Replenishment Action Table & Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Low Stock Urgent Items Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Critical Inventory Replenishment Priority</h3>
            </div>
            <Link to="/inventory" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Available</th>
                  <th className="py-3 px-3">Threshold</th>
                  <th className="py-3 px-3">Incoming</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {(data?.topLowStockProducts || []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-3 font-medium text-white max-w-[200px] truncate">{item.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{item.sku}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{item.totalAvailableStock}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{item.reorderThreshold}</td>
                    <td className="py-3 px-3 font-mono text-indigo-400">+{item.totalIncomingStock}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.stockStatus} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link 
                        to="/purchase-orders"
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-semibold transition"
                      >
                        Reorder
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Suppliers by Reliability */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Top Supplier Reliability</h3>
            </div>
            <Link to="/suppliers" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
              Directory
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.topSuppliers || []).map((sup) => (
              <div key={sup.id} className="p-3 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[170px]">{sup.name}</div>
                  <div className="text-[10px] text-slate-400">{sup.city}, {sup.country}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-400 font-mono">{sup.reliabilityScore}%</div>
                  <div className="text-[10px] text-slate-400">{sup.totalOrdersCompleted} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
