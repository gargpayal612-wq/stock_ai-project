import React from 'react';

export const StatusBadge = ({ status, type = 'stock' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const configs = {
    // Stock Status
    HEALTHY: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Healthy Stock' },
    LOW_STOCK: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Low Stock' },
    OUT_OF_STOCK: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Out of Stock' },
    OVERSTOCKED: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Overstocked' },

    // PO Status
    DRAFT: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Draft' },
    PENDING_APPROVAL: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Pending Approval' },
    APPROVED: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Approved' },
    SENT: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', label: 'Sent to Supplier' },
    PARTIALLY_RECEIVED: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Partially Received' },
    RECEIVED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Fulfilled / Received' },
    CANCELLED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Cancelled' },

    // Shipment Status
    PROCESSING: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Processing' },
    DISPATCHED: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Dispatched' },
    IN_TRANSIT: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', label: 'In Transit' },
    OUT_FOR_DELIVERY: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', label: 'Out for Delivery' },
    DELIVERED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Delivered' },
    DELAYED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse', label: 'Delayed' },

    // Delay Risk Level
    LOW: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Low Risk' },
    MEDIUM: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Medium Risk' },
    HIGH: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'High Delay Risk' },

    // Alert Severity
    INFO: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Info' },
    WARNING: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Warning' },
    CRITICAL: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Critical' }
  };

  const config = configs[normalized] || { bg: 'bg-slate-700/50 text-slate-300 border-slate-600', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </span>
  );
};
