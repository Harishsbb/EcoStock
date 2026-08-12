import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { evaluateProductExpiry } from "../services/expiryService.js";

export const getProducts = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { search, category, status, sortBy = "name", order = "asc", page = 1, limit = 50 } = req.query;

    const query = { shopId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "ALL") {
      query.category = category;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    const sortOption = {};
    sortOption[sortBy] = order === "desc" ? -1 : 1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("supplierId", "name contactPerson phone")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByBarcode = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { barcode } = req.params;

    const product = await Product.findOne({ shopId, barcode }).populate("supplierId", "name phone");
    if (!product) {
      return res.status(404).json({ message: `No product found with barcode ${barcode}` });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.shopId }).populate("supplierId");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const {
      name,
      sku,
      barcode,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
      minimumStock,
      expiryDate,
      supplierId,
      imageUrl,
    } = req.body;

    if (!name || !sku || !barcode || !category || purchasePrice == null || sellingPrice == null) {
      return res.status(400).json({ message: "Please provide all required product details" });
    }

    const existingSku = await Product.findOne({ shopId, sku });
    if (existingSku) return res.status(400).json({ message: "Product with this SKU already exists" });

    const existingBarcode = await Product.findOne({ shopId, barcode });
    if (existingBarcode) return res.status(400).json({ message: "Product with this barcode already exists" });

    const status = evaluateProductExpiry(expiryDate, quantity || 0, minimumStock || 10);

    const product = await Product.create({
      name,
      sku,
      barcode,
      category,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity || 0),
      minimumStock: Number(minimumStock || 10),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      supplierId: supplierId || null,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
      shopId,
      status,
    });

    // Ensure category exists in Category collection
    await Category.updateOne(
      { shopId, name: category },
      { $setOnInsert: { name: category, shopId } },
      { upsert: true }
    );

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const product = await Product.findOne({ _id: req.params.id, shopId });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      sku,
      barcode,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
      minimumStock,
      expiryDate,
      supplierId,
      imageUrl,
    } = req.body;

    if (name) product.name = name;
    if (sku) product.sku = sku;
    if (barcode) product.barcode = barcode;
    if (category) product.category = category;
    if (purchasePrice != null) product.purchasePrice = Number(purchasePrice);
    if (sellingPrice != null) product.sellingPrice = Number(sellingPrice);
    if (quantity != null) product.quantity = Number(quantity);
    if (minimumStock != null) product.minimumStock = Number(minimumStock);
    if (expiryDate !== undefined) product.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (supplierId !== undefined) product.supplierId = supplierId || null;
    if (imageUrl) product.imageUrl = imageUrl;

    product.status = evaluateProductExpiry(product.expiryDate, product.quantity, product.minimumStock);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully", id: req.params.id });
  } catch (error) {
    next(error);
  }
};
