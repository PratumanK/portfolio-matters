import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  setPrice,
  showWishlist
} from "./wishlist.controller.js";

import { authMiddleware as authorization } from "../../middlewares/auth.middleware.js";


export const router = express.Router();
router.use(authorization);

router.get("/", showWishlist);
router.post("/alert",setPrice);
router.post("/:stockId", addToWishlist);
router.delete("/:stockId", removeFromWishlist);
