import Notification from "../models/Notification.js";
import Product from "../models/Product.js";

export const generateAutomatedNotifications = async (shopId) => {
  const products = await Product.find({ shopId });
  const createdNotifications = [];

  for (const prod of products) {
    if (prod.quantity <= prod.minimumStock) {
      const existing = await Notification.findOne({
        shopId,
        type: "CRITICAL_LOW_STOCK",
        read: false,
        message: { $regex: prod.name },
      });
      if (!existing) {
        const notif = await Notification.create({
          shopId,
          title: "Low Stock Alert",
          message: `${prod.name} stock is low (${prod.quantity} remaining). Reorder recommended.`,
          type: "CRITICAL_LOW_STOCK",
          link: "/inventory",
        });
        createdNotifications.push(notif);
      }
    }

    if (prod.expiryDate) {
      const today = new Date();
      const exp = new Date(prod.expiryDate);
      const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (days > 0 && days <= 5) {
        const existing = await Notification.findOne({
          shopId,
          type: "EXPIRY_WARNING",
          read: false,
          message: { $regex: prod.name },
        });
        if (!existing) {
          const notif = await Notification.create({
            shopId,
            title: "Expiry Approaching",
            message: `${prod.quantity} units of ${prod.name} expire in ${days} days. Review markdown recommendation.`,
            type: "EXPIRY_WARNING",
            link: "/discounts",
          });
          createdNotifications.push(notif);
        }
      }
    }
  }

  return createdNotifications;
};
