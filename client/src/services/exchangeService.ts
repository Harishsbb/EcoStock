import api from "./api";

export interface SurplusListingItem {
  _id: string;
  shopName: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  originalPrice: number;
  surplusPrice: number;
  expiryDate: string;
  locationName: string;
  distanceKm: number;
  contactPhone: string;
  status: "ACTIVE" | "RESERVED" | "COMPLETED" | "CANCELLED";
  imageUrl?: string;
}

export const exchangeService = {
  async getListings() {
    const res = await api.get("/exchange/listings");
    return res.data;
  },

  async createListing(data: any) {
    const res = await api.post("/exchange/listings", data);
    return res.data;
  },

  async requestExchange(data: any) {
    const res = await api.post("/exchange/request", data);
    return res.data;
  },

  async getMyDashboard() {
    const res = await api.get("/exchange/my-dashboard");
    return res.data;
  },

  async respondRequest(id: string, action: "APPROVE" | "REJECT") {
    const res = await api.put(`/exchange/request/${id}/respond`, { action });
    return res.data;
  },
};
