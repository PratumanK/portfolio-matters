import { Stock } from "../../../models/stock.js";
import type { StockDTO } from "../../../types/eStock.types.js";
import { transformNseStock } from "../stock.transformer.js";
import { nseDetails, symbols } from "../provider/nse.provider.js";


export const ingestNseStocks = async () => {
  const allSymbols = await symbols();
 

const bulkOps = [];

  for (const symbol of allSymbols) {
    try {
      const rawDetails = await nseDetails(symbol);
      const stock = transformNseStock(rawDetails);
        

        
      bulkOps.push({
        updateOne: {
          filter: { symbol: stock.symbol },
          update: { $set: stock },
          upsert: true,
        },
      }); 
       
    } catch (err) {
      console.error(`Failed to ingest  ${symbol}`);
    }
  }
    if (bulkOps.length > 0) {
    await Stock.bulkWrite(bulkOps);
    console.log(`✅ Ingested ${bulkOps.length} stocks`);
  }


}
