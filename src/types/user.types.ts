import { Document, Types } from "mongoose";
import type { IWishlist } from "./wishlist.types.js";
export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  wishlist: IWishlist[];
}
