import mongoose from "mongoose";
import type { IUser } from "../types/user.types.js";

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
         stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true
    },
    alertPrice: {
      type: Number
    },
    alertType: {
      type: String,
      enum: ["above", "below"]
    },
    alertActive: {
      type: Boolean,
      default: false
    },
    alertTriggered: {
      type: Boolean,
      default: false
    }
    }
  
  ]
})
export const User = mongoose.model('User', userSchema);
