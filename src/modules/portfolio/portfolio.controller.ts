import type { Request, Response } from "express";
import { getPortfolioSummaryService,getSectorService,getReturnService,getTopMoversService,simulatePortfolioService } from "./portfolio.services.js";

export const getPortfolioSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await getPortfolioSummaryService(req.user.id);

    return res.status(200).json(summary);

  } catch (error) {
     console.error("Portfolio summary error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getSectorSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await getSectorService(req.user.id);

    return res.status(200).json(result);

  } catch (error) {
     console.error("Sector summary error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getReturn = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {days}=  req.body;
    if(typeof days !== "number"){
       return res.status(400).json({ message: "Days should be a number" });
    }
    const result = await getReturnService(req.user.id,days);

    return res.status(200).json(result);

  } catch (error) {
     console.error("Get Returns error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getTopMovers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await getTopMoversService(req.user.id);

    return res.status(200).json(result);

  } catch (error) {
     console.error("Top Movers Result error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getSimulation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { marketChangePercent } = req.body;

    if (
      typeof marketChangePercent !== "number" ||
      marketChangePercent < -50 ||
      marketChangePercent > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "marketChangePercent must be a number between -50 and 50"
      });
    }

    const result = await simulatePortfolioService(
      req.user.id,
      marketChangePercent
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Get Simulation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};