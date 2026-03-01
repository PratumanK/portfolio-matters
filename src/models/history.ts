import mongoose from "mongoose";
import type { IHistory } from "../types/history.types.js"; 


const historySchema = new mongoose.Schema<IHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  
    totalValue: {
      type: Number,
      required: true,
      min: 1,
    }
  },
  { timestamps: true }
);

export const History = mongoose.model<IHistory>("History", historySchema);