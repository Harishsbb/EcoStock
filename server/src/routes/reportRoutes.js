import express from "express";
import { getReportsSummary, exportReportCsv } from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/summary", authorizeRoles("OWNER"), getReportsSummary);
router.get("/export", authorizeRoles("OWNER"), exportReportCsv);

export default router;
