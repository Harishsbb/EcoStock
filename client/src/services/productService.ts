import api from "./api";

export interface Product {
  _id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minimumStock: number;
  expiryDate?: string;
  supplierId?: any;
  imageUrl?: string;
  status: "Healthy" | "Low Stock" | "Critical" | "Near Expiry" | "Expired";
}

export const productService = {
  async getProducts(params?: any) {
    const res = await api.get("/products", { params });
    return res.data;
  },

  async getProductByBarcode(barcode: string) {
    const res = await api.get(`/products/barcode/${barcode}`);
    return res.data;
  },

  async getProductById(id: string) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(data: Partial<Product>) {
    const res = await api.post("/products", data);
    return res.data;
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
