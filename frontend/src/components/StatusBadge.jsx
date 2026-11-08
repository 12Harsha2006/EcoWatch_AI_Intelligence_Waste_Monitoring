import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    VERIFIED: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    RESOLVED: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    ACTIVE: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    INACTIVE: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    ERROR: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  const currentStyle = styles[normalized] || 'bg-slate-500/10 text-slate-300 border-slate-500/30';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === 'ACTIVE' || normalized === 'VERIFIED'
            ? 'bg-emerald-400'
            : normalized === 'PENDING'
            ? 'bg-amber-400'
            : normalized === 'REJECTED' || normalized === 'ERROR'
            ? 'bg-rose-400'
            : 'bg-teal-400'
        }`}
      />
      {normalized}
    </span>
  );
}
