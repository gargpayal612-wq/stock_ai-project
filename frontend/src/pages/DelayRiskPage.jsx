import React, { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sliders,
  Calculator
} from 'lucide-react';

export const DelayRiskPage = () => {
  // Interactive Simulator Parameters
  const [supplierReliability, setSupplierReliability] = useState(76.5);
  const [distanceMiles, setDistanceMiles] = useState(3800);
  const [weatherIndex, setWeatherIndex] = useState(0.45);
  const [customsRequired, setCustomsRequired] = useState(true);

  // Calibrated ML classification approximation
  const unreliability = Math.max(0, (100 - supplierReliability) / 100);
  const normDist = Math.min(1.0, distanceMiles / 5000);
  const weather = weatherIndex;
  const customs = customsRequired ? 0.35 : 0.05;

  const rawScore = (unreliability * 0.35) + (normDist * 0.20) + (weather * 0.25) + customs;
  const simulatedScore = Math.min(0.99, Math.max(0.05, Math.round(rawScore * 100) / 100));

  const riskCategory = simulatedScore >= 0.70 ? 'HIGH' : (simulatedScore >= 0.35 ? 'MEDIUM' : 'LOW');

  const activeDelayCases = [
    {
      id: 'TRK-OPT-4419',
      supplier: 'OptiNav Autonomous Sensors',
      carrier: 'Global TransAir Express',
      origin: 'Munich, Germany',
      destination: 'Central Midwest Hub',
      expectedDate: '2026-11-20',
      riskScore: 0.88,
      riskCategory: 'HIGH',
      rootCauses: ['Severe port customs clearance inspection hold', 'Supplier reliability score is 76.5%'],
      action: 'Urgent: Contact customs broker for emergency inspection clearance and request alternate ground courier expediting.'
    },
    {
      id: 'TRK-AUR-6320',
      supplier: 'Aura Audio Acoustics',
      carrier: 'BlueDart Freight Systems',
      origin: 'San Jose, CA',
      destination: 'Central Midwest Hub',
      expectedDate: '2026-11-24',
      riskScore: 0.42,
      riskCategory: 'MEDIUM',
      rootCauses: ['Adverse winter weather advisory near Denver freight junction'],
      action: 'Monitor transfer hub scans every 12 hours. Notify inventory manager of possible 24h ETA variance.'
    },
    {
      id: 'TRK-NIP-9402',
      supplier: 'Nippon Micro Silicon Tech',
      carrier: 'SwiftLogistics Express',
      origin: 'Tokyo, Japan',
      destination: 'Central Midwest Hub',
      expectedDate: '2026-11-27',
      riskScore: 0.15,
      riskCategory: 'LOW',
      rootCauses: ['Optimal airway corridor, trusted tier 1 supplier (96.5% reliability)'],
      action: 'Standard automated schedule; no manual intervention required.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Proactive Logistics Disruption Prevention</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Predictive Delay-Risk Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Scikit-Learn calibrated logistic classification predicting transit exceptions before stockout impact.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Logistic Regression Classifier</span>
        </span>
      </div>

      {/* Interactive Delay Risk Simulator */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Interactive Risk Model Simulator</span>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Simulate Real-Time Transit Risk Factors</h2>
        <p className="text-xs text-slate-400 mb-6">
          Adjust supplier reliability, route distance, weather index, and customs requirements to calculate estimated delay probability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Supplier Reliability:</span>
              <strong className="text-white font-mono">{supplierReliability}%</strong>
            </div>
            <input 
              type="range" 
              min={50} 
              max={100} 
              step={0.5}
              value={supplierReliability}
              onChange={(e) => setSupplierReliability(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Transit Distance:</span>
              <strong className="text-white font-mono">{distanceMiles} mi</strong>
            </div>
            <input 
              type="range" 
              min={100} 
              max={8000} 
              step={100}
              value={distanceMiles}
              onChange={(e) => setDistanceMiles(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Weather / Congestion:</span>
              <strong className="text-white font-mono">{weatherIndex.toFixed(2)}</strong>
            </div>
            <input 
              type="range" 
              min={0.0} 
              max={1.0} 
              step={0.05}
              value={weatherIndex}
              onChange={(e) => setWeatherIndex(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <span className="block text-xs text-slate-300 font-semibold mb-2">Customs Inspection:</span>
            <button
              type="button"
              onClick={() => setCustomsRequired(!customsRequired)}
              className={`w-full py-2 rounded-xl text-xs font-semibold border transition ${
                customsRequired 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {customsRequired ? 'Customs Hold / Cross-Border' : 'Domestic Transit'}
            </button>
          </div>
        </div>

        {/* Prediction Output Card */}
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Predicted Delay Risk Score</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">{(simulatedScore * 100).toFixed(0)}%</span>
              <StatusBadge status={riskCategory} />
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-lg text-center sm:text-right">
            {riskCategory === 'HIGH' && (
              <span className="text-rose-400 font-medium">High disruption potential. Flagged for carrier rerouting or customs expediter intervention.</span>
            )}
            {riskCategory === 'MEDIUM' && (
              <span className="text-amber-400 font-medium">Moderate delay variance anticipated. Review buffer stock in destination warehouse.</span>
            )}
            {riskCategory === 'LOW' && (
              <span className="text-emerald-400 font-medium">Optimal corridor telemetry. On-time delivery probability high.</span>
            )}
          </div>
        </div>
      </div>

      {/* Active High-Risk Logged Shipments */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">Active Monitored Shipments Risk Matrix</h2>

        <div className="grid grid-cols-1 gap-4">
          {activeDelayCases.map((c) => (
            <div 
              key={c.id} 
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-bold text-white font-mono">{c.id}</span>
                    <StatusBadge status={c.riskCategory} />
                    <span className="text-xs font-mono font-bold text-slate-300">{(c.riskScore * 100).toFixed(0)}% Disruption Risk</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Vendor: <strong className="text-slate-200">{c.supplier}</strong> • Carrier: <strong className="text-slate-200">{c.carrier}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Expected ETA</span>
                  <span className="text-xs font-bold text-white font-mono">{c.expectedDate}</span>
                </div>
              </div>

              {/* Root causes */}
              <div className="mb-4 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Identified Risk Drivers</span>
                {c.rootCauses.map((rc, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-rose-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>{rc}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-start space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Recommended Mitigation Action:</span>
                  <span className="text-slate-300">{c.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
