import express from "express";
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getProducts);
router.get("/barcode/:barcode", getProductByBarcode);
router.get("/:id", getProductById);
router.post("/", authorizeRoles("OWNER", "STAFF"), createProduct);
router.put("/:id", authorizeRoles("OWNER", "STAFF"), updateProduct);
router.delete("/:id", authorizeRoles("OWNER"), deleteProduct);

export default router;
