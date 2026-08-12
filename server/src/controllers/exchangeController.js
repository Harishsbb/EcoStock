import SurplusListing from "../models/SurplusListing.js";
import ExchangeRequest from "../models/ExchangeRequest.js";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

export const getSurplusListings = async (req, res, next) => {
  try {
    const listings = await SurplusListing.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const createSurplusListing = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const {
      productId,
      productName,
      category,
      quantity,
      unit,
      originalPrice,
      surplusPrice,
      expiryDate,
      locationName,
      distanceKm,
      contactPhone,
      imageUrl,
    } = req.body;

    if (!productName || !quantity || !originalPrice || !surplusPrice || !expiryDate) {
      return res.status(400).json({ message: "Please provide all required fields for surplus listing" });
    }

    const listing = await SurplusListing.create({
      shopId,
      shopName: req.user.shop?.name || "Local Partner Store",
      productId: productId || null,
      productName,
      category: category || "General",
      quantity: Number(quantity),
      unit: unit || "units",
      originalPrice: Number(originalPrice),
      surplusPrice: Number(surplusPrice),
      expiryDate: new Date(expiryDate),
      locationName: locationName || "City Commercial Hub",
      distanceKm: Number(distanceKm || (1.5 + Math.random() * 3).toFixed(1)),
      contactPhone: contactPhone || req.user.phone || "9876543210",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
      status: "ACTIVE",
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const submitExchangeRequest = async (req, res, next) => {
  try {
    const requestingShopId = req.user.shopId;
    const { listingId, requestedQuantity, offeredPricePerUnit, message } = req.body;

    const listing = await SurplusListing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Surplus listing not found" });

    if (listing.shopId.toString() === requestingShopId.toString()) {
      return res.status(400).json({ message: "You cannot request your own surplus listing" });
    }

    const qty = Number(requestedQuantity);
    const offerPrice = Number(offeredPricePerUnit);

    const request = await ExchangeRequest.create({
      listingId: listing._id,
      requestingShopId,
      requestingShopName: req.user.shop?.name || "Partner Store",
      requestingPhone: req.user.phone || "9876543210",
      requestedQuantity: qty,
      offeredPricePerUnit: offerPrice,
      totalOfferValue: qty * offerPrice,
      message,
      status: "PENDING",
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getMyListingsAndRequests = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;

    const myListings = await SurplusListing.find({ shopId }).sort({ createdAt: -1 });

    const listingIds = myListings.map((l) => l._id);
    const requestsReceived = await ExchangeRequest.find({ listingId: { $in: listingIds } })
      .populate("listingId")
      .sort({ createdAt: -1 });

    const requestsSent = await ExchangeRequest.find({ requestingShopId: shopId })
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.json({
      myListings,
      requestsReceived,
      requestsSent,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToExchangeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "APPROVE" or "REJECT"

    const request = await ExchangeRequest.findById(id).populate("listingId");
    if (!request) return res.status(404).json({ message: "Exchange request not found" });

    const listing = request.listingId;
    if (listing.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({ message: "Not authorized to manage this request" });
    }

    if (action === "APPROVE") {
      request.status = "APPROVED";
      listing.quantity -= request.requestedQuantity;
      if (listing.quantity <= 0) {
        listing.status = "COMPLETED";
      }
      await listing.save();

      // If product exists in shop inventory, deduct stock
      if (listing.productId) {
        const prod = await Product.findById(listing.productId);
        if (prod) {
          prod.quantity = Math.max(0, prod.quantity - request.requestedQuantity);
          await prod.save();
        }
      }

      // Record inventory transaction
      await InventoryTransaction.create({
        shopId: listing.shopId,
        productId: listing.productId || null,
        productName: listing.productName,
        type: "EXCHANGE",
        quantity: request.requestedQuantity,
        costValue: listing.originalPrice * request.requestedQuantity,
        recoveredValue: request.totalOfferValue,
        reason: `Surplus stock exchanged with ${request.requestingShopName}`,
        createdBy: req.user._id,
      });
    } else {
      request.status = "REJECTED";
    }

    await request.save();
    res.json(request);
  } catch (error) {
    next(error);
  }
};
