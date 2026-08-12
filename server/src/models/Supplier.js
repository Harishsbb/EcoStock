import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    productsHandled: [{ type: String }],
    deliveryDays: { type: Number, default: 2 },
    rating: { type: Number, default: 4.5 },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

const supplierPriceHistorySchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    productName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    unitPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true }
);

export const SupplierPriceHistory = mongoose.model("SupplierPriceHistory", supplierPriceHistorySchema);
export default Supplier;
