import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db.js";
const app= express();
app.use(express.json());
dotenv.config();
import {router as authRoutes} from './modules/auth/auth.routes.js';
import {router as stockRoutes} from "./modules/stocks/stock.routes.js";
import { startStockCron } from "./jobs/stockIngestion.jobs.js";

const PORT = process.env.PORT || 3000;
app.use('/auth',authRoutes);
app.use("/api/stocks", stockRoutes);
const startServer = async () => {
  await connectToDatabase(); //  DB connection is checked ONCE here
  startStockCron();
  

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};
startServer();