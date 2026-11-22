import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Filter,
  Check,
  Archive
} from 'lucide-react';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUnresolved, setFilterUnresolved] = useState(false);
  const [notification, setNotification] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts(filterUnresolved);
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [filterUnresolved]);

  const handleMarkRead = async (id) => {
    try {
      await api.markAlertRead(id);
      loadAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveAlert(id);
      setNotification('Alert resolved and archived.');
      setTimeout(() => setNotification(''), 3000);
      loadAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Alerts & Notifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time operational alerts for stockouts, transit exceptions, and pending approvals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFilterUnresolved(!filterUnresolved)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filterUnresolved 
                ? 'bg-indigo-600 text-white border-indigo-500' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {filterUnresolved ? 'Showing Unresolved Only' : 'Show All Alerts'}
          </button>
          <button
            onClick={loadAlerts}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((a) => (
          <div 
            key={a.id} 
            className={`p-5 rounded-3xl border transition shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              a.isResolved 
                ? 'bg-slate-900/40 border-slate-800/60 opacity-60' 
                : (!a.isRead ? 'bg-slate-900 border-indigo-500/40 shadow-indigo-500/5' : 'bg-slate-900 border-slate-800')
            }`}
          >
            <div className="flex items-start space-x-3.5 flex-1">
              <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${
                a.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                (a.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20')
              }`}>
                {a.severity === 'CRITICAL' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center space-x-2.5 mb-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">{a.title}</h3>
                  <StatusBadge status={a.severity} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                    {a.alertType}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{a.message}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-2">
                  <span>Logged: {new Date(a.createdAt).toLocaleString()}</span>
                  {a.referenceId && <span>Ref: <strong className="font-mono text-slate-400">{a.referenceId}</strong></span>}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
              {!a.isRead && (
                <button
                  onClick={() => handleMarkRead(a.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  Mark Read
                </button>
              )}
              {!a.isResolved && (
                <button
                  onClick={() => handleResolve(a.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              )}
              {a.isResolved && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolved</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
