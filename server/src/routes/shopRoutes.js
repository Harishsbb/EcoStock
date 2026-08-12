import express from "express";
import { getShopProfile, updateShopProfile } from "../controllers/shopController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getShopProfile);
router.put("/profile", authorizeRoles("OWNER"), updateShopProfile);

export default router;
