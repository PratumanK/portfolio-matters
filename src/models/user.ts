import mongoose from "mongoose";
import type { IUser } from "../types/user.types.js";
import { Stock } from "./stock.js";

const userSchema= new mongoose.Schema<IUser>({
 userName:{
  type: String,
  required:true,
  unique:true,
  trim:true,
  minlength:5,
  maxlength:20
 },
 email:{
  type:String,
  required:true,
  unique:true,
  trim:true,
  match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  lowercase: true
 },
 password:{
  type: String,
  required: true,
  minlength:5
 },
   wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock"
    }
  ]
})
export const User = mongoose.model('User', userSchema);
