import type { StockDTO } from "../../types/eStock.types.js";

export const transformNseStock = (raw:any): StockDTO => {
  return {
    symbol: raw.info?.symbol,
    name: raw.info?.companyName || raw.symbol,

        sector: raw.info?.industry || "UNKNOWN",

    currentPrice: raw.priceInfo?.lastPrice ?? 0,

    lastUpdated: new Date(),
  };
};
