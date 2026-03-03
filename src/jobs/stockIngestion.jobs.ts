// jobs/stockIngestion.cron.ts
import cron from "node-cron";
import { ingestNseStocks } from "../modules/stocks/services/stockIngestion.services.js";
export const startStockCron = () => {
cron.schedule("50 10 * * 1-5", async () => {
  console.log("Starting NSE stock ingestion...");
  try {
      await ingestNseStocks();
      console.log("✅ Stock ingestion completed");
    } catch (err) {
      console.error("❌ Cron failed:", err);
    }
});
}
