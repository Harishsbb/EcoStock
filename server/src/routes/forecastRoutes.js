import express from "express";
import { getForecastData, getReorderData } from "../controllers/forecastController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getForecastData);
router.get("/reorders", getReorderData);

export default router;
