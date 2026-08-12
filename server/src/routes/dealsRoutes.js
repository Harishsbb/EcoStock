import express from "express";
import { getPublicDeals } from "../controllers/dealsController.js";

const router = express.Router();

// Public customer deals feed (no auth required)
router.get("/feed", getPublicDeals);

export default router;
