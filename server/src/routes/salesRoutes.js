import express from "express";
import { createSale, getSalesHistory, getSalesAnalytics } from "../controllers/salesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSale);
router.get("/history", getSalesHistory);
router.get("/analytics", getSalesAnalytics);

export default router;
