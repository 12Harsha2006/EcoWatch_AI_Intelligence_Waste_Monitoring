import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'No surveillance items or incidents match your criteria.',
  icon: Icon = Inbox,
  actionButton = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm">
      <div className="rounded-full bg-slate-800/80 p-3 text-slate-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
}

