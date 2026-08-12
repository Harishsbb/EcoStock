import express from "express";
import { getDiscountRecommendations, updateDiscountStatus } from "../controllers/discountController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/recommendations", getDiscountRecommendations);
router.put("/:id/status", authorizeRoles("OWNER"), updateDiscountStatus);

export default router;
