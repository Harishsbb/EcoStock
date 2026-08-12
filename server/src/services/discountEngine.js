import Sale from "../models/Sale.js";

/**
 * Dynamic Smart Discount Recommendation Engine
 * Combines: Expiry Date + Current Stock + Daily Sales Velocity + Product Price
 */
export const calculateSmartDiscount = async (product, shopId) => {
  if (!product.expiryDate) {
    return {
      recommendedDiscountPercent: 0,
      recommendedPrice: product.sellingPrice,
      expectedRecovery: 0,
      reason: "No expiry date specified.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(product.expiryDate);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      recommendedDiscountPercent: 0,
      recommendedPrice: 0,
      expectedRecovery: 0,
      reason: "Product is expired. Cannot be sold for consumption.",
    };
  }

  if (daysRemaining > 7) {
    return {
      recommendedDiscountPercent: 0,
      recommendedPrice: product.sellingPrice,
      expectedRecovery: product.sellingPrice * product.quantity,
      reason: `Healthy expiry buffer (${daysRemaining} days remaining). No discount required.`,
    };
  }

  // Calculate Average Daily Sales Velocity over the past 14 days
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recentSales = await Sale.aggregate([
    { $match: { shopId: product.shopId, createdAt: { $gte: fourteenDaysAgo } } },
    { $unwind: "$items" },
    { $match: { "items.productId": product._id } },
    { $group: { _id: null, totalQtySold: { $sum: "$items.quantity" } } },
  ]);

  const totalQtySold = recentSales[0]?.totalQtySold || 0;
  const avgDailySales = Math.max(0.5, totalQtySold / 14);

  // Base rule based on days remaining
  let baseDiscount = 20;
  if (daysRemaining <= 1) baseDiscount = 60;
  else if (daysRemaining <= 2) baseDiscount = 50;
  else if (daysRemaining <= 3) baseDiscount = 40;
  else if (daysRemaining <= 5) baseDiscount = 25;

  // Velocity modifier: ratio of stock to projected sales before expiry
  const projectedSalesBeforeExpiry = avgDailySales * daysRemaining;
  let modifier = 0;

  if (product.quantity > projectedSalesBeforeExpiry * 1.5) {
    // High stock excess compared to sales -> increase discount to liquidate
    modifier = +10;
  } else if (product.quantity < projectedSalesBeforeExpiry * 0.7) {
    // Low stock compared to demand -> lower discount
    modifier = -10;
  }

  const finalDiscountPercent = Math.min(75, Math.max(10, baseDiscount + modifier));
  const recommendedPrice = Math.round(product.sellingPrice * (1 - finalDiscountPercent / 100));
  const expectedRecovery = Math.round(recommendedPrice * product.quantity);

  const reason = `${finalDiscountPercent}% discount recommended because ${product.quantity} units remain with only ${daysRemaining} day(s) left and daily sales average is ${avgDailySales.toFixed(1)} units/day.`;

  return {
    daysRemaining,
    recommendedDiscountPercent: finalDiscountPercent,
    recommendedPrice,
    expectedRecovery,
    reason,
  };
};
