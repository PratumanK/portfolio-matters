import type { Request, Response } from "express";
import { getPortfolioSummaryService } from "./portfolio.services.js";

export const getPortfolioSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await getPortfolioSummaryService(req.user.id);

    return res.status(200).json(summary);

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};