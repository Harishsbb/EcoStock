import api from "./api";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: "CRITICAL_LOW_STOCK" | "EXPIRY_WARNING" | "REVENUE_RECOVERED" | "PRICE_DROP" | "SURPLUS_OFFER";
  read: boolean;
  link?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications() {
    const res = await api.get("/notifications");
    return res.data;
  },

  async markAsRead(id: string) {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.put("/notifications/read-all");
    return res.data;
  },
};
