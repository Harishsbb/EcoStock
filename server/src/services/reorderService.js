import Product from "../models/Product.js";
import Supplier, { SupplierPriceHistory } from "../models/Supplier.js";

export const getReorderRecommendations = async (shopId) => {
  const lowStockProducts = await Product.find({
    shopId,
    $expr: { $lte: ["$quantity", "$minimumStock"] },
  }).populate("supplierId");

  const suppliers = await Supplier.find({ shopId });
  const recommendations = [];

  for (const prod of lowStockProducts) {
    const priceHistories = await SupplierPriceHistory.find({
      shopId,
      productName: { $regex: new RegExp(prod.name, "i") },
    }).populate("supplierId");

    const supplierOffers = suppliers.map((sup) => {
      const matchHistory = priceHistories.find((ph) => ph.supplierId._id.toString() === sup._id.toString());
      const price = matchHistory ? matchHistory.unitPrice : Math.round(prod.purchasePrice * (0.9 + Math.random() * 0.2));
      return {
        supplierId: sup._id,
        supplierName: sup.name,
        unitPrice: price,
        deliveryDays: sup.deliveryDays,
        rating: sup.rating,
        isRecommended: false,
      };
    });

    // Sort by price ascending
    supplierOffers.sort((a, b) => a.unitPrice - b.unitPrice);
    if (supplierOffers.length > 0) {
      supplierOffers[0].isRecommended = true;
    }

    const recommendedOrderQty = Math.max(30, prod.minimumStock * 3 - prod.quantity);

    recommendations.push({
      product: {
        _id: prod._id,
        name: prod.name,
        sku: prod.sku,
        quantity: prod.quantity,
        minimumStock: prod.minimumStock,
        purchasePrice: prod.purchasePrice,
      },
      recommendedOrderQty,
      bestSupplier: supplierOffers[0] || null,
      supplierOffers,
    });
  }

  return recommendations;
};
