import Product from "../models/Product.js";

export const evaluateProductExpiry = (expiryDate, quantity, minimumStock) => {
  if (!expiryDate) {
    if (quantity <= 5) return "Critical";
    if (quantity <= minimumStock) return "Low Stock";
    return "Healthy";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Expired";
  if (diffDays <= 7) return "Near Expiry";
  if (quantity <= 5) return "Critical";
  if (quantity <= minimumStock) return "Low Stock";
  return "Healthy";
};

export const updateAllProductStatuses = async (shopId) => {
  const products = await Product.find({ shopId });
  for (const prod of products) {
    const newStatus = evaluateProductExpiry(prod.expiryDate, prod.quantity, prod.minimumStock);
    if (prod.status !== newStatus) {
      prod.status = newStatus;
      await prod.save();
    }
  }
};
