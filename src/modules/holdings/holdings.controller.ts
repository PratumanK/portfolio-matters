import type { Request,Response } from "express";
import { buyHoldingService,sellHoldingService } from "./holdings.services.js";
import mongoose from "mongoose";



export const buyHolding= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

      const { stockId,quantity,buyPrice } = req.body;
       if (!mongoose.Types.ObjectId.isValid(stockId)) {
  return res.status(400).json({ message: "Invalid stockId" });
}
       if(buyPrice<=0){
        return res.status(400).json({ message: "invalid BuyPrice" });
       }
       if(quantity<=0){
        return res.status(400).json({ message: "invalid Quantity" });
       }
      const result = await buyHoldingService(
      req.user.id,
      stockId,
      quantity,
      buyPrice
    );

     res.status(200).json({
           success: true,
      data: result
     });
  }
    

catch(error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}

export const sellHolding= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

      const { stockId,quantity } = req.body;
        if (!mongoose.Types.ObjectId.isValid(stockId)) {
  return res.status(400).json({ message: "Invalid stockId" });
}
       if(quantity<=0){
        return res.status(400).json({ message: "invalid Quantity" });
       }
      const result = await sellHoldingService(
      req.user.id,
      stockId,
      quantity,
    );

     res.status(200).json({
           success: true,
      data: result
     });
  }
    

catch(error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}