import api from "./api";

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discountAmount?: number;
  total: number;
}

export interface SalePayload {
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "UPI" | "OTHER";
}

export const salesService = {
  async createSale(data: SalePayload) {
    const res = await api.post("/sales", data);
    return res.data;
  },

  async getHistory(page = 1) {
    const res = await api.get("/sales/history", { params: { page } });
    return res.data;
  },

  async getAnalytics() {
    const res = await api.get("/sales/analytics");
    return res.data;
  },
};
