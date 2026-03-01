import type { Request,Response } from "express";

import { addStockToWishlistService,removeStockToWishlistService,getWishlistService } from "./wishlist.services.js";
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
  
  
