import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Activity,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { portfolioApi } from '../api/portfolio.api';
import { wishlistApi } from '../api/wishlist.api';
import type {
  PortfolioSummary,
  SectorAllocation,
  TopMovers,
  WishlistItem,
} from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { StatCard } from '../components/common/StatCard';
import { SectorPieChart } from '../components/charts/SectorPieChart';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AlertBanner } from '../components/common/AlertBanner';
import { getApiErrorMessage } from '../api/client';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [sectors, setSectors] = useState<SectorAllocation[]>([]);
  const [topMovers, setTopMovers] = useState<TopMovers | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const [summaryRes, sectorRes, moversRes, wishlistRes] = await Promise.allSettled([
        portfolioApi.getSummary(),
        portfolioApi.getSectorAllocation(),
        portfolioApi.getTopMovers(),
        wishlistApi.getWishlist(),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      }
      if (sectorRes.status === 'fulfilled') {
        setSectors(sectorRes.value);
      }
      if (moversRes.status === 'fulfilled') {
        setTopMovers(moversRes.value);
      }
      if (wishlistRes.status === 'fulfilled') {
        setWishlist(wishlistRes.value);
      }

      // Check if all major requests failed
      if (
        summaryRes.status === 'rejected' &&
        sectorRes.status === 'rejected' &&
        moversRes.status === 'rejected'
      ) {
        setError('Failed to synchronize dashboard metrics with backend.');
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Aggregating live portfolio metrics..." />;
  }

  const hasHoldings = (summary?.totalInvested ?? 0) > 0 || (summary?.currentValue ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Investment Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time equity overview and automated valuation metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh Data
          </Button>
          <Link to="/portfolio">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Manage Holdings
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <AlertBanner
          type="error"
          title="Data Synchronization Notice"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Portfolio Valuation"
          value={formatINR(summary?.currentValue ?? 0)}
          subValue={`Invested: ${formatINR(summary?.totalInvested ?? 0)}`}
          changePercent={summary?.profitLossPercentage}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Total Capital Invested"
          value={formatINR(summary?.totalInvested ?? 0)}
          subValue="Weighted Acquisition Base"
          icon={<Activity className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Net Unrealized P&L"
          value={formatINR(summary?.profitLoss ?? 0)}
          subValue={summary?.profitLoss !== undefined && summary.profitLoss >= 0 ? 'Net Unrealized Gain' : 'Net Unrealized Drawdown'}
          changePercent={summary?.profitLossPercentage}
          icon={
            (summary?.profitLoss ?? 0) >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-400" />
            )
          }
        />

        <StatCard
          title="Overall Return %"
          value={formatPercent(summary?.profitLossPercentage ?? 0)}
          subValue="Total ROI Percentage"
          changePercent={summary?.profitLossPercentage}
          icon={<PieIcon className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {!hasHoldings ? (
        <EmptyState
          icon={<PlusCircle className="w-8 h-8 text-emerald-400" />}
          title="No Stock Holdings Recorded"
          description="Your portfolio currently has no active holdings. Add your first stock holding to unlock real-time valuation, sector allocation, and return analytics."
          actionLabel="Add First Holding"
          onAction={() => window.location.assign('/portfolio')}
          className="my-8"
        />
      ) : (
        /* Analytics Grid: Sector Breakdown + Top Movers & Watchlist */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector Allocation Breakdown */}
          <div className="lg:col-span-2 bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                  Sector Diversification
                </h3>
              </div>
              <Link
                to="/analytics"
                className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
              >
                <span>Detailed Risk Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <SectorPieChart data={sectors} height={260} />

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Sector Weightings
                </h4>
                {sectors.map((s) => (
                  <div key={s.sector} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-medium text-slate-200">{s.sector}</span>
                      <span className="font-mono text-slate-300 font-semibold">{s.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(s.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      {formatINR(s.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Movers Column */}
          <div className="space-y-6">
            {/* Top Gainer & Loser */}
            <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                    Portfolio Movers
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Top Gainer */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-900/30">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Top Gainer
                    </span>
                    <Badge variant="success" size="sm">
                      {topMovers?.topGainer?.stock?.sector || 'Equity'}
                    </Badge>
                  </div>
                  {topMovers?.topGainer ? (
                    <div>
                      <p className="text-sm font-bold text-slate-100 font-mono">
                        {topMovers.topGainer.stock.symbol}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {topMovers.topGainer.stock.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between text-xs">
                        <span className="text-slate-400">Qty: {topMovers.topGainer.quantity}</span>
                        <span className="font-mono font-semibold text-emerald-400">
                          +{formatINR(topMovers.topGainer.profitLoss)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mt-1">No positive gainer recorded</p>
                  )}
                </div>

                {/* Top Loser */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-900/30">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Top Loser
                    </span>
                    <Badge variant="danger" size="sm">
                      {topMovers?.topLoser?.stock?.sector || 'Equity'}
                    </Badge>
                  </div>
                  {topMovers?.topLoser ? (
                    <div>
                      <p className="text-sm font-bold text-slate-100 font-mono">
                        {topMovers.topLoser.stock.symbol}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {topMovers.topLoser.stock.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between text-xs">
                        <span className="text-slate-400">Qty: {topMovers.topLoser.quantity}</span>
                        <span className="font-mono font-semibold text-rose-400">
                          {formatINR(topMovers.topLoser.profitLoss)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mt-1">No negative loser recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Watchlist Overview */}
            <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                    Quick Watchlist
                  </h3>
                </div>
                <Link
                  to="/wishlist"
                  className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>All ({wishlist.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  No stocks in wishlist. Explore stocks to save items.
                </p>
              ) : (
                <div className="space-y-2">
                  {wishlist.slice(0, 3).map((item) => (
                    <div
                      key={item._id || item.stock?._id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-200 font-mono">
                          {item.stock?.symbol || 'N/A'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {item.stock?.name || 'Stock'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-slate-200 font-semibold">
                          {formatINR(item.stock?.currentPrice)}
                        </p>
                        {item.alertActive ? (
                          <Badge variant="warning" size="sm">
                            Alert: {item.alertType} {formatINR(item.alertPrice)}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-slate-500">No alert</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
