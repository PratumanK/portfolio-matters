import { apiClient } from './client';
import type { PaginatedStocks, Stock } from '../types';

export const stocksApi = {
  getStocks: async (page = 1, limit = 10): Promise<PaginatedStocks> => {
    const response = await apiClient.get<PaginatedStocks>('/api/stocks', {
      params: { page, limit },
    });
    return response.data;
  },

  searchStocks: async (query: string): Promise<Stock[]> => {
    const response = await apiClient.get<Stock[]>('/api/stocks/search', {
      params: { query },
    });
    return response.data;
  },
};
