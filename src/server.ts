import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db.js";
const app= express();
app.use(express.json());
dotenv.config();
import {router as authRoutes} from './modules/auth/auth.routes.js';
import {router as stockRoutes} from "./modules/stocks/stock.routes.js";
import { router as wishlistRoutes } from "./modules/wishlist/wishlist.routes.js";
import { router as holdingRoutes } from "./modules/holdings/holdings.routes.js";
import { router as summaryRoutes } from "./modules/portfolio/portfolio.routes.js";
import { startStockCron } from "./jobs/stockIngestion.jobs.js";
import { startPortfolioSnapshotCron } from "./jobs/snapshot.jobs.js";


const PORT = process.env.PORT || 3001;
app.use('/auth',authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/holdings",holdingRoutes);
app.use("/api/summary",summaryRoutes);
const startServer = async () => {
  await connectToDatabase(); //  DB connection is checked ONCE here
  startStockCron();
  startPortfolioSnapshotCron();
  

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};
startServer();