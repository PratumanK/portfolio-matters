import { NseIndia } from "stock-nse-india";

const nseIndia = new NseIndia();

export const symbols =  async():Promise<string[]> =>{
  try{
    return await nseIndia.getAllStockSymbols();

  }
  catch(error){
    throw new Error("NSE_FETCH_SYMBOLS_FAILED");

  }
}

export const nseDetails= async (symbol:string)=>{
  try{
    return await nseIndia.getEquityDetails(symbol);

  }
  catch(error){
    throw new Error(`NSE_FETCH_EQUITY_FAILED:${symbol}`);
  }
}
