
import cron from "node-cron";
import { Stock } from "../models/stock.js";
import { Holding } from "../models/holding.js";
import { History } from "../models/history.js";
import mongoose from "mongoose";
export const startPortfolioSnapshotCron  = () => {
cron.schedule("55 10 * * 1-5", async () => {
    console.log("📸 Starting portfolio snapshot job...");

    try {
     const userIds = await Holding.distinct("userId");

for (const userId of userIds) {
  const summary = await Holding.aggregate([
    {
      $match: { userId }
    },
    {
      $lookup: {
        from: "stocks",
        localField: "stockId",
        foreignField: "_id",
        as: "stock"
      }
    },
    { $unwind: "$stock" },
    {
      $addFields: {
        currentAmount: {
          $multiply: ["$quantity", "$stock.currentPrice"]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalValue: { $sum: "$currentAmount" }
      }
    }
  ]);

  const totalValue = summary[0]?.totalValue || 0;

  await History.create({
    userId,
    totalValue
  });
}
    console.log("✅ Portfolio snapshots saved");

    } catch (err) {
      console.error("❌ Snapshot cron failed:", err);
    }


  })
  




}
