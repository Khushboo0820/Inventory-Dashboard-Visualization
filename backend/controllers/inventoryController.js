// server/controllers/inventoryController.js
import InventoryData from '../models/InventoryData.js';

/**
 * Q1. Category-wise distribution of inventory items.
 *    - Query params: itemName?, abcClass?, startDate?, endDate?
 *    - We return: [{ category: "X", itemCount: 12 }, ...]
 */
export const getCategoryDistribution = async (req, res) => {
  try {
    const { itemName, abcClass, startDate, endDate } = req.query;
    const match= {};

    // Join InventoryData → ItemMaster to filter by itemName/abcClass
    if (itemName) match['itemInfo.itemName'] = { $regex: new RegExp(itemName, 'i') };
    if (abcClass) match['itemInfo.abcClass'] = abcClass;

    // Date range on InventoryData.date
    if (startDate || endDate) {
      match['date'] = {};
      if (startDate) match['date'].$gte = new Date(startDate);
      if (endDate) match['date'].$lte = new Date(endDate);
    }

    // Aggregate:
    const distribution = await InventoryData.aggregate([
      // (a) Lookup the ItemMaster document
      {
        $lookup: {
          from: 'itemmasters', // MongoDB collection name (lowercase + plural by default)
          localField: 'itemId',
          foreignField: 'itemId',
          as: 'itemInfo'
        }
      },
      { $unwind: '$itemInfo' },
      // (b) Apply filters (itemName, abcClass, date range)
      { $match: match },
      // (c) Group by category (from itemInfo.category). Count distinct itemIds
      {
        $group: {
          _id: '$itemInfo.category',
          uniqueItems: { $addToSet: '$itemId' }
        }
      },
      {
        $project: {
          category: '$_id',
          itemCount: { $size: '$uniqueItems' },
          _id: 0
        }
      }
    ]);

    res.json(distribution);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error in getCategoryDistribution' });
  }
};

/**
 * Q2. For each item, show time series of closingStock vs. MSL. 
 *     Highlight where closingStock < MSL or significantly > MSL.
 *     - Query params: itemId? startDate? endDate?
 *     Returns: [{ date, itemId, closingStock, msl, status }, ...]
 *     status: "belowMSL", "normal", "aboveMSL" (you define threshold for "significantly exceeds" e.g. 2× MSL)
 */
export const getStockVsMslTrends = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.query;
    const matchInv= {};

    if (itemId) matchInv['itemId'] = itemId;
    if (startDate || endDate) {
      matchInv['date'] = {};
      if (startDate) matchInv['date'].$gte = new Date(startDate);
      if (endDate) matchInv['date'].$lte = new Date(endDate);
    }

    // Lookup MSL via ItemMaster for each InventoryData row
    const pipeline = [
      { $match: matchInv },
      {
        $lookup: {
          from: 'itemmasters',
          localField: 'itemId',
          foreignField: 'itemId',
          as: 'itemInfo'
        }
      },
      { $unwind: '$itemInfo' },
      // Project needed fields
      {
        $project: {
          date: 1,
          itemId: 1,
          closingStock: 1,
          msl: '$itemInfo.msl'
        }
      },
      // Determine status
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $lt: ['$closingStock', '$msl'] }, then: 'belowMSL' },
                // “significantly exceeds” → e.g. > 2× MSL
                { case: { $gt: ['$closingStock', { $multiply: [2, '$msl'] }] }, then: 'aboveMSL' }
              ],
              default: 'normal'
            }
          }
        }
      },
      { $sort: { date: 1 } } // chronological
    ];

    const trends = await InventoryData.aggregate(pipeline);
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error in getStockVsMslTrends' });
  }
};

/**
 * Q3. Trend of consumption for all items (monthly aggregation).
 *     Filters: category?, abcClass?, itemId?
 *     — Monthly aggregation: sum(consumption) per month.
 *     Returns: [{ yearMonth: "2025-01", totalConsumption: 1234 }, ...]
 */
