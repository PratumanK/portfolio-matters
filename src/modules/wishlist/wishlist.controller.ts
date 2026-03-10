import type { Request,Response } from "express";
import mongoose from "mongoose";
import { addStockToWishlistService,removeStockToWishlistService,getWishlistService, setPriceAlert } from "./wishlist.services.js";
export const addToWishlist= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

      const { stockId } = req.params;
        if (typeof stockId !== "string") {
      return res.status(400).json({ message: "Invalid stockId" });
    }

      const result = await addStockToWishlistService(
      req.user.id,
      stockId
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

export const removeFromWishlist= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

      const { stockId } = req.params;
        if (typeof stockId !== "string") {
      return res.status(400).json({ message: "Invalid stockId" });
    }

      const result = await removeStockToWishlistService(
      req.user.id,
      stockId
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
export const showWishlist= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}


    

      const result = await getWishlistService(
      req.user.id,
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

export const setPrice= async (req:Request,res:Response)=>{
  try{
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
const userId = req.user.id;

  if(typeof userId !== "string"){
    return res.status(400).json({ message: "Bad Input" });
  }
      const { stockId,alertPrice,alertType } = req.body;
       if (!mongoose.Types.ObjectId.isValid(stockId)) {

  return res.status(400).json({ message: "Invalid stockId" });}

  
          if (!["above", "below"].includes(alertType)) {
      return res.status(400).json({ message: "Invalid alert type" });
    }
   const result = await setPriceAlert(
    userId,
    stockId,
    alertPrice,
    alertType
   )
return res.status(200).json({
      message: "Alert set successfully",
      data: result
    });

   }catch (error) {
    return res.status(500).json({
      message: "Failed to set alert",
      error: error instanceof Error ? error.message : error
    });
  }
}

  
