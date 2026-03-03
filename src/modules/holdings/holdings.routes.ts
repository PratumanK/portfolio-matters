import express from "express";
import { buyHolding,sellHolding } from "./holdings.controller.js";

import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


export const router = express.Router();
router.use(authorization);


router.post("/add", buyHolding);
router.put("/sell", sellHolding);