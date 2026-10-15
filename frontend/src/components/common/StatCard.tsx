import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getPnlBg } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  changePercent?: number;
  icon?: React.ReactNode;
  trendLabel?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  changePercent,
  icon,
  trendLabel,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-800 rounded w-24"></div>
          <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-8 bg-slate-800 rounded w-36 mb-2"></div>
        <div className="h-4 bg-slate-800 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-5 transition-all duration-200 shadow-sm relative overflow-hidden group">
      {/* Subtle top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent group-hover:via-emerald-500/40 transition-colors" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="p-2 bg-slate-800/80 border border-slate-700/50 rounded-lg text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
          {value}
        </h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {changePercent !== undefined && !isNaN(changePercent) ? (
          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border text-xs font-medium font-mono ${getPnlBg(changePercent)}`}>
            {changePercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : changePercent < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>
              {changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`}
            </span>
          </div>
        ) : null}

        {subValue && (
          <span className={`text-slate-400 font-medium ${changePercent === undefined ? 'text-xs' : 'text-[11px]'}`}>
            {subValue}
          </span>
        )}

        {trendLabel && (
          <span className="text-[11px] text-slate-500">
            {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
};
