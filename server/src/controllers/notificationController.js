import Notification from "../models/Notification.js";
import { generateAutomatedNotifications } from "../services/notificationService.js";

export const getNotifications = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    await generateAutomatedNotifications(shopId);

    const notifications = await Notification.find({ shopId }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ shopId, read: false });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, shopId },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    await Notification.updateMany({ shopId, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
