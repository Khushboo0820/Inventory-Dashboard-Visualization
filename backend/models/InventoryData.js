import mongoose from 'mongoose';

const inventoryDataSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    itemId: {
      type: String,
      required: true,
      ref: 'ItemMaster'
    },
    openingStock: {
      type: Number,
      required: true,
      min: 0
    },
    consumption: {
      type: Number,
      required: true,
      min: 0
    },
    incoming: {
      type: Number,
      required: true,
      min: 0
    },
    closingStock: {
      type: Number,
      required: true,
      min: 0
    },
    inventoryTurnoverRatio: {
      type: Number,
      required: true,
      min: 0
    },
    ratio: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

inventoryDataSchema.index({ itemId: 1, date: 1 }, { unique: true });

const InventoryData = mongoose.model('InventoryData', inventoryDataSchema);
export default InventoryData;
