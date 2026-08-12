import React, { useState, useEffect } from "react";
import { exchangeService, type SurplusListingItem } from "../services/exchangeService";
import { Store, Plus, MapPin, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export const SurplusExchangePage: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const [listings, setListings] = useState<SurplusListingItem[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"marketplace" | "my-exchange">("marketplace");

  // Create Listing Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    category: "Bakery & Bread",
    quantity: 20,
    unit: "packs",
    originalPrice: 40,
    surplusPrice: 20,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    locationName: "Local Retail Hub",
    distanceKm: 1.5,
    contactPhone: user?.phone || "+91 98765 43210",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [list, dash] = await Promise.all([
        exchangeService.getListings(),
        exchangeService.getMyDashboard(),
      ]);
      setListings(list || []);
      setDashboardData(dash || null);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await exchangeService.createListing(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post surplus listing");
    }
  };

  const handleRequestExchange = async (listing: SurplusListingItem) => {
    const qtyStr = prompt(`Enter quantity to request from ${listing.shopName} (Max ${listing.quantity}):`, "10");
    if (!qtyStr) return;
    const requestedQty = parseInt(qtyStr, 10);
    if (isNaN(requestedQty) || requestedQty <= 0 || requestedQty > listing.quantity) {
      alert("Invalid quantity requested.");
      return;
    }

    try {
      await exchangeService.requestExchange({
        listingId: listing._id,
        requestedQty,
        offerPrice: listing.surplusPrice * requestedQty,
      });
      alert("Exchange Request sent! The selling shop owner will review your offer.");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send exchange request");
    }
  };

  const handleRespondRequest = async (requestId: string, action: "APPROVE" | "REJECT") => {
    try {
      await exchangeService.respondRequest(requestId, action);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to process request");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" /> B2B Inter-Shop Surplus Network
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Surplus B2B Marketplace</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Trade near-expiry excess inventory with verified local retail partners at wholesale discount prices. Prevent food waste & liquidate cash flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> List Surplus Stock
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === "marketplace"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Active Nearby Offers ({listings.length})
        </button>
        {isOwner && (
          <button
            onClick={() => setActiveTab("my-exchange")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === "my-exchange"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            My Trade Dashboard
          </button>
        )}
      </div>

      {/* Tab 1: Marketplace */}
      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-xs text-slate-400 col-span-3">Loading nearby B2B surplus offers...</p>
          ) : listings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center text-slate-500 col-span-3 shadow-2xs space-y-2">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">No active surplus listings nearby right now.</p>
              <p className="text-xs text-slate-400">Be the first store to post surplus inventory to the local network!</p>
            </div>
          ) : (
            listings.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -3 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                    <span className="text-xs text-indigo-700 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.distanceKm} km away
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 leading-snug">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Seller: {item.shopName}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Qty</span>
                      <p className="font-extrabold text-slate-900">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Surplus Price</span>
                      <p className="font-black text-emerald-700">
                        ₹{item.surplusPrice}{" "}
                        <span className="text-[10px] line-through text-slate-400">₹{item.originalPrice}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-block">
                    Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestExchange(item)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request B2B Stock Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: My B2B Dashboard */}
      {activeTab === "my-exchange" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Incoming Buyer Requests</h3>
            {dashboardData?.incomingRequests?.length === 0 ? (
              <p className="text-xs text-slate-400">No pending incoming buyer requests.</p>
            ) : (
              dashboardData?.incomingRequests?.map((req: any) => (
                <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{req.buyerShopName} requested {req.requestedQty} units</p>
                    <p className="text-slate-500">Item: {req.listingId?.productName} | Offer Total: ₹{req.offerPrice}</p>
                  </div>
                  {req.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespondRequest(req._id, "APPROVE")}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs"
                      >
                        Approve Offer
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, "REJECT")}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-rose-700 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">{req.status}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="List Surplus Stock for Nearby Stores">
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Product Name</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g. Whole Wheat Bread Packs 400g"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
              >
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Dairy & Milk">Dairy & Milk</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Beverages">Beverages</option>
                <option value="Packaged Snacks">Packaged Snacks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Original Price (₹)</label>
              <input
                type="number"
                required
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Surplus B2B Price (₹)</label>
              <input
                type="number"
                required
                value={formData.surplusPrice}
                onChange={(e) => setFormData({ ...formData, surplusPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Expiry Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Publish Surplus Listing
          </button>
        </form>
      </Modal>
    </div>
  );
};
