import express from "express";
import { getWasteStats, recordWaste } from "../controllers/wasteController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/analytics", getWasteStats);
router.post("/record", authorizeRoles("OWNER", "STAFF"), recordWaste);

export default router;
