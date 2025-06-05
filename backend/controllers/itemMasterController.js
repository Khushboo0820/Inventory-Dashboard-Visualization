// server/controllers/inventoryController.js

import InventoryData from '../models/InventoryData.js';

/**
 * GET /api/inventory/all
 * Returns paginated InventoryData, sorted by date descending,
 * with each record’s ItemMaster populated under `itemInfo`.
 *
 * Query parameters:
 *   - page    (default: 1)
 *   - limit   (default: 20)
 *
 * Response:
 *   {
 *     total: <total number of InventoryData docs>,
 *     page: <current page number>,
 *     limit: <page size>,
 *     hasMore: <boolean>,
 *     data: [ 
 *       {
 *         _id,
 *         date,
 *         itemId,             // originally a string, but populated below
 *         openingStock,
 *         consumption,
 *         incoming,
 *         closingStock,
 *         inventoryTurnoverRatio,
 *         ratio,
 *         createdAt,
 *         updatedAt,
 *         itemInfo: {
 *           itemId,
 *           itemName,
 *           category,
 *           unitPrice,
 *           abcClass,
 *           msl,
 *           createdAt,
 *           updatedAt
 *         }
 *       },
 *       … 
 *     ]
 *   }
 */
export const getAllInventoryPaginated = async (req, res) => {
  try {
    // 1) Parse page & limit query params (default to 1,20)
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    // 2) Count total InventoryData docs
    const total = await InventoryData.countDocuments();

    // 3) Aggregation pipeline
    const docs = await InventoryData.aggregate([
      // a) Sort by date descending
      { $sort: { date: -1 } },

      // b) Apply skip & limit here
      { $skip: skip },
      { $limit: limit },

      // c) Lookup matching itemmaster(s) by the string itemId
      {
        $lookup: {
          from: 'itemmasters',       // <-- exactly your collection name
          localField: 'itemId',
          foreignField: 'itemId',
          as: 'itemInfoArr'
        }
      },

      // d) Unwind the itemInfoArr array to a single object (or null if no match)
      {
        $unwind: {
          path: '$itemInfoArr',
          preserveNullAndEmptyArrays: true
        }
      },

      // e) Project: include ALL InventoryData fields plus a sub‐object “itemInfo”
      {
        $project: {
          // InventoryData fields:
          _id: 1,
          date: 1,
          itemId: 1,
          openingStock: 1,
          consumption: 1,
          incoming: 1,
          closingStock: 1,
          inventoryTurnoverRatio: 1,
          ratio: 1,
          createdAt: 1,
          updatedAt: 1,

          // itemInfo sub‐document from the joined collection:
          itemInfo: {
            itemId: '$itemInfoArr.itemId',
            itemName: '$itemInfoArr.itemName',
            category: '$itemInfoArr.category',
            unitPrice: '$itemInfoArr.unitPrice',
            abcClass: '$itemInfoArr.abcClass',
            msl: '$itemInfoArr.msl'
          }
        }
      }
    ]);

    // 4) Determine if there’s another page
    const hasMore = skip + docs.length < total;

    // 5) Return JSON
    return res.json({
      total,
      page,
      limit,
      hasMore,
      data: docs
    });
  } catch (err) {
    console.error('getAllInventoryPaginated error:', err);
    return res.status(500).json({ error: 'Server error fetching paginated inventory' });
  }
};