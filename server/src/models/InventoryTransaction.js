import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    type: {
      type: String,
      enum: ["SALE", "RESTOCK", "WASTE", "EXCHANGE", "DISCOUNT_SALE", "ADJUSTMENT"],
      required: true,
    },
    quantity: { type: Number, required: true },
    costValue: { type: Number, default: 0 },
    recoveredValue: { type: Number, default: 0 },
    reason: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

inventoryTransactionSchema.index({ shopId: 1, createdAt: -1 });

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);
export default InventoryTransaction;
