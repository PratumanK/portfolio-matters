import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { stocksApi } from '../api/stocks.api';
import { wishlistApi } from '../api/wishlist.api';
import type { Stock, WishlistItem } from '../types';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { getApiErrorMessage } from '../api/client';

export const StocksPage: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Price alert modal state
  const [alertStock, setAlertStock] = useState<Stock | null>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [isSettingAlert, setIsSettingAlert] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      const items = await wishlistApi.getWishlist();
      setWishlist(items);
    } catch {
      // Wishlist fetch error should not block stock explorer
    }
  }, []);

  const loadStocks = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const result = await stocksApi.getStocks(targetPage, limit);
      setStocks(result.data || []);
      setPage(result.page || targetPage);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.total || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setIsSearching(false);
      loadStocks(1);
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    try {
      const results = await stocksApi.searchStocks(query);
      setStocks(results);
      setTotalCount(results.length);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadStocks(1);
  };

  useEffect(() => {
    fetchWishlist();
    loadStocks(1);
  }, [fetchWishlist, loadStocks]);

  const isStockInWishlist = (stockId: string): boolean => {
    return wishlist.some((item) => (item.stock?._id || (item as any).stock) === stockId);
  };

  const handleToggleWishlist = async (stock: Stock) => {
    const inWishlist = isStockInWishlist(stock._id);
    try {
      if (inWishlist) {
        await wishlistApi.removeFromWishlist(stock._id);
        setFeedback({ type: 'success', message: `Removed ${stock.symbol} from wishlist.` });
      } else {
        await wishlistApi.addToWishlist(stock._id);
        setFeedback({ type: 'success', message: `Added ${stock.symbol} to your wishlist.` });
      }
      await fetchWishlist();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    }
  };

  const handleOpenAlertModal = (stock: Stock) => {
    setAlertStock(stock);
    setAlertPrice(String(stock.currentPrice || ''));
    setAlertType('above');
    setFeedback(null);
  };

  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertStock) return;

    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
      setFeedback({ type: 'error', message: 'Alert price must be a valid positive number.' });
      return;
    }

    setIsSettingAlert(true);
    try {
      // Ensure stock is in wishlist first if not already
      if (!isStockInWishlist(alertStock._id)) {
        await wishlistApi.addToWishlist(alertStock._id);
      }

      await wishlistApi.setAlert({
        stockId: alertStock._id,
        alertPrice: price,
        alertType,
      });

      setFeedback({
        type: 'success',
        message: `Alert configured: notify when ${alertStock.symbol} goes ${alertType} ${formatINR(price)}.`,
      });
      setAlertStock(null);
      await fetchWishlist();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsSettingAlert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Explore Stocks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search active NSE listings, monitor real-time prices, and track on your wishlist
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isSearching ? handleSearch() : loadStocks(page))}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh List
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

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2.5 max-w-2xl">
        <div className="relative flex-1">
          <Input
            placeholder="Search by company name (e.g. Tata, Infosys, Reliance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Search
        </Button>
        {isSearching && (
          <Button type="button" variant="ghost" size="md" onClick={clearSearch}>
            Reset
          </Button>
        )}
      </form>

      {/* Stocks Table Container */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isSearching
              ? `Found ${stocks.length} matching result(s)`
              : `Showing page ${page} of ${totalPages} (${totalCount} total listings)`}
          </span>
          {isSearching && (
            <Badge variant="info" size="sm">
              Search Filter Active
            </Badge>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner label="Fetching stock quotes from NSE directory..." />
        ) : stocks.length === 0 ? (
          <EmptyState
            icon={<Search className="w-8 h-8 text-slate-500" />}
            title="No Stocks Found"
            description={
              isSearching
                ? `No stock records matched "${searchQuery}". Try a different company name or reset search.`
                : 'No stocks currently ingested in the database.'
            }
            actionLabel={isSearching ? 'Clear Search Filter' : undefined}
            onAction={isSearching ? clearSearch : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Symbol</th>
                  <th className="px-6 py-3.5">Company Name</th>
                  <th className="px-6 py-3.5">Sector</th>
                  <th className="px-6 py-3.5 text-right">Current Market Price (₹)</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stocks.map((stock) => {
                  const inWishlist = isStockInWishlist(stock._id);
                  return (
                    <tr
                      key={stock._id}
                      className="hover:bg-slate-850/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{stock.symbol}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300 font-medium whitespace-nowrap">
                        {stock.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default" size="sm">
                          {stock.sector || 'General'}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                        {formatINR(stock.currentPrice)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleWishlist(stock)}
                            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              inWishlist
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 hover:bg-amber-900/50'
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {inWishlist ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenAlertModal(stock)}
                            title="Set Price Alert"
                            className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            <Bell className="w-4 h-4" />
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

        {/* Pagination footer */}
        {!isSearching && totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => loadStocks(page - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => loadStocks(page + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Set Price Alert Modal */}
      <Modal
        isOpen={!!alertStock}
        onClose={() => setAlertStock(null)}
        title={`Set Price Alert: ${alertStock?.symbol || ''}`}
        description={`Receive notification when ${alertStock?.name || ''} crosses your price target.`}
      >
        {alertStock && (
          <form onSubmit={handleSaveAlert} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Market Price:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {formatINR(alertStock.currentPrice)}
              </span>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Alert Trigger Condition <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAlertType('above')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    alertType === 'above'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Crosses Above (≥)
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType('below')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    alertType === 'below'
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Drops Below (≤)
                </button>
              </div>
            </div>

            <Input
              label="Target Alert Price (₹)"
              type="number"
              step="0.05"
              min="0.05"
              placeholder="e.g. 1650.00"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              required
              helperText={`Alert fires when stock price moves ${alertType} this target`}
            />

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAlertStock(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSettingAlert}
              >
                Set Active Alert
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
