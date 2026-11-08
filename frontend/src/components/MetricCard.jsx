import React from 'react';

export default function MetricCard({ title, value, icon: Icon, delta, deltaType = 'normal', color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-slate-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      glow: 'hover:shadow-emerald-100',
    },
    amber: {
      border: 'border-slate-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      glow: 'hover:shadow-amber-100',
    },
    rose: {
      border: 'border-slate-200/80 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      glow: 'hover:shadow-rose-100',
    },
    sky: {
      border: 'border-slate-200/80 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600',
      glow: 'hover:shadow-sky-100',
    },
    purple: {
      border: 'border-slate-200/80 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600',
      glow: 'hover:shadow-purple-100',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${scheme.border} ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={
              deltaType === 'warning'
                ? 'font-medium text-amber-600'
                : deltaType === 'success'
                ? 'font-medium text-emerald-600'
                : 'text-slate-500'
            }
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}
