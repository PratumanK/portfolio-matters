import { z } from "zod";

export const addHoldingSchema = z.object({
   quantity: z
    .number()
    .int()
    .positive(),
    
    stockId: z.string().min(1),


  avgBuyPrice: z
    .number()
    .positive()
});

 export const updateHoldingSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive().optional(),
    avgBuyPrice: z.number().positive().optional(),
  }),
});