// Shared TypeScript definitions for Portfolio Matters

export interface User {
  userId: string;
  userName: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  userName?: string;
  email?: string;
  password: string;
}

export interface Stock {
  _id: string;
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedStocks {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Stock[];
}

export interface WishlistItem {
  _id?: string;
  stock: Stock;
  alertPrice?: number;
  alertType?: 'above' | 'below';
  alertActive: boolean;
  alertTriggered: boolean;
}

export interface SetAlertPayload {
  stockId: string;
  alertPrice: number;
  alertType: 'above' | 'below';
}

export interface Holding {
  _id: string;
  userId: string;
  stockId: string;
  quantity: number;
  avgBuyPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PopulatedHolding {
  _id: string;
  userId: string;
  stockId: Stock;
  quantity: number;
  avgBuyPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddHoldingPayload {
  stockId: string;
  quantity: number;
  buyPrice: number;
}

export interface SellHoldingPayload {
  stockId: string;
  quantity: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface TopMoverHolding {
  _id: string;
  stockId: string;
  quantity: number;
  avgBuyPrice: number;
  stock: Stock;
  investedAmount: number;
  currentAmount: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface TopMovers {
  topGainer: TopMoverHolding | null;
  topLoser: TopMoverHolding | null;
}

export interface PortfolioReturn {
  change: number;
  changePercent: number;
}

export interface SimulationResult {
  totalValue: number;
  marketChangePercent: number;
  projectedValue: number;
  riskScore: number;
  riskLevel: string;
  diversificationScore: number;
}
