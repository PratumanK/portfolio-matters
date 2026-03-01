import { ingestNseStocks } from "./services/stockIngestion.services.js";
import express from "express"
export const router= express.Router();
import { getStockBySymbol,getPages,searchStocks } from "./stock.controller.js";
import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


router.use(authorization);
router.get('/search',searchStocks);
router.get('/filter',  getStockBySymbol);
router.get('/',getPages);
