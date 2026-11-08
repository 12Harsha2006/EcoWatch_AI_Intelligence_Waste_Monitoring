import React from 'react';

export default function MetricCard({ title, value, icon: Icon, delta, deltaType = 'normal', color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'group-hover:shadow-emerald-950/30',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'group-hover:shadow-amber-950/30',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'group-hover:shadow-rose-950/30',
    },
    sky: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400',
      glow: 'group-hover:shadow-sky-950/30',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400',
      glow: 'group-hover:shadow-purple-950/30',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative rounded-xl border bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${scheme.border} ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span
            className={
              deltaType === 'warning'
                ? 'font-medium text-amber-400'
                : deltaType === 'success'
                ? 'font-medium text-emerald-400'
                : 'text-slate-400'
            }
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}

