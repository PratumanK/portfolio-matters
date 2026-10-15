import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  PlusCircle,
  MinusCircle,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react';
import { portfolioApi } from '../api/portfolio.api';
import { holdingsApi } from '../api/holdings.api';
import { stocksApi } from '../api/stocks.api';
import type { PortfolioSummary, Stock, TopMovers, PopulatedHolding } from '../types';
import { formatINR, formatPercent, getPnlBg } from '../utils/formatters';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { StockSearchSelect } from '../components/common/StockSearchSelect';
import { getApiErrorMessage } from '../api/client';

export const PortfolioPage: React.FC = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<PopulatedHolding[]>([]);
  const [topMovers, setTopMovers] = useState<TopMovers | null>(null);
  const [presetStocks, setPresetStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Add Holding
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  // Form states for Sell Holding
  const [selectedSellStock, setSelectedSellStock] = useState<Stock | null>(null);
  const [sellQuantity, setSellQuantity] = useState('');

  const loadPortfolioData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sumRes, holdingsRes, movRes, stocksRes] = await Promise.allSettled([
        portfolioApi.getSummary(),
        holdingsApi.getHoldings(),
        portfolioApi.getTopMovers(),
        stocksApi.getStocks(1, 40),
      ]);

      if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
      if (holdingsRes.status === 'fulfilled') setHoldings(holdingsRes.value || []);
      if (movRes.status === 'fulfilled') setTopMovers(movRes.value);
      if (stocksRes.status === 'fulfilled') setPresetStocks(stocksRes.value.data || []);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  // Open Add Modal
  const handleOpenAddModal = (stockToPreselect?: Stock) => {
    const stock = stockToPreselect || presetStocks[0] || null;
    setSelectedStock(stock);
    setQuantity('');
    setBuyPrice(stock ? String(stock.currentPrice) : '');
    setIsAddOpen(true);
    setFeedback(null);
  };

  // Open Sell Modal
  const handleOpenSellModal = (stockToPreselect?: Stock) => {
    // If not passed, default to first holding's stock or first preset stock
    const defaultStock = stockToPreselect || holdings[0]?.stockId || presetStocks[0] || null;
    setSelectedSellStock(defaultStock);
    setSellQuantity('');
    setIsSellOpen(true);
    setFeedback(null);
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setBuyPrice(String(stock.currentPrice));
  };

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    const price = parseFloat(buyPrice);

    if (!selectedStock?._id) {
      setFeedback({ type: 'error', message: 'Please select a valid stock.' });
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setFeedback({ type: 'error', message: 'Quantity must be a positive integer.' });
      return;
    }
    if (isNaN(price) || price <= 0) {
      setFeedback({ type: 'error', message: 'Buy price must be a positive number.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await holdingsApi.addHolding({
        stockId: selectedStock._id,
        quantity: qty,
        buyPrice: price,
      });

      setFeedback({
        type: 'success',
        message: `Successfully added ${qty} shares of ${selectedStock.symbol} at ${formatINR(price)}.`,
      });
      setIsAddOpen(false);
      await loadPortfolioData();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSellHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(sellQuantity, 10);

    if (!selectedSellStock?._id) {
      setFeedback({ type: 'error', message: 'Please select a stock to sell.' });
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setFeedback({ type: 'error', message: 'Sell quantity must be greater than zero.' });
      return;
    }

    // Check if user owns fewer shares
    const ownedHolding = holdings.find((h) => h.stockId?._id === selectedSellStock._id);
    if (ownedHolding && qty > ownedHolding.quantity) {
      setFeedback({
        type: 'error',
        message: `Cannot sell ${qty} shares. You currently own ${ownedHolding.quantity} shares of ${selectedSellStock.symbol}.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await holdingsApi.sellHolding({
        stockId: selectedSellStock._id,
        quantity: qty,
      });

      setFeedback({
        type: 'success',
        message: `Successfully sold ${qty} shares of ${selectedSellStock.symbol}. Position updated.`,
      });
      setIsSellOpen(false);
      await loadPortfolioData();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Fetching portfolio holdings..." />;
  }

  // Find currently selected sell stock holding if owned
  const currentSellHolding = holdings.find((h) => h.stockId?._id === selectedSellStock?._id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Portfolio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active equity positions, cost bases, real-time returns, and trade executions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPortfolioData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenSellModal()}
            leftIcon={<MinusCircle className="w-4 h-4 text-rose-400" />}
          >
            Sell Holdings
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal()}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Holdings
          </Button>
        </div>
      </div>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Portfolio Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Portfolio Value"
          value={formatINR(summary?.currentValue ?? 0)}
          subValue={`Base Capital: ${formatINR(summary?.totalInvested ?? 0)}`}
          changePercent={summary?.profitLossPercentage}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Total Capital Invested"
          value={formatINR(summary?.totalInvested ?? 0)}
          subValue="Cumulative Cost Basis"
          icon={<Briefcase className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Unrealized P&L"
          value={formatINR(summary?.profitLoss ?? 0)}
          subValue={summary?.profitLoss && summary.profitLoss >= 0 ? 'Net Unrealized Profit' : 'Net Drawdown'}
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
          title="Return on Investment"
          value={formatPercent(summary?.profitLossPercentage ?? 0)}
          subValue="Percentage Yield"
          changePercent={summary?.profitLossPercentage}
          icon={<Activity className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Top Gainers & Drawdowns Highlights */}
      {(topMovers?.topGainer || topMovers?.topLoser) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topMovers.topGainer && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Highest Performing Holding
                </span>
                <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                  {topMovers.topGainer.stock.symbol} — {topMovers.topGainer.stock.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Holding: {topMovers.topGainer.quantity} shares @ Avg {formatINR(topMovers.topGainer.avgBuyPrice)}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-emerald-400 block">
                  +{formatINR(topMovers.topGainer.profitLoss)}
                </span>
                <Badge variant="success" size="sm" className="mt-1">
                  CMP: {formatINR(topMovers.topGainer.stock.currentPrice)}
                </Badge>
              </div>
            </div>
          )}

          {topMovers.topLoser && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Largest Drawdown Holding
                </span>
                <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                  {topMovers.topLoser.stock.symbol} — {topMovers.topLoser.stock.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Holding: {topMovers.topLoser.quantity} shares @ Avg {formatINR(topMovers.topLoser.avgBuyPrice)}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-rose-400 block">
                  {formatINR(topMovers.topLoser.profitLoss)}
                </span>
                <Badge variant="danger" size="sm" className="mt-1">
                  CMP: {formatINR(topMovers.topLoser.stock.currentPrice)}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real Holdings Table */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-slate-100 uppercase tracking-wider">
              Current Stock Holdings ({holdings.length})
            </h3>
          </div>
          <span className="text-slate-400">
            Real-time positions & profit/loss tracking
          </span>
        </div>

        {holdings.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8 text-emerald-400" />}
            title="No Active Holdings"
            description="You have not added any stock positions yet. Click 'Add Holdings' above to record your first stock investment."
            actionLabel="Add First Holding"
            onAction={() => handleOpenAddModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Sector</th>
                  <th className="px-5 py-3.5 text-right">Qty</th>
                  <th className="px-5 py-3.5 text-right">Avg Price (₹)</th>
                  <th className="px-5 py-3.5 text-right">CMP (₹)</th>
                  <th className="px-5 py-3.5 text-right">Current Value (₹)</th>
                  <th className="px-5 py-3.5 text-right">Unrealized P&L</th>
                  <th className="px-5 py-3.5 text-right">Return %</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {holdings.map((holding) => {
                  const stock = holding.stockId;
                  if (!stock) return null;

                  const invested = holding.quantity * holding.avgBuyPrice;
                  const currentVal = holding.quantity * stock.currentPrice;
                  const pnl = currentVal - invested;
                  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
                  const isPositive = pnl >= 0;

                  return (
                    <tr
                      key={holding._id}
                      className="hover:bg-slate-850/50 transition-colors group"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-mono font-bold text-slate-100">{stock.symbol}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[170px]">{stock.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge variant="default" size="sm">
                          {stock.sector || 'General'}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-medium text-slate-200 whitespace-nowrap">
                        {holding.quantity}
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-slate-300 whitespace-nowrap">
                        {formatINR(holding.avgBuyPrice)}
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-semibold text-slate-100 whitespace-nowrap">
                        {formatINR(stock.currentPrice)}
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                        {formatINR(currentVal)}
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                          {isPositive ? `+${formatINR(pnl)}` : formatINR(pnl)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-mono whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getPnlBg(
                            pnlPct
                          )}`}
                        >
                          {formatPercent(pnlPct)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenAddModal(stock)}
                            title="Buy more shares of this stock"
                            className="px-2.5 py-1 text-xs rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 transition-colors cursor-pointer"
                          >
                            + Buy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenSellModal(stock)}
                            title="Sell shares of this stock"
                            className="px-2.5 py-1 text-xs rounded bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 transition-colors cursor-pointer"
                          >
                            - Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Holding Modal with Full Search across ALL 2,300+ Stocks */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Stock to Holdings"
        description="Search across all 2,300+ listed NSE stocks to record a purchase"
      >
        <form onSubmit={handleAddHolding} className="space-y-4">
          <StockSearchSelect
            label="Select Stock"
            required
            selectedStock={selectedStock}
            onSelect={handleStockSelect}
            presetStocks={presetStocks}
            placeholder="Type company name or ticker (e.g. Tata, INFY, Reliance, Zomato)..."
          />

          <Input
            label="Quantity"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            helperText="Number of shares purchased"
          />

          <Input
            label="Buy Price per Share (₹)"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 1540.50"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            required
            helperText="Weighted average cost basis will be automatically computed"
          />

          {quantity && buyPrice && !isNaN(parseFloat(quantity)) && !isNaN(parseFloat(buyPrice)) && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-400">Total Purchase Value:</span>
              <span className="text-emerald-400 font-bold">
                {formatINR(parseFloat(quantity) * parseFloat(buyPrice))}
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Confirm Purchase
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sell Holding Modal */}
      <Modal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        title="Sell / Reduce Holding"
        description="Record a liquidation from your stock positions"
      >
        <form onSubmit={handleSellHolding} className="space-y-4">
          <StockSearchSelect
            label="Select Stock to Sell"
            required
            selectedStock={selectedSellStock}
            onSelect={(stock) => setSelectedSellStock(stock)}
            presetStocks={
              holdings.length > 0
                ? holdings.map((h) => h.stockId).filter(Boolean)
                : presetStocks
            }
            placeholder="Type company name or ticker to sell..."
          />

          {currentSellHolding && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Currently Owned:</span>
              <span className="text-slate-200 font-mono font-bold">
                {currentSellHolding.quantity} shares @ Avg {formatINR(currentSellHolding.avgBuyPrice)}
              </span>
            </div>
          )}

          <Input
            label="Quantity to Sell"
            type="number"
            min="1"
            step="1"
            max={currentSellHolding ? currentSellHolding.quantity : undefined}
            placeholder="e.g. 5"
            value={sellQuantity}
            onChange={(e) => setSellQuantity(e.target.value)}
            required
            helperText={
              currentSellHolding
                ? `Max available to sell: ${currentSellHolding.quantity} shares`
                : 'Number of shares to liquidate'
            }
          />

          {sellQuantity && selectedSellStock && !isNaN(parseInt(sellQuantity, 10)) && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-400">Estimated Sale Proceeds:</span>
              <span className="text-emerald-400 font-bold">
                {formatINR(parseInt(sellQuantity, 10) * selectedSellStock.currentPrice)}
              </span>
            </div>
          )}

          <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs text-rose-300">
            Selling will reduce your position in this stock. If the remaining quantity reaches 0, the position is automatically closed.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSellOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
            >
              Confirm Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
