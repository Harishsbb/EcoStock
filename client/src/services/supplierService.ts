import api from "./api";

export interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  productsHandled?: string[];
  deliveryDays?: number;
  rating?: number;
}

export const supplierService = {
  async getSuppliers() {
    const res = await api.get("/suppliers");
    return res.data;
  },

  async createSupplier(data: Partial<Supplier>) {
    const res = await api.post("/suppliers", data);
    return res.data;
  },

  async updateSupplier(id: string, data: Partial<Supplier>) {
    const res = await api.put(`/suppliers/${id}`, data);
    return res.data;
  },

  async deleteSupplier(id: string) {
    const res = await api.delete(`/suppliers/${id}`);
    return res.data;
  },

  async getPriceComparison() {
    const res = await api.get("/suppliers/compare");
    return res.data;
  },
};
