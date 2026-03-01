import type { Request,Response } from "express";
import { Stock } from "../../models/stock.js";
import { getStockBySymbolService,searchStockService,getStocksPaginatedService} from "./services/stock.services.js";

export const getStockBySymbol= async (req:Request,res:Response)=>{
  try{
  const {symbol}= req.params;
  if (!symbol || typeof symbol !== "string"){
    return res.status(400).json({ message: "Invalid Symbol " });
    }
  const stock= await getStockBySymbolService(symbol.toUpperCase());
  if(!stock){
    return res.status(400).json({ message: "Stock Does Not Exist " });
  }
  res.status(200).json(stock);

}catch(error){
  return res.status(500).json({ message: "Server Error " });
}
}



export const searchStocks = async (req: Request, res: Response) => {
  try {
    const {query}=req.query;
    if(!query || typeof query !== "string" ){
      return res.status(400).json({ message: "Invalid Query " });
    }
    const stocks=await searchStockService(query);
    res.status(200).json(stocks);
  }
  catch(error){
    return res.status(500).json({ message: "Server Error " });
  }
}

3


export const getPages=async (req: Request, res: Response) => {
  try {
    let page= Number(req.query.page)||1
    let limit=Number(req.query.limit)||1

   
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "page and limit must be positive numbers",
      });
    }
    
    const result = await getStocksPaginatedService(page, limit);

    return res.status(200).json(result);


  }catch(error){
   return res.status(500).json({ message: "Server Error " });
  }
}