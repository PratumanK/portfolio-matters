import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  Sliders,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';
import { portfolioApi } from '../api/portfolio.api';
import type {
  SectorAllocation,
  PortfolioReturn,
  SimulationResult,
  PortfolioSummary,
} from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { SectorPieChart } from '../components/charts/SectorPieChart';
import { SimulationComparisonChart } from '../components/charts/SimulationComparisonChart';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { getApiErrorMessage } from '../api/client';

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [sectors, setSectors] = useState<SectorAllocation[]>([]);

  // Return period selector
  const [periodDays, setPeriodDays] = useState<number>(7);
  const [portfolioReturn, setPortfolioReturn] = useState<PortfolioReturn | null>(null);
  const [isLoadingReturn, setIsLoadingReturn] = useState<boolean>(false);

  // Simulation controls (-50% to +50%)
  const [marketShift, setMarketShift] = useState<number>(10);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, secRes] = await Promise.allSettled([
        portfolioApi.getSummary(),
        portfolioApi.getSectorAllocation(),
      ]);

      if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
      if (secRes.status === 'fulfilled') setSectors(secRes.value);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReturnForPeriod = useCallback(async (days: number) => {
    setIsLoadingReturn(true);
    try {
      const result = await portfolioApi.getReturn(days);
      setPortfolioReturn(result);
    } catch {
      setPortfolioReturn({ change: 0, changePercent: 0 });
    } finally {
      setIsLoadingReturn(false);
    }
  }, []);

  const runSimulation = useCallback(async (percent: number) => {
    setIsSimulating(true);
    try {
      const result = await portfolioApi.getSimulation(percent);
      setSimulation(result);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  useEffect(() => {
    loadInitialAnalytics();
  }, [loadInitialAnalytics]);

  useEffect(() => {
    fetchReturnForPeriod(periodDays);
  }, [fetchReturnForPeriod, periodDays]);

  useEffect(() => {
    runSimulation(marketShift);
  }, [runSimulation, marketShift]);

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Computing statistical risk and return models..." />;
  }

  const hasHoldings = (summary?.totalInvested ?? 0) > 0 || (summary?.currentValue ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio Analytics & Risk</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sector concentration, historical return analysis, and stress-test simulation
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            loadInitialAnalytics();
            fetchReturnForPeriod(periodDays);
            runSimulation(marketShift);
          }}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Recalculate
        </Button>
      </div>

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {!hasHoldings ? (
        <EmptyState
          icon={<Layers className="w-8 h-8 text-cyan-400" />}
          title="Insufficient Portfolio Data"
          description="Analytics models require at least one active holding. Add stock positions in My Portfolio to compute sector distribution and risk metrics."
          actionLabel="Go to Portfolio"
          onAction={() => window.location.assign('/portfolio')}
        />
      ) : (
        <>
          {/* Section 1: Portfolio Simulation & Risk Model */}
          <section className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className={`w-5 h-5 text-emerald-400 ${isSimulating ? 'animate-pulse' : ''}`} />
                  <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                    Hypothetical Portfolio Stress Test
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Model simulated market-wide price swings and observe projected valuation changes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="warning" size="md">
                  Hypothetical Model
                </Badge>
              </div>
            </div>

            {/* Simulation Controls Slider */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Simulate Market Shift:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[-20, -10, -5, 5, 10, 20].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMarketShift(preset)}
                        className={`text-[11px] font-mono px-2 py-1 rounded border transition-all cursor-pointer ${
                          marketShift === preset
                            ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset > 0 ? `+${preset}%` : `${preset}%`}
                      </button>
                    ))}
                  </div>

                  <span className={`text-base font-bold font-mono px-3 py-1 rounded-lg border ${
                    marketShift > 0
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : marketShift < 0
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {marketShift > 0 ? `+${marketShift}%` : `${marketShift}%`}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={marketShift}
                onChange={(e) => setMarketShift(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>-50% (Extreme Bear Drawdown)</span>
                <span>0% (Status Quo)</span>
                <span>+50% (Strong Bull Rally)</span>
              </div>
            </div>

            {/* Simulation Metrics Grid */}
            {simulation && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Current Value
                    </span>
                    <p className="text-xl font-bold font-mono text-slate-200 mt-1">
                      {formatINR(simulation.totalValue)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Realized base</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Simulated Valuation
                    </span>
                    <p className={`text-xl font-bold font-mono mt-1 ${
                      simulation.marketChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {formatINR(simulation.projectedValue)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Shift: {formatINR(simulation.projectedValue - simulation.totalValue)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Concentration Risk (HHI)
                    </span>
                    <p className="text-xl font-bold font-mono text-slate-200 mt-1">
                      {simulation.riskScore}
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          simulation.riskLevel.includes('Low')
                            ? 'success'
                            : simulation.riskLevel.includes('Moderate')
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {simulation.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Diversification Score
                    </span>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {simulation.diversificationScore.toFixed(1)} / 100
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Herfindahl Scale</p>
                  </div>
                </div>

                {/* Simulation Chart */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-4">
                    Visual Valuation Comparison
                  </h4>
                  <SimulationComparisonChart
                    currentValue={simulation.totalValue}
                    projectedValue={simulation.projectedValue}
                    marketChangePercent={simulation.marketChangePercent}
                    height={220}
                  />
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-slate-300">Hypothetical Methodology:</span>{' '}
                Simulation models apply a uniform market-wide coefficient to all current holdings and compute the Herfindahl-Hirschman Index (HHI) across sector weights. It is strictly an exploratory tool and does not constitute financial advice or price prediction.
              </p>
            </div>
          </section>

          {/* Section 2: Historical Return Analysis */}
          <section className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                    Historical Snapshot Returns
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Return differential computed against historical daily portfolio snapshots
                </p>
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { label: '7 Days', days: 7 },
                  { label: '14 Days', days: 14 },
                  { label: '30 Days', days: 30 },
                  { label: '90 Days', days: 90 },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setPeriodDays(item.days)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      periodDays === item.days
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingReturn ? (
              <LoadingSpinner label="Querying historical snapshot records..." />
            ) : portfolioReturn && (portfolioReturn.change !== 0 || portfolioReturn.changePercent !== 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title={`Absolute Return (${periodDays}D)`}
                  value={formatINR(portfolioReturn.change)}
                  subValue={`Compared against snapshot ${periodDays} days ago`}
                  changePercent={portfolioReturn.changePercent}
                  icon={
                    portfolioReturn.change >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-rose-400" />
                    )
                  }
                />

                <StatCard
                  title={`Percentage Change (${periodDays}D)`}
                  value={formatPercent(portfolioReturn.changePercent)}
                  subValue="Calculated from past historical snapshot"
                  changePercent={portfolioReturn.changePercent}
                  icon={<Activity className="w-5 h-5 text-cyan-400" />}
                />
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <div className="inline-flex p-2.5 bg-slate-800 rounded-full text-slate-400 mb-1">
                  <Info className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Insufficient Snapshot History for {periodDays} Days
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  The backend historical snapshot cron job (<code className="text-slate-300">55 10 * * 1-5</code>) archives daily portfolio valuations on weekday market closes. At least {periodDays + 1} daily snapshot records are required to compute the {periodDays}-day historical return.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 italic">
                    Current valuation is live and tracked via My Portfolio.
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Sector Distribution Details */}
          <section className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  Detailed Sector Allocation
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {sectors.length} {sectors.length === 1 ? 'Sector' : 'Sectors'} Identified
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <SectorPieChart data={sectors} height={280} />

              <div className="space-y-3">
                <div className="grid grid-cols-3 text-[11px] font-semibold uppercase text-slate-400 px-3 pb-1 border-b border-slate-800">
                  <span>Sector</span>
                  <span className="text-right">Allocation %</span>
                  <span className="text-right">Valuation</span>
                </div>
                {sectors.map((sec) => (
                  <div
                    key={sec.sector}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 items-center text-xs"
                  >
                    <span className="font-semibold text-slate-200 truncate">{sec.sector}</span>
                    <span className="text-right font-mono font-bold text-slate-100">
                      {sec.percentage}%
                    </span>
                    <span className="text-right font-mono text-emerald-400 font-semibold">
                      {formatINR(sec.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
