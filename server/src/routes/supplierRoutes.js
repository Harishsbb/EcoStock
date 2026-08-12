import express from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierPriceComparison,
} from "../controllers/supplierController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getSuppliers);
router.get("/compare", getSupplierPriceComparison);
router.post("/", authorizeRoles("OWNER"), createSupplier);
router.put("/:id", authorizeRoles("OWNER"), updateSupplier);
router.delete("/:id", authorizeRoles("OWNER"), deleteSupplier);

export default router;
