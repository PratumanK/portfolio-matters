import { Document } from "mongoose";


export interface IStock extends Document {
  symbol: string      
  name: string        
  sector: string
  currentPrice: number
  lastUpdated: Date
}