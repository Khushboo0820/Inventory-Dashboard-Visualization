// scripts/migrateExcelJSON.js

import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';

import InventoryData from '../models/InventoryData.js';
import ItemMaster from '../models/itemMaster.js';

const rawInventoryData = JSON.parse(fs.readFileSync('./data/inventoryData.json', 'utf-8'));
const rawItemMasterData = JSON.parse(fs.readFileSync('./data/itemMaster.json', 'utf-8'));

dotenv.config();

async function runMigration() {
  try {
    // 1) Connect to Mongo
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // 2) Upsert ItemMaster docs
    const itemOps = rawItemMasterData.map((row) => {
      const itemId   = String(row['Item ID']).trim();
      const itemName = String(row['Item Name']).trim();
      const category = String(row['Category']).trim();
      const unitPrice = parseFloat(row['Unit Price']);
      const abcClass = String(row['ABC Class']).trim();
      const msl = parseFloat(row['MSL']);

      return {
        updateOne: {
          filter: { itemId },
          update: {
            $set: {
              itemId,
              itemName,
              category,
              unitPrice,
              abcClass,
              msl
            }
          },
          upsert: true
        }
      };
    });

    if (itemOps.length) {
      const result = await ItemMaster.bulkWrite(itemOps);
      const itemCount = result?.upsertedCount + result?.modifiedCount || 0;
    console.log(`ItemMaster: upsertedModified=${itemCount}`);

    } else {
      console.log('No raw ItemMaster rows to import.');
    }

    // 3) Upsert InventoryData docs
    const invOps = rawInventoryData.map((row) => {
      // Map raw columns → schema fields:
      const dateStr = String(row['Date']).trim(); 
      // If your Excel date is "2025-02-01 00:00:00", new Date(...) will work.
      const date = new Date(dateStr);

      const itemId = String(row['Item ID']).trim();
      const openingStock = Number(row['Opening Stock']);
      const consumption = Number(row['Consumption']);
      const incoming = Number(row['Incoming']);
      const closingStock = Number(row['Closing Stock']);
      const inventoryTurnoverRatio = Number(row['Inventory Turnover ratio']);
      const ratio = Number(row['Ratio']);

      return {
        updateOne: {
          filter: { itemId, date }, 
          update: {
            $set: {
              date,
              itemId,
              openingStock,
              consumption,
              incoming,
              closingStock,
              inventoryTurnoverRatio,
              ratio
            }
          },
          upsert: true
        }
      };
    });

    if (invOps.length) {
      const invResult = await InventoryData.bulkWrite(invOps);
      const invCount = invResult?.upsertedCount + invResult?.modifiedCount || 0;
        console.log(`InventoryData: upsertedModified=${invCount}`);

    } else {
      console.log('No raw InventoryData rows to import.');
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
