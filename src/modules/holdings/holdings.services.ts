import mongoose from "mongoose";
import { Holding } from "../../models/holding.js";



export const buyHoldingService = async (
  userId: string,
  stockId: string,
  quantity:number,
  buyPrice:number
) => {
  const existing = await Holding.findOne({
    userId,
    stockId,
  });
 
  if (!existing) {
   return await Holding.create({
      userId,
      stockId,
      quantity,
      avgBuyPrice: buyPrice,
    });
  }
  const totalQty = existing.quantity + quantity;
  const newAvg =
    (existing.quantity * existing.avgBuyPrice +
      quantity * buyPrice) /
    totalQty;

  existing.quantity = totalQty;
  existing.avgBuyPrice = newAvg;
   await existing.save();
   return existing;
}


export const sellHoldingService = async (
  userId: string,
  stockId: string,
  quantity:number,
) => {
   const existing = await Holding.findOne({
    userId,
    stockId,
  });
   if (!existing) {
    throw new Error("No holding found");
  }
  if (quantity > existing.quantity) {
    throw new Error("Cannot sell more than owned quantity");
  }
  existing.quantity-=quantity;
  if (existing.quantity === 0) {
    await existing.deleteOne();
    return { message: "Position closed" };
  }
    await existing.save();
  return existing;
}