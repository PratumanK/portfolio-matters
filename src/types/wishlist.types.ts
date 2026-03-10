import { Document, Types } from "mongoose";

export interface IWishlist {
   stock: Types.ObjectId;
  alertPrice?: number;
  alertType?: "above" | "below";
  alertActive?: boolean;
  alertTriggered?: boolean;
}