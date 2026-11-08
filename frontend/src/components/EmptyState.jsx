import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'No surveillance items or incidents match your criteria.',
  icon: Icon = Inbox,
  actionButton = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1E2D42] bg-[#111C2E]/60 p-12 text-center">
      <div className="rounded-2xl bg-[#0B1220] p-3.5 text-slate-400 shadow-sm border border-[#1E2D42]">
        <Icon className="h-8 w-8 text-emerald-400/80" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[#94A3B8] leading-relaxed">{description}</p>
      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
}
