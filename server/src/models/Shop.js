import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, default: "Main Market Road, City Center" },
    phone: { type: String },
    category: { type: String, default: "Grocery & Supermarket" },
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.209 },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
