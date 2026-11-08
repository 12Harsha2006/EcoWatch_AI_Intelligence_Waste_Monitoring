import React from 'react';

export default function MetricCard({ title, value, icon: Icon, delta, deltaType = 'normal', color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-[#E8F5E9] hover:border-[#4CAF50]/60',
      iconBg: 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]',
      glow: 'hover:shadow-[#4CAF50]/10',
    },
    amber: {
      border: 'border-[#FEF3C7] hover:border-amber-400/60',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      glow: 'hover:shadow-amber-500/10',
    },
    rose: {
      border: 'border-[#FFE4E6] hover:border-rose-400/60',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200',
      glow: 'hover:shadow-rose-500/10',
    },
    sky: {
      border: 'border-[#E0F2FE] hover:border-sky-400/60',
      iconBg: 'bg-sky-50 text-sky-700 border border-sky-200',
      glow: 'hover:shadow-sky-500/10',
    },
    purple: {
      border: 'border-[#F3E8FF] hover:border-purple-400/60',
      iconBg: 'bg-purple-50 text-purple-700 border border-purple-200',
      glow: 'hover:shadow-purple-500/10',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${scheme.border} ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#647067]">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-[#173B2A]">{value}</span>
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={
              deltaType === 'warning'
                ? 'font-bold text-amber-700'
                : deltaType === 'success'
                ? 'font-bold text-[#1B5E20]'
                : 'text-[#647067]'
            }
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}
