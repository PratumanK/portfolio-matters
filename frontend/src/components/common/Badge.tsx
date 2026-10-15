import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
    danger: 'bg-rose-950/60 text-rose-400 border border-rose-500/30',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-500/30',
    info: 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30',
    purple: 'bg-purple-950/60 text-purple-300 border border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
