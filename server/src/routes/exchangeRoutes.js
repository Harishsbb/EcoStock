import express from "express";
import {
  getSurplusListings,
  createSurplusListing,
  submitExchangeRequest,
  getMyListingsAndRequests,
  respondToExchangeRequest,
} from "../controllers/exchangeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/listings", getSurplusListings);
router.post("/listings", authorizeRoles("OWNER"), createSurplusListing);
router.post("/request", submitExchangeRequest);
router.get("/my-dashboard", getMyListingsAndRequests);
router.put("/request/:id/respond", authorizeRoles("OWNER"), respondToExchangeRequest);

export default router;
