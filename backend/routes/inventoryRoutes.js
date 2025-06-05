import express from 'express';

import {
  getCategoryDistribution,
  getInventoryTurnoverRatios,
  getMonthlyConsumptionTrends,
  getStockVsMslTrends,
} from '../controllers/inventoryController.js';
import {
  getAllInventoryPaginated,
} from '../controllers/itemMasterController.js';

const router = express.Router();

//Q1
router.get('/category-distribution', getCategoryDistribution);

// Q2
router.get('/stock-vs-msl', getStockVsMslTrends);

//Q3
router.get('/monthly-consumption', getMonthlyConsumptionTrends);

// Q4
router.get('/itr', getInventoryTurnoverRatios);

// All Data 
router.get('/all', getAllInventoryPaginated);
export default router;
