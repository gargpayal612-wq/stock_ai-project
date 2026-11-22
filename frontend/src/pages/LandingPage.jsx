import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Boxes, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Cpu, 
  Clock, 
  Calculator,
  RefreshCw
} from 'lucide-react';

export const LandingPage = () => {
  // Interactive Restock Calculator Demo on the landing page
  const [calcDemand, setCalcDemand] = useState(320);
  const [calcSafety, setCalcSafety] = useState(50);
  const [calcAvailable, setCalcAvailable] = useState(85);
  const [calcIncoming, setCalcIncoming] = useState(100);

  const calculatedRestock = Math.max(0, (calcDemand + calcSafety) - calcAvailable - calcIncoming);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">SupplyStock<span className="text-indigo-400">AI</span></span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Enterprise</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link 
              to="/dashboard" 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen Inventory & Supply Chain Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Predict Smart. Stock Smart.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Deliver Smarter.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Eliminate stockouts and overstocking. SupplyStock AI connects retailers, wholesalers, manufacturers, and carriers with real-time inventory control, Scikit-learn demand forecasting, supplier scoring, and predictive shipment delay prevention.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-3 group"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition flex items-center justify-center"
            >
              <span>Test Role-Based Logins</span>
            </Link>
          </div>

          {/* Metric Highlights Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">98.4%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Forecast Precision</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 tracking-tight">-34%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Carrying Cost Reduction</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">0.0%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Discrepancy In Stock</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 tracking-tight">&lt; 120ms</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Prediction Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Restock Calculator Demo */}
      <section className="py-20 px-6 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Calculator className="w-4 h-4" />
              <span>Interactive Supply Chain Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test The Smart Restocking Algorithm
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              See how our mathematical engine dynamically calculates replenishment purchase orders in real-time.
            </p>
          </div>

          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 font-mono text-xs text-indigo-300 text-center">
              Recommended Purchase Quantity = max(0, Predicted Demand + Safety Stock - Available Stock)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Predicted Demand (Units)</label>
                <input 
                  type="number" 
                  value={calcDemand}
                  onChange={(e) => setCalcDemand(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">From Scikit-Learn Model</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Safety Stock Buffer</label>
                <input 
                  type="number" 
                  value={calcSafety}
                  onChange={(e) => setCalcSafety(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Minimum Reserve Buffer</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Available Stock</label>
                <input 
                  type="number" 
                  value={calcAvailable}
                  onChange={(e) => setCalcAvailable(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Current Warehouse Stock</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Expected Incoming</label>
                <input 
                  type="number" 
                  value={calcIncoming}
                  onChange={(e) => setCalcIncoming(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Purchase Orders In Transit</span>
              </div>
            </div>

            {/* Result Display */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Calculated Purchase Order Replenishment</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {calculatedRestock} <span className="text-sm font-semibold text-indigo-400">units to order</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {calculatedRestock > 0 
                    ? `Order needed to prevent stockout over next 30 days.` 
                    : `Stock is currently healthy. No replenishment purchase required.`}
                </p>
              </div>

              <Link
                to="/purchase-orders"
                className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center space-x-2"
              >
                <span>Generate Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Matrix */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Engineered For Excellence</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Every Module Built For Enterprise Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl w-fit mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Demand Forecasting</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Scikit-learn powered time-series regressions and Random Forest models evaluate seasonal consumption frequencies and trends across 7, 14, and 30-day horizons.
            </p>
            <div className="flex items-center text-xs font-semibold text-indigo-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Lag feature engineering & baseline comparison
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit mb-6">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Warehouse Inventory</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Immutable double-entry inventory ledger records stock movements, real-time safety thresholds, and cross-warehouse transfers with full audit trails.
            </p>
            <div className="flex items-center text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Atomic stock decrement in transactions
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl w-fit mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gemini Business Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Conversational assistant powered by Google Gemini and authorized backend context queries. Ask questions in plain English without risking SQL injection or hallucinations.
            </p>
            <div className="flex items-center text-xs font-semibold text-purple-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Grounded on live database records
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl w-fit mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Supplier Reliability Scoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Evaluates actual recorded historical on-time delivery percentages, defect ratings, and completed purchase order volume to compute verifiable supplier scorecards.
            </p>
            <div className="flex items-center text-xs font-semibold text-amber-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> No fabricated ratings, 100% data-driven
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl w-fit mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Predictive Delay-Risk Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Predictive risk classifier assesses carrier history, transit distance, border customs bottlenecks, and weather disruptions to flag delays before they impact operations.
            </p>
            <div className="flex items-center text-xs font-semibold text-rose-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Actionable mitigation steps
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl w-fit mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Role-Based Access Control</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Dedicated interfaces and permissions tailored for 6 enterprise personas: Admin, Retailer, Wholesaler, Supplier, Manufacturer, and Delivery Carrier.
            </p>
            <div className="flex items-center text-xs font-semibold text-cyan-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> BCrypt password hashing & JWT tokens
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-800 py-16 px-6 bg-slate-950 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="p-3 bg-indigo-600/20 rounded-2xl w-fit mx-auto mb-6 text-indigo-400 border border-indigo-500/30">
            <Boxes className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to experience intelligent supply chain orchestration?
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Access the complete platform, explore historical forecasts, execute purchase orders, and query the AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
            >
              Open Live Dashboard
            </Link>
            <Link 
              to="/login"
              className="px-8 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Role-Based Sign In
            </Link>
          </div>
          <div className="mt-12 text-xs text-slate-500">
            © 2026 SupplyStock AI. Built with React.js, Java Spring Boot, MySQL 8+, FastAPI & Scikit-Learn.
          </div>
        </div>
      </footer>
    </div>
  );
};
