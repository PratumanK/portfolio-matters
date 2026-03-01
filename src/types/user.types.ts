import { Document, Types } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  wishlist: Types.ObjectId[];
}
