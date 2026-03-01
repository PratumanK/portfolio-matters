import mongoose from "mongoose";
import type { IStock } from "../types/stock.types.js";

 const stockSchema= new mongoose.Schema<IStock>({
  symbol:{
    type:String,
    required:true,
    trim:true,
    unique: true,
    index:true,
    uppercase:true
  } ,    
  name:{
    type:String,
    required:true,
    trim:true,
  } ,          
  sector: {
    type:String,
    required:true,
    trim:true,
    index:true
  } ,   
  currentPrice:{
    type:Number,
    required:true,
  } ,   
  

},
{ timestamps: true })
export const Stock = mongoose.model('Stock', stockSchema);
