import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface AlertBannerProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'error',
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const styles = {
    error: {
      bg: 'bg-rose-950/40 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200',
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`flex items-start justify-between p-4 rounded-xl border ${currentStyle.bg} ${className}`}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        {currentStyle.icon}
        <div>
          {title && <h5 className="text-sm font-semibold mb-0.5">{title}</h5>}
          <p className="text-xs leading-relaxed opacity-90">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
