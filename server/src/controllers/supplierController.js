import Supplier, { SupplierPriceHistory } from "../models/Supplier.js";

export const getSuppliers = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const suppliers = await Supplier.find({ shopId }).sort({ name: 1 });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { name, contactPerson, email, phone, address, productsHandled, deliveryDays, rating } = req.body;

    if (!name) return res.status(400).json({ message: "Supplier name is required" });

    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address,
      productsHandled: Array.isArray(productsHandled)
        ? productsHandled
        : (productsHandled || "").split(",").map((s) => s.trim()).filter(Boolean),
      deliveryDays: Number(deliveryDays || 2),
      rating: Number(rating || 4.5),
      shopId,
    });

    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const supplier = await Supplier.findOneAndUpdate({ _id: req.params.id, shopId }, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    next(error);
  }
};

export const getSupplierPriceComparison = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const priceHistories = await SupplierPriceHistory.find({ shopId }).populate("supplierId", "name phone deliveryDays rating");
    res.json(priceHistories);
  } catch (error) {
    next(error);
  }
};
