import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'No surveillance items or incidents match your criteria.',
  icon: Icon = Inbox,
  actionButton = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#C8E6C9] bg-[#F8F9F0] p-12 text-center">
      <div className="rounded-2xl bg-white p-3.5 text-[#1B5E20] shadow-xs border border-[#E8F5E9]">
        <Icon className="h-8 w-8 text-[#4CAF50]" />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#173B2A]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[#647067] leading-relaxed">{description}</p>
      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
}
