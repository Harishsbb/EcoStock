import mongoose from "mongoose";

const discountRecommendationSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    daysRemaining: { type: Number, required: true },
    recommendedDiscountPercent: { type: Number, required: true },
    recommendedPrice: { type: Number, required: true },
    expectedRecovery: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CUSTOMIZED"],
      default: "PENDING",
    },
    appliedDiscountPercent: { type: Number },
  },
  { timestamps: true }
);

discountRecommendationSchema.index({ shopId: 1, status: 1 });

const DiscountRecommendation = mongoose.model("DiscountRecommendation", discountRecommendationSchema);
export default DiscountRecommendation;