export const getMonthlyConsumptionTrends = async (req, res) => {
  try {
    const { category, abcClass, itemId, startDate, endDate } = req.query;
    const match= {};

    // Date filter
    if (startDate || endDate) {
      match['date'] = {};
      if (startDate) match['date'].$gte = new Date(startDate);
      if (endDate) match['date'].$lte = new Date(endDate);
    }

    // If filtering by itemId alone:
    if (itemId) {
      match['itemId'] = itemId;
    }

    // If filtering by category or abcClass, we need to lookup ItemMaster first
    const pipeline= [
      // 1) Apply date/itemId match first on InventoryData
      { $match: match },
      // 2) Lookup ItemMaster
      {
        $lookup: {
          from: 'itemmasters',
          localField: 'itemId',
          foreignField: 'itemId',
          as: 'itemInfo'
        }
      },
      { $unwind: '$itemInfo' }
    ];

    // 3) If category filter
    if (category) {
      pipeline.push({ $match: { 'itemInfo.category': category } });
    }
    if (abcClass) {
      pipeline.push({ $match: { 'itemInfo.abcClass': abcClass } });
    }

    // 4) Project yearMonth and consumption
    pipeline.push({
      $project: {
        yearMonth: { $dateToString: { format: '%Y-%m', date: '$date' } },
        consumption: 1
      }
    });

    // 5) Group by yearMonth
    pipeline.push({
      $group: {
        _id: '$yearMonth',
        totalConsumption: { $sum: '$consumption' }
      }
    });

    // 6) Sort by yearMonth ascending
    pipeline.push({ $sort: { _id: 1 } });

    // 7) Final format
    pipeline.push({
      $project: {
        yearMonth: '$_id',
        totalConsumption: 1,
        _id: 0
      }
    });

    const result = await InventoryData.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error in getMonthlyConsumptionTrends' });
  }
};

/**
 * Q4. Calculate ITR for each item:
 *     ITR = TotalConsumption ÷ AverageInventory
 *     where AverageInventory = (OpeningStock + ClosingStock) ÷ 2 (for each day),
 *     but usually you want to calculate over the entire date range:
 *       - TotalConsumption = sum(consumption per day) over period
 *       - AverageInventory = avg( (openingStock+closingStock)/2 ) over period
 *
 *     Filters: category?, abcClass?, itemId?, startDate?, endDate?
 *     Return: [{ itemId, itemName, totalConsumption, avgInventory, itr }, ...]
 *     Also mark items “lowTurnover” or “highTurnover” based on thresholds (e.g., itr < 0.5 = low; > 2 = high).
 */
export const getInventoryTurnoverRatios = async (req, res) => {
  try {
    const { category, abcClass, itemId, startDate, endDate } = req.query;
    const match= {};

    if (startDate || endDate) {
      match['date'] = {};
      if (startDate) match['date'].$gte = new Date(startDate);
      if (endDate) match['date'].$lte = new Date(endDate);
    }
    if (itemId) {
      match['itemId'] = itemId;
    }

    // Pipeline:
    const pipeline= [
      { $match: match },
      // 1) Lookup item info (to filter by category/abcClass)
      {
        $lookup: {
          from: 'itemmasters',
          localField: 'itemId',
          foreignField: 'itemId',
          as: 'itemInfo'
        }
      },
      { $unwind: '$itemInfo' }
    ];

    if (category) {
      pipeline.push({ $match: { 'itemInfo.category': category } });
    }
    if (abcClass) {
      pipeline.push({ $match: { 'itemInfo.abcClass': abcClass } });
    }

    // 2) For each InventoryData doc, compute dailyAverage = (openingStock+closingStock)/2
    pipeline.push({
      $addFields: {
        dailyAvgInv: { $divide: [{ $add: ['$openingStock', '$closingStock'] }, 2] }
      }
    });

    // 3) Group by itemId (and get itemName from itemInfo)
    pipeline.push({
      $group: {
        _id: '$itemId',
        itemName: { $first: '$itemInfo.itemName' },
        totalConsumption: { $sum: '$consumption' },
        avgInventory: { $avg: '$dailyAvgInv' }
      }
    });

    // 4) Compute ITR = totalConsumption / avgInventory
    pipeline.push({
      $addFields: {
        itr: { $cond: [{ $eq: ['$avgInventory', 0] }, 0, { $divide: ['$totalConsumption', '$avgInventory'] }] }
      }
    });

    // 5) Mark low vs high based on thresholds you choose
    pipeline.push({
      $addFields: {
        turnoverCategory: {
          $switch: {
            branches: [
              { case: { $lt: ['$itr', 0.5] }, then: 'lowTurnover' },
              { case: { $gt: ['$itr', 2] }, then: 'highTurnover' }
            ],
            default: 'normalTurnover'
          }
        }
      }
    });

    // 6) Format output
    pipeline.push({
      $project: {
        _id: 0,
        itemId: '$_id',
        itemName: 1,
        totalConsumption: 1,
        avgInventory: 1,
        itr: 1,
        turnoverCategory: 1
      }
    });

    // 7) Sort by itr descending
    pipeline.push({ $sort: { itr: -1 } });

    const results = await InventoryData.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error in getInventoryTurnoverRatios' });
  }
};
