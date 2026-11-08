import React from 'react';

export default function MetricCard({ title, value, icon: Icon, delta, deltaType = 'normal', color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-[#1E2D42] hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'hover:shadow-emerald-950/50',
    },
    amber: {
      border: 'border-[#1E2D42] hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'hover:shadow-amber-950/50',
    },
    rose: {
      border: 'border-[#1E2D42] hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'hover:shadow-rose-950/50',
    },
    sky: {
      border: 'border-[#1E2D42] hover:border-teal-500/50',
      iconBg: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
      glow: 'hover:shadow-teal-950/50',
    },
    purple: {
      border: 'border-[#1E2D42] hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      glow: 'hover:shadow-purple-950/50',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative rounded-2xl border bg-[#111C2E] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${scheme.border} ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-[#F8FAFC]">{value}</span>
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={
              deltaType === 'warning'
                ? 'font-medium text-amber-400'
                : deltaType === 'success'
                ? 'font-medium text-emerald-400'
                : 'text-[#94A3B8]'
            }
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}
