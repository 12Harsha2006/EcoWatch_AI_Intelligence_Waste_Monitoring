import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  const styles = {
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    VERIFIED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
    RESOLVED: 'bg-sky-50 text-sky-800 border-sky-200',
    ACTIVE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
    ERROR: 'bg-red-50 text-red-800 border-red-200',
  };

  const currentStyle = styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === 'ACTIVE' || normalized === 'VERIFIED'
            ? 'bg-emerald-600'
            : normalized === 'PENDING'
            ? 'bg-amber-600'
            : normalized === 'REJECTED' || normalized === 'ERROR'
            ? 'bg-rose-600'
            : 'bg-slate-400'
        }`}
      />
      {normalized}
    </span>
  );
}
