import api from "./api";

export interface DiscountRecommendation {
  _id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  currentStock: number;
  daysRemaining: number;
  recommendedDiscountPercent: number;
  recommendedPrice: number;
  expectedRecovery: number;
  reason: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CUSTOMIZED";
  appliedDiscountPercent?: number;
}

export const discountService = {
  async getRecommendations() {
    const res = await api.get("/discounts/recommendations");
    return res.data;
  },

  async updateStatus(id: string, status: string, customDiscountPercent?: number) {
    const res = await api.put(`/discounts/${id}/status`, { status, customDiscountPercent });
    return res.data;
  },
};
