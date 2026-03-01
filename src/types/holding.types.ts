import { Document ,Types} from "mongoose";


export interface IHolding extends Document {
  userId: Types.ObjectId;
  stockId: Types.ObjectId;    
  quantity: number;
  avgBuyPrice: number;
  createdAt: Date;
  updatedAt: Date;
}