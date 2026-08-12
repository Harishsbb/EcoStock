import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

export const getReportsSummary = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { startDate, endDate } = req.query;

    const filter = { shopId };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(filter).sort({ createdAt: -1 });
    const transactions = await InventoryTransaction.find(filter).sort({ createdAt: -1 });

    const totalSalesVolume = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactionsCount = sales.length;

    let wasteCost = 0;
    let recoveredRevenue = 0;

    transactions.forEach((tx) => {
      if (tx.type === "WASTE") wasteCost += tx.costValue || 0;
      if (tx.type === "DISCOUNT_SALE" || tx.type === "EXCHANGE") recoveredRevenue += tx.recoveredValue || 0;
    });

    res.json({
      totalSalesVolume,
      totalTransactionsCount,
      wasteCost,
      recoveredRevenue,
      sales: sales.slice(0, 50),
    });
  } catch (error) {
    next(error);
  }
};

export const exportReportCsv = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { type = "sales" } = req.query;

    if (type === "inventory") {
      const products = await Product.find({ shopId });
      let csv = "Name,SKU,Barcode,Category,PurchasePrice,SellingPrice,Quantity,Status,ExpiryDate\n";
      products.forEach((p) => {
        csv += `"${p.name}","${p.sku}","${p.barcode}","${p.category}",${p.purchasePrice},${p.sellingPrice},${p.quantity},"${p.status}","${p.expiryDate ? p.expiryDate.toISOString().split("T")[0] : "N/A"}"\n`;
      });
      res.header("Content-Type", "text/csv");
      res.attachment("smartstock_inventory_report.csv");
      return res.send(csv);
    } else {
      const sales = await Sale.find({ shopId }).sort({ createdAt: -1 });
      let csv = "InvoiceNumber,Date,Subtotal,Discount,Tax,Total,PaymentMethod\n";
      sales.forEach((s) => {
        csv += `"${s.invoiceNumber}","${s.createdAt.toISOString()}",${s.subtotal},${s.discountTotal},${s.taxTotal},${s.total},"${s.paymentMethod}"\n`;
      });
      res.header("Content-Type", "text/csv");
      res.attachment("smartstock_sales_report.csv");
      return res.send(csv);
    }
  } catch (error) {
    next(error);
  }
};
