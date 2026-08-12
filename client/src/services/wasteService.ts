import api from "./api";

export const wasteService = {
  async getAnalytics() {
    const res = await api.get("/waste/analytics");
    return res.data;
  },

  async recordWaste(data: { productId: string; quantity: number; reason?: string }) {
    const res = await api.post("/waste/record", data);
    return res.data;
  },
};
