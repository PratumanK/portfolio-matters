import { apiClient } from './client';
import type { AddHoldingPayload, SellHoldingPayload, PopulatedHolding } from '../types';

export const holdingsApi = {
  getHoldings: async (): Promise<PopulatedHolding[]> => {
    const response = await apiClient.get<{ success: boolean; data: PopulatedHolding[] }>('/api/holdings');
    return response.data.data || [];
  },

  addHolding: async (payload: AddHoldingPayload): Promise<any> => {
    const response = await apiClient.post('/api/holdings/add', payload);
    return response.data;
  },

  sellHolding: async (payload: SellHoldingPayload): Promise<any> => {
    const response = await apiClient.put('/api/holdings/sell', payload);
    return response.data;
  },
};
