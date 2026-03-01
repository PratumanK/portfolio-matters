import { ZodSchema , ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
export const validate =
  (schema:ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error ) {
      if (error instanceof ZodError){
         return res.status(400).json({
        success: false,
        errors: error.errors,
      });}
     
    }
  };
