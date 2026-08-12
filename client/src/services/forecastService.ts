import api from "./api";

export const forecastService = {
  async getForecast() {
    const res = await api.get("/forecast");
    return res.data;
  },

  async getReorders() {
    const res = await api.get("/forecast/reorders");
    return res.data;
  },
};
