import DiscountRecommendation from "../models/DiscountRecommendation.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";

export const getPublicDeals = async (req, res, next) => {
  try {
    const deals = await DiscountRecommendation.find({
      status: { $in: ["ACCEPTED", "CUSTOMIZED", "PENDING"] },
    })
      .populate("productId")
      .populate("shopId", "name address phone lat lng category")
      .sort({ recommendedDiscountPercent: -1 })
      .limit(30);

    const formattedDeals = deals.map((deal) => {
      const prod = deal.productId || {};
      const shop = deal.shopId || {};
      const discountPct = deal.appliedDiscountPercent || deal.recommendedDiscountPercent;
      const finalPrice = deal.recommendedPrice || Math.round(deal.currentPrice * (1 - discountPct / 100));

      return {
        _id: deal._id,
        productName: deal.productName,
        imageUrl: prod.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        category: prod.category || "Grocery",
        originalPrice: deal.currentPrice,
        discountedPrice: finalPrice,
        discountPercent: discountPct,
        daysRemaining: deal.daysRemaining,
        expiryDate: prod.expiryDate,
        quantityAvailable: deal.currentStock,
        shopName: shop.name || "SmartStock Grocery",
        shopAddress: shop.address || "Main Street Hub",
        distanceKm: (1.2 + Math.random() * 2.5).toFixed(1),
      };
    });

    res.json(formattedDeals);
  } catch (error) {
    next(error);
  }
};
