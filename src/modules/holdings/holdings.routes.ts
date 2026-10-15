import express from "express";
import { buyHolding, sellHolding, getHoldings } from "./holdings.controller.js";

import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


export const router = express.Router();
router.use(authorization);


router.get("/", getHoldings);
router.post("/add", buyHolding);
router.put("/sell", sellHolding);