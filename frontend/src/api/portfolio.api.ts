import { apiClient } from './client';
import type {
  PortfolioSummary,
  SectorAllocation,
  TopMovers,
  PortfolioReturn,
  SimulationResult,
} from '../types';

export const portfolioApi = {
  getSummary: async (): Promise<PortfolioSummary> => {
    const response = await apiClient.get<PortfolioSummary>('/api/summary');
    return response.data;
  },

  getSectorAllocation: async (): Promise<SectorAllocation[]> => {
    const response = await apiClient.get<SectorAllocation[]>('/api/summary/sector');
    return response.data || [];
  },

  getTopMovers: async (): Promise<TopMovers> => {
    const response = await apiClient.get<TopMovers>('/api/summary/topMovers');
    return response.data;
  },

  getReturn: async (days: number): Promise<PortfolioReturn> => {
    // Supports query params natively; fallback data object for backward compatibility
    const response = await apiClient.get<PortfolioReturn>('/api/summary/return', {
      params: { days },
    });
    return response.data;
  },

  getSimulation: async (marketChangePercent: number): Promise<SimulationResult> => {
    const response = await apiClient.get<SimulationResult>('/api/summary/simulation', {
      params: { marketChangePercent },
    });
    return response.data;
  },
};
