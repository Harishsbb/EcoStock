import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import { evaluateProductExpiry } from "../services/expiryService.js";

export const createSale = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { items, subtotal, discountTotal, taxTotal, total, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Sale must contain at least one item" });
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, shopId });
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      product.status = evaluateProductExpiry(product.expiryDate, product.quantity, product.minimumStock);
      await product.save();

      // Log inventory transaction
      const isDiscounted = item.discountAmount > 0;
      await InventoryTransaction.create({
        shopId,
        productId: product._id,
        productName: product.name,
        type: isDiscounted ? "DISCOUNT_SALE" : "SALE",
        quantity: item.quantity,
        costValue: product.purchasePrice * item.quantity,
        recoveredValue: item.total,
        reason: isDiscounted ? "Sold via Near-Expiry Smart Discount" : "Regular POS Sale",
        createdBy: req.user._id,
      });

      processedItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: item.price,
        discountAmount: item.discountAmount || 0,
        total: item.total,
        isNearExpiry: isDiscounted,
      });
    }

    const sale = await Sale.create({
      shopId,
      invoiceNumber,
      items: processedItems,
      subtotal: subtotal || total,
      discountTotal: discountTotal || 0,
      taxTotal: taxTotal || 0,
      total,
      paymentMethod: paymentMethod || "CASH",
      soldBy: req.user._id,
    });

    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

export const getSalesHistory = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { page = 1, limit = 20 } = req.query;

    const total = await Sale.countDocuments({ shopId });
    const sales = await Sale.find({ shopId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("soldBy", "name email");

    res.json({
      sales,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesAnalytics = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySalesData = await Sale.aggregate([
      { $match: { shopId, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, totalSales: { $sum: "$total" }, count: { $sum: 1 } } },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrend = await Sale.aggregate([
      { $match: { shopId, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      todaySales: todaySalesData[0]?.totalSales || 0,
      todayTransactions: todaySalesData[0]?.count || 0,
      dailyTrend,
    });
  } catch (error) {
    next(error);
  }
};
