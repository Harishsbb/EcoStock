import mongoose from "mongoose";

const surplusListingSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    category: { type: String, default: "General" },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "units" },
    originalPrice: { type: Number, required: true },
    surplusPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    locationName: { type: String, default: "City Center, Sector 14" },
    distanceKm: { type: Number, default: 2.5 },
    lat: { type: Number },
    lng: { type: Number },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "RESERVED", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const surplusListing = mongoose.model("SurplusListing", surplusListingSchema);
export default surplusListing;
