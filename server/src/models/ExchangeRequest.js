import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "SurplusListing", required: true },
    requestingShopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    requestingShopName: { type: String, required: true },
    requestingPhone: { type: String },
    requestedQuantity: { type: Number, required: true },
    offeredPricePerUnit: { type: Number, required: true },
    totalOfferValue: { type: Number, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const ExchangeRequest = mongoose.model("ExchangeRequest", exchangeRequestSchema);
export default ExchangeRequest;
