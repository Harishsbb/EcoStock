import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import Sale from "../models/Sale.js";
import { evaluateProductExpiry } from "../services/expiryService.js";

export const getInventoryDashboardSummary = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const products = await Product.find({ shopId });

    const totalProducts = products.length;
    let totalStockValue = 0;
    let lowStockCount = 0;
    let expiringSoonCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    products.forEach((p) => {
      totalStockValue += p.purchasePrice * p.quantity;
      if (p.quantity <= p.minimumStock) lowStockCount++;
      if (p.expiryDate) {
        const exp = new Date(p.expiryDate);
        exp.setHours(0, 0, 0, 0);
        const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (days >= 0 && days <= 7) expiringSoonCount++;
      }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySalesData = await Sale.aggregate([
      { $match: { shopId, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const todaySales = todaySalesData[0]?.total || 0;

    // Recovered revenue from discounted / exchange transactions
    const recoveredData = await InventoryTransaction.aggregate([
      { $match: { shopId, type: { $in: ["DISCOUNT_SALE", "EXCHANGE"] } } },
      { $group: { _id: null, total: { $sum: "$recoveredValue" } } },
    ]);

    const recoveredRevenue = recoveredData[0]?.total || 0;

    res.json({
      totalProducts,
      totalStockValue,
      todaySales,
      lowStockCount,
      expiringSoonCount,
      recoveredRevenue,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { productId, quantityChange, type = "RESTOCK", reason } = req.body;

    const product = await Product.findOne({ _id: productId, shopId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity = Math.max(0, product.quantity + Number(quantityChange));
    product.status = evaluateProductExpiry(product.expiryDate, product.quantity, product.minimumStock);
    await product.save();

    const tx = await InventoryTransaction.create({
      shopId,
      productId: product._id,
      productName: product.name,
      type,
      quantity: Math.abs(Number(quantityChange)),
      costValue: product.purchasePrice * Math.abs(Number(quantityChange)),
      reason: reason || `Manual Stock Adjustment (${type})`,
      createdBy: req.user._id,
    });

    res.json({ product, transaction: tx });
  } catch (error) {
    next(error);
  }
};
