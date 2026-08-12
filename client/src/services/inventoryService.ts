import api from "./api";

export const inventoryService = {
  async getSummary() {
    const res = await api.get("/inventory/summary");
    return res.data;
  },

  async adjustStock(data: { productId: string; quantityChange: number; type?: string; reason?: string }) {
    const res = await api.post("/inventory/adjust", data);
    return res.data;
  },
};
