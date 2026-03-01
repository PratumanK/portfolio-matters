import { Stock } from "../../../models/stock.js";
import type { StockDTO } from "../../../types/eStock.types.js";



export const getStockBySymbolService = async(symbol:string):Promise<StockDTO | null>=>{
  return Stock.findOne({ symbol }).lean();
};


export const searchStockService = async(query:string):Promise<StockDTO []>=>{
  return Stock.find({
    name: { $regex: query, $options: "i" },
  })
    .limit(10)
    .lean();;
};



export const getStocksPaginatedService = async (
  page: number,
  limit: number
) =>{
  let skip=(page-1)*limit;
     
      
      const [stocks, total] = await Promise.all([
        Stock.find()
          .skip(skip)
          .limit(limit).lean(),
        Stock.countDocuments(),
      ]);
      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: stocks,
      };
}
