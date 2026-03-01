import mongoose from "mongoose";
import type { IHolding } from "../types/holding.types.js";

const holdingSchema = new mongoose.Schema<IHolding>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    avgBuyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);


holdingSchema.index({ userId: 1, stockId: 1 }, { unique: true });

export const Holding = mongoose.model<IHolding>("Holding", holdingSchema);