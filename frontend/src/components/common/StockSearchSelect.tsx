import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Loader2, X } from 'lucide-react';
import { stocksApi } from '../../api/stocks.api';
import type { Stock } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Badge } from './Badge';

interface StockSearchSelectProps {
  label?: string;
  selectedStock: Stock | null;
  onSelect: (stock: Stock) => void;
  required?: boolean;
  presetStocks?: Stock[];
  placeholder?: string;
}

export const StockSearchSelect: React.FC<StockSearchSelectProps> = ({
  label = 'Select Stock',
  selectedStock,
  onSelect,
  required = false,
  presetStocks = [],
  placeholder = 'Search by company name or symbol (e.g. Tata, INFY, Reliance, Zomato)...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Search effect with 200ms debounce
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults(presetStocks.slice(0, 30));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await stocksApi.searchStocks(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search stocks:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, presetStocks]);

  // When opening, reset search query and show presets
  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery('');
    setSearchResults(presetStocks.slice(0, 30));
  };

  const handleSelect = (stock: Stock) => {
    onSelect(stock);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full space-y-1.5 text-left relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 flex items-center justify-between transition-colors cursor-pointer"
      >
        {selectedStock ? (
          <div className="flex items-center justify-between w-full mr-2 min-w-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono font-bold text-slate-100">{selectedStock.symbol}</span>
              <span className="text-slate-400 text-xs truncate">— {selectedStock.name}</span>
            </div>
            <span className="font-mono font-semibold text-emerald-400 text-xs shrink-0 ml-2">
              {formatINR(selectedStock.currentPrice)}
            </span>
          </div>
        ) : (
          <span className="text-slate-500">Choose a stock...</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f172a] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-80">
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {isSearching && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="overflow-y-auto divide-y divide-slate-850 p-1 flex-1">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                {isSearching ? 'Searching across 2,300+ stocks...' : `No stocks matching "${searchQuery}"`}
              </div>
            ) : (
              searchResults.map((stock) => {
                const isSelected = selectedStock?._id === stock._id;
                return (
                  <button
                    key={stock._id}
                    type="button"
                    onClick={() => handleSelect(stock)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/50 text-white border border-emerald-500/30'
                        : 'hover:bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-100">
                          {stock.symbol}
                        </span>
                        <Badge variant="default" size="sm">
                          {stock.sector || 'General'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {stock.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-emerald-400">
                        {formatINR(stock.currentPrice)}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Instant search across all 2,300+ NSE active listed companies
          </div>
        </div>
      )}
    </div>
  );
};
