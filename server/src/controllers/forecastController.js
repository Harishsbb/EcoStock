import { getDemandForecastForShop } from "../services/forecastService.js";
import { getReorderRecommendations } from "../services/reorderService.js";

export const getForecastData = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const forecast = await getDemandForecastForShop(shopId);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
};

export const getReorderData = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const reorders = await getReorderRecommendations(shopId);
    res.json(reorders);
  } catch (error) {
    next(error);
  }
};
