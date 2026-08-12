import api from "./api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "OWNER" | "STAFF";
  phone?: string;
  shop?: {
    _id: string;
    name: string;
    address: string;
  };
}

export const authService = {
  async register(data: any) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(credentials: any) {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },

  async getProfile() {
    const res = await api.get("/auth/profile");
    return res.data;
  },
};
