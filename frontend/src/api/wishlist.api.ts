import { apiClient } from './client';
import type { WishlistItem, SetAlertPayload } from '../types';

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<{ success: boolean; data: WishlistItem[] }>('/api/wishlist');
    return response.data.data || [];
  },

  addToWishlist: async (stockId: string): Promise<any> => {
    const response = await apiClient.post(`/api/wishlist/${stockId}`);
    return response.data;
  },

  removeFromWishlist: async (stockId: string): Promise<any> => {
    const response = await apiClient.delete(`/api/wishlist/${stockId}`);
    return response.data;
  },

  setAlert: async (payload: SetAlertPayload): Promise<any> => {
    const response = await apiClient.post('/api/wishlist/alert', payload);
    return response.data;
  },
};
