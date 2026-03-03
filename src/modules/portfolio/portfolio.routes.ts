import express from "express";
import { getPortfolioSummary,getSectorSummary,getReturn,getTopMovers,getSimulation } from "./portfolio.controller.js";

import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


export const router = express.Router();
router.use(authorization);


router.get("/", getPortfolioSummary);
router.get("/sector", getSectorSummary);
router.get("/return", getReturn);
router.get("/topMovers", getTopMovers);
router.get("/simulation", getSimulation);