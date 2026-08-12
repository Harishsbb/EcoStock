import express from "express";
import { getInventoryDashboardSummary, adjustStock } from "../controllers/inventoryController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getInventoryDashboardSummary);
router.post("/adjust", authorizeRoles("OWNER", "STAFF"), adjustStock);

export default router;
