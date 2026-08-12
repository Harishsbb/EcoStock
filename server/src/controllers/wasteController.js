import { getWasteAnalytics } from "../services/wasteAnalyticsService.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import Product from "../models/Product.js";

export const getWasteStats = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const stats = await getWasteAnalytics(shopId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const recordWaste = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { productId, quantity, reason } = req.body;

    const product = await Product.findOne({ _id: productId, shopId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const qtyToDeduct = Math.min(product.quantity, Number(quantity));
    product.quantity -= qtyToDeduct;
    await product.save();

    const tx = await InventoryTransaction.create({
      shopId,
      productId: product._id,
      productName: product.name,
      type: "WASTE",
      quantity: qtyToDeduct,
      costValue: product.purchasePrice * qtyToDeduct,
      recoveredValue: 0,
      reason: reason || "Expired / Damaged Inventory Wasted",
      createdBy: req.user._id,
    });

    res.status(201).json(tx);
  } catch (error) {
    next(error);
  }
};
