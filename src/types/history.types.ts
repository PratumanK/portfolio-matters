import { Document ,Types} from "mongoose";


export interface IHistory extends Document {
  userId: Types.ObjectId;
  totalValue:number;
  createdAt: Date;
  updatedAt: Date;
}