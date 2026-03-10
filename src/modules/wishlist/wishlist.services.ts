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
  
  user.wishlist.push(
    {
      stock: new mongoose.Types.ObjectId(stockId),
      alertTriggered:false,
      alertActive:false
    }
  );
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
    { $pull: { wishlist:{stock:stockId }} },
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
  const user = await User.findById(userId).populate("wishlist.stock");
  if (!user) {
    throw new Error("User not found");
  }
  return user.wishlist;

}

export const setPriceAlert  = async (
  userId: string,
  stockId: string,
  alertPrice:number,
  alertType:"above"|"below"
) => {
 const user = await User.findById(userId);
 if (!user) {
    throw new Error("User not found");
  }
    const wishlistItem = user.wishlist.find(
    (item) => item.stock.toString() === stockId
  );

  if (!wishlistItem) {
    throw new Error("Stock not in wishlist");
  }
  wishlistItem.alertActive=true;
  wishlistItem.alertType=alertType;
  wishlistItem.alertPrice=alertPrice;
    await user.save();

  return wishlistItem;
}