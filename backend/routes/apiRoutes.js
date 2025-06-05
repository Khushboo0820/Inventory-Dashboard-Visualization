import express from 'express';

import inventoryRoutes from './inventoryRoutes.js';

const router = express.Router();


router.use('/inventory', inventoryRoutes);

export default router;
