import Product from "../models/Product.js";
import DiscountRecommendation from "../models/DiscountRecommendation.js";
import { calculateSmartDiscount } from "../services/discountEngine.js";

export const getDiscountRecommendations = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringProducts = await Product.find({
      shopId,
      expiryDate: { $ne: null, $lte: sevenDaysFromNow },
      quantity: { $gt: 0 },
    });

    const recommendations = [];

    for (const prod of expiringProducts) {
      const calculation = await calculateSmartDiscount(prod, shopId);
      if (calculation.recommendedDiscountPercent > 0) {
        let rec = await DiscountRecommendation.findOne({ shopId, productId: prod._id });
        if (!rec) {
          rec = await DiscountRecommendation.create({
            shopId,
            productId: prod._id,
            productName: prod.name,
            currentPrice: prod.sellingPrice,
            currentStock: prod.quantity,
            daysRemaining: calculation.daysRemaining,
            recommendedDiscountPercent: calculation.recommendedDiscountPercent,
            recommendedPrice: calculation.recommendedPrice,
            expectedRecovery: calculation.expectedRecovery,
            reason: calculation.reason,
            status: "PENDING",
          });
        } else {
          rec.currentStock = prod.quantity;
          rec.daysRemaining = calculation.daysRemaining;
          rec.recommendedDiscountPercent = calculation.recommendedDiscountPercent;
          rec.recommendedPrice = calculation.recommendedPrice;
          rec.expectedRecovery = calculation.expectedRecovery;
          rec.reason = calculation.reason;
          await rec.save();
        }
        recommendations.push(rec);
      }
    }

    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

export const updateDiscountStatus = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { id } = req.params;
    const { status, customDiscountPercent } = req.body;

    const rec = await DiscountRecommendation.findOne({ _id: id, shopId });
    if (!rec) return res.status(404).json({ message: "Recommendation not found" });

    rec.status = status;
    if (customDiscountPercent != null) {
      rec.appliedDiscountPercent = customDiscountPercent;
      rec.recommendedPrice = Math.round(rec.currentPrice * (1 - customDiscountPercent / 100));
      rec.expectedRecovery = Math.round(rec.recommendedPrice * rec.currentStock);
    } else if (status === "ACCEPTED") {
      rec.appliedDiscountPercent = rec.recommendedDiscountPercent;
    }

    await rec.save();
    res.json(rec);
  } catch (error) {
    next(error);
  }
};
