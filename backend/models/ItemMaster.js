import mongoose from 'mongoose';

const itemMasterSchema = new mongoose.Schema({
  itemId:    { type: String, required: true, unique: true },
  itemName:  { type: String, required: true },
  category:  { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  abcClass:  { type: String, required: true, enum: ['A','B','C'] },
  msl:       { type: Number, required: true, min: 0 }
}, { timestamps: true });

const ItemMaster = mongoose.model('ItemMaster', itemMasterSchema);
export default ItemMaster;
