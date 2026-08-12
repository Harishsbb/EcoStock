import api from "./api";

export const dealsService = {
  async getDealsFeed() {
    const res = await api.get("/deals/feed");
    return res.data;
  },
};
