// Currency, percentage, and date formatting utilities

export const formatINR = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number | undefined | null, includeSign = true): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00%';
  }
  const formatted = Math.abs(value).toFixed(2) + '%';
  if (!includeSign) return formatted;
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return `0.00%`;
};

export const formatNumber = (value: number | undefined | null, decimals = 2): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
};

export const getPnlColor = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value) || value === 0) {
    return 'text-slate-400';
  }
  return value > 0 ? 'text-emerald-400' : 'text-rose-400';
};

export const getPnlBg = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value) || value === 0) {
    return 'bg-slate-800/40 border-slate-700/50 text-slate-300';
  }
  return value > 0
    ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
    : 'bg-rose-950/40 border-rose-500/20 text-rose-400';
};

export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};
