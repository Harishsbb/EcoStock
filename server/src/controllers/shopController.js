import Shop from "../models/Shop.js";

export const getShopProfile = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.user.shopId).populate("ownerId", "name email phone");
    if (!shop) return res.status(404).json({ message: "Shop profile not found" });
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

export const updateShopProfile = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.user.shopId, req.body, { new: true });
    res.json(shop);
  } catch (error) {
    next(error);
  }
};
