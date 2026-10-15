import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Bell,
  Trash2,
  Compass,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { wishlistApi } from '../api/wishlist.api';
import type { WishlistItem } from '../types';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { getApiErrorMessage } from '../api/client';

export const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit alert modal
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await wishlistApi.getWishlist();
      setWishlist(items);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (stockId: string, symbol: string) => {
    try {
      await wishlistApi.removeFromWishlist(stockId);
      setFeedback({ type: 'success', message: `Removed ${symbol} from your watchlist.` });
      await fetchWishlist();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    }
  };

  const handleOpenAlertModal = (item: WishlistItem) => {
    setSelectedItem(item);
    setAlertPrice(item.alertPrice ? String(item.alertPrice) : String(item.stock?.currentPrice || ''));
    setAlertType(item.alertType || 'above');
    setFeedback(null);
  };

  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem?.stock?._id) return;

    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
      setFeedback({ type: 'error', message: 'Target alert price must be greater than zero.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await wishlistApi.setAlert({
        stockId: selectedItem.stock._id,
        alertPrice: price,
        alertType,
      });

      setFeedback({
        type: 'success',
        message: `Alert configured for ${selectedItem.stock.symbol}: trigger when price moves ${alertType} ${formatINR(price)}.`,
      });
      setSelectedItem(null);
      await fetchWishlist();
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Wishlist & Price Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor watchlisted securities and receive automated notifications when target price thresholds are met
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchWishlist}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Link to="/stocks">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Compass className="w-4 h-4" />}
            >
              Explore Stocks
            </Button>
          </Link>
        </div>
      </div>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Info notice about cron background checks */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Automated Price Watchdog runs nightly via cron (<code className="text-slate-300">37 23 * * *</code>) and dispatches alert emails via Nodemailer when target price criteria trigger.
          </span>
        </div>
        <span className="text-slate-500 hidden md:inline">
          {wishlist.length} {wishlist.length === 1 ? 'stock' : 'stocks'} saved
        </span>
      </div>

      {isLoading ? (
        <LoadingSpinner fullHeight label="Retrieving your wishlist and price alerts..." />
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-amber-400" />}
          title="Your Wishlist is Empty"
          description="You haven't added any stocks to your wishlist yet. Discover active NSE stocks in the explorer and set custom price alerts."
          actionLabel="Explore Stocks Now"
          onAction={() => window.location.assign('/stocks')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => {
            const stock = item.stock;
            if (!stock) return null;

            return (
              <div
                key={item._id || stock._id}
                className="bg-[#0b101d] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-slate-100">
                          {stock.symbol}
                        </span>
                        <Badge variant="default" size="sm">
                          {stock.sector || 'Equity'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                        {stock.name}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(stock._id, stock.symbol)}
                      title="Remove from wishlist"
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Current Market Price */}
                  <div className="my-3 p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Current Price</span>
                    <span className="text-lg font-bold font-mono text-slate-100">
                      {formatINR(stock.currentPrice)}
                    </span>
                  </div>

                  {/* Alert Status Card */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Alert Status:</span>
                      {item.alertTriggered ? (
                        <Badge variant="success" size="sm">
                          Triggered
                        </Badge>
                      ) : item.alertActive ? (
                        <Badge variant="warning" size="sm">
                          Active Monitoring
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">
                          No Alert Set
                        </Badge>
                      )}
                    </div>

                    {item.alertActive && item.alertPrice ? (
                      <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
                        <span className="text-slate-400">Target Rule:</span>
                        <span className="font-mono font-medium text-amber-300">
                          {item.alertType === 'above' ? '≥ ' : '≤ '}
                          {formatINR(item.alertPrice)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenAlertModal(item)}
                    leftIcon={<Bell className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    {item.alertActive ? 'Update Price Alert' : 'Configure Price Alert'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Configure Alert Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={`Set Price Alert: ${selectedItem?.stock?.symbol || ''}`}
        description={`Configure an automated email alert for ${selectedItem?.stock?.name || ''}`}
      >
        {selectedItem?.stock && (
          <form onSubmit={handleSaveAlert} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Market Price:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {formatINR(selectedItem.stock.currentPrice)}
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
                  Price Goes Above (≥)
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
                  Price Drops Below (≤)
                </button>
              </div>
            </div>

            <Input
              label="Alert Threshold Price (₹)"
              type="number"
              step="0.05"
              min="0.05"
              placeholder="e.g. 1500.00"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              required
              helperText={`Triggers when stock trades ${alertType} this value`}
            />

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
              >
                Save Alert Settings
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
