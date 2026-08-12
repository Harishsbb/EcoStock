import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    barcode: { type: String, required: true },
    category: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    minimumStock: { type: Number, default: 10 },
    expiryDate: { type: Date },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    status: {
      type: String,
      enum: ["Healthy", "Low Stock", "Critical", "Near Expiry", "Expired"],
      default: "Healthy",
    },
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplierId: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
