import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  showWishlist
} from "./wishlist.controller.js";

import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


export const router = express.Router();
router.use(authorization);

router.get("/", showWishlist);
router.post("/:stockId", addToWishlist);
router.delete("/:stockId", removeFromWishlist);