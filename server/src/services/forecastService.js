import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

export const getDemandForecastForShop = async (shopId) => {
  const products = await Product.find({ shopId });
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const forecastResults = [];

  for (const prod of products) {
    const salesData = await Sale.aggregate([
      { $match: { shopId: prod.shopId, createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: "$items" },
      { $match: { "items.productId": prod._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyQty: { $sum: "$items.quantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalQty = salesData.reduce((sum, item) => sum + item.dailyQty, 0);
    const avgDailySales = Math.max(0.2, Number((totalQty / 30).toFixed(1)));
    const estimatedStockoutDays = Math.max(0, Math.round((prod.quantity / avgDailySales) * 10) / 10);
    const recommendedReorder = Math.max(0, Math.ceil(avgDailySales * 14 - prod.quantity + prod.minimumStock));
    const confidence = salesData.length > 10 ? "High" : salesData.length > 3 ? "Medium" : "Low";

    forecastResults.push({
      productId: prod._id,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      currentStock: prod.quantity,
      avgDailySales,
      estimatedStockoutDays,
      recommendedReorder,
      confidence,
      historicalSales: salesData,
    });
  }

  return forecastResults;
};
