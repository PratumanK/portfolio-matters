import mongoose from "mongoose";
import { User } from "../../models/user.js";
import { Stock } from "../../models/stock.js"; 


export const addStockToWishlistService = async (
  userId: string,
  stockId: string
) => {
   const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }


  const stock = await Stock.findById(stockId);
  const alreadyExists = user.wishlist.some(
    (item) => item.toString() === stockId
 
 );
   if (alreadyExists) {
    throw new Error("Stock already in wishlist");
  }
  
  user.wishlist.push(new mongoose.Types.ObjectId(stockId));
  await user.save();

  return user.wishlist;
}

export const removeStockToWishlistService = async (
  userId: string,
  stockId: string
) => {
    
  
     if (!mongoose.Types.ObjectId.isValid(stockId)) {
    throw new Error("Invalid stock ID");
  }

    const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: stockId } },
    { new: true }
  );
    if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser.wishlist;

}



export const getWishlistService  = async (
  userId: string
) => {
  const user = await User.findById(userId).populate("wishlist");
  if (!user) {
    throw new Error("User not found");
  }
  return user.wishlist;

}