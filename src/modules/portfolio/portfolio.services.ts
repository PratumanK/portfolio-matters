import { Holding } from "../../models/holding.js";
import { History } from "../../models/history.js";
import mongoose from "mongoose";

export const getPortfolioSummaryService = async (userId: string) => {
  const summary = await Holding.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
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
        investedAmount: { $multiply: ["$quantity", "$avgBuyPrice"] },
        currentAmount: { $multiply: ["$quantity", "$stock.currentPrice"] }
      }
    },

    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$investedAmount" },
        currentValue: { $sum: "$currentAmount" }
      }
    },

    {
      $project: {
        _id: 0,
        totalInvested: 1,
        currentValue: 1,
        profitLoss: { $subtract: ["$currentValue", "$totalInvested"] },
     profitLossPercentage: {
  $cond: [
    { $eq: ["$totalInvested", 0] },
    0,
    {
      $multiply: [
        {
          $divide: [
            { $subtract: ["$currentValue", "$totalInvested"] },
            "$totalInvested"
          ]
        },
        100
      ]
    }
  ]
}
      }
    }
  ]);

  return summary[0] || {
    totalInvested: 0,
    currentValue: 0,
    profitLoss: 0,
    profitLossPercentage:0
  };
};


export const getSectorService= async (userId: string) => {
  const result = await Holding.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
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
        
        currentAmount: { $multiply: ["$quantity", "$stock.currentPrice"] }
      }
    },

    {
      $group: { 
        _id: "$stock.sector",
         sectorValue: { $sum: "$currentAmount" },
     
      }
    }])
  

  const totalValue = result.reduce((acc, s) => acc + s.sectorValue, 0);

  return result.map(s => ({
    sector: s._id,
    value: s.sectorValue,
    percentage: totalValue === 0
      ? 0
      : Number(((s.sectorValue / totalValue) * 100).toFixed(2))
  }));
};


export const getReturnService = async (
  userId: string,
  days: number
) => {
  const snapshots = await History.find({ userId })
    .sort({ createdAt: -1 })
    .limit(days + 1); // we need today + N days ago

  if (snapshots.length < days + 1) {
    return {
      change: 0,
      changePercent: 0
    };
  }

  const today = snapshots[0]!.totalValue;
  const pastValue = snapshots[days]!.totalValue;

  const diff = today - pastValue;

  return {
    change: diff,
    changePercent:
      pastValue === 0
        ? 0
        : Number(((diff / pastValue) * 100).toFixed(2))
  };
};

export const getTopMoversService = async (userId: string) => {
  const result = await Holding.aggregate([
    { 
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
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
        investedAmount: { $multiply: ["$quantity", "$avgBuyPrice"] },
        currentAmount: { $multiply: ["$quantity", "$stock.currentPrice"] }
      }
    },
    {
      $addFields: {
        profitLoss: { $subtract: ["$currentAmount", "$investedAmount"] },
         profitLossPercentage: {
  $cond: [
    { $eq: ["$investedAmount", 0] },
    0,
    {
      $multiply: [
        {
          $divide: [
            { $subtract: ["$currentValue", "$investedAmount"] },
            "$investedAmount"
          ]
        },
        100
      ]
    }
  ]
}
      }
    },
    {
  $facet: {
    topGainer: [
      { $sort: { profitLoss: -1 } },
      { $limit: 1 }
    ],
    topLoser: [
      { $sort: { profitLoss: 1 } },
      { $limit: 1 }
    ]
  }
}
  ])
   return {
    topGainer: result[0]?.topGainer[0] || null,
    topLoser: result[0]?.topLoser[0] || null
  };
}
   
export const simulatePortfolioService = async (
  userId: string,
  marketChangePercent: number
) => {
    const summary= await getPortfolioSummaryService(userId);
    const totalValue = summary.currentValue;
    const projectedValue = totalValue * (1 + marketChangePercent / 100);
    let hhi:number=0;
    const sectors=await getSectorService(userId);
    for (const sector of sectors) {
    const weight = sector.percentage / 100;
    hhi += weight * weight;
  }
  let riskLevel: string;


  if (hhi < 0.15)
     riskLevel = "Low (Diversified)";
  else if (hhi < 0.25) 
    riskLevel = "Moderate";
  else riskLevel = 
  "High (Concentrated)";

  const diversificationScore = (1 - hhi)* 100;

   return{
    totalValue,
    marketChangePercent,
    projectedValue: Number(projectedValue.toFixed(2)),
    riskScore: Number(hhi.toFixed(3)),
    riskLevel,
    diversificationScore
   }
  }