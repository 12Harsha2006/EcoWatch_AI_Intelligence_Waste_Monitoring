import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  const styles = {
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    VERIFIED: 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    RESOLVED: 'bg-teal-50 text-teal-800 border-teal-200',
    ACTIVE: 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]',
    INACTIVE: 'bg-slate-100 text-slate-700 border-slate-200',
    ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const dotColors = {
    PENDING: 'bg-amber-500',
    VERIFIED: 'bg-[#4CAF50]',
    REJECTED: 'bg-rose-500',
    RESOLVED: 'bg-teal-500',
    ACTIVE: 'bg-[#4CAF50]',
    INACTIVE: 'bg-slate-400',
    ERROR: 'bg-rose-500',
  };

  const currentStyle = styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';
  const currentDot = dotColors[normalized] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${currentStyle}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${currentDot}`} />
      {normalized}
    </span>
  );
}
