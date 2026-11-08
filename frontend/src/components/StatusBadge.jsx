import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    VERIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    RESOLVED: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    INACTIVE: 'bg-slate-700/30 text-slate-400 border-slate-700',
    ERROR: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const currentStyle = styles[normalized] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === 'ACTIVE' || normalized === 'VERIFIED'
            ? 'bg-emerald-400 animate-pulse'
            : normalized === 'PENDING'
            ? 'bg-amber-400'
            : normalized === 'REJECTED' || normalized === 'ERROR'
            ? 'bg-rose-400'
            : 'bg-slate-400'
        }`}
      />
      {normalized}
    </span>
  );
}

