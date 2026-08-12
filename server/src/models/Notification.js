import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["CRITICAL_LOW_STOCK", "EXPIRY_WARNING", "REVENUE_RECOVERED", "PRICE_DROP", "SURPLUS_OFFER"],
      default: "EXPIRY_WARNING",
    },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ shopId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
