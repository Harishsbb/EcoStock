import React, { useState, useEffect } from "react";
import { exchangeService, type SurplusListingItem } from "../services/exchangeService";
import { Store, Plus, MapPin, ArrowRight } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

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
    locationName: "Connaught Place Hub",
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" /> Inter-Shop B2B Surplus Exchange Network
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Surplus B2B Marketplace</h2>
          <p className="text-xs text-slate-400 mt-1">
            Exchange near-expiry excess inventory with nearby retail shops at wholesale discount rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> List Surplus Stock
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "marketplace"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Active Nearby Offers ({listings.length})
        </button>
        {isOwner && (
          <button
            onClick={() => setActiveTab("my-exchange")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "my-exchange"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            My B2B Dashboard
          </button>
        )}
      </div>

      {/* Tab 1: Marketplace */}
      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-xs text-slate-500 col-span-3">Loading surplus offers...</p>
          ) : listings.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 col-span-3">
              No active surplus listings nearby. Click List Surplus Stock to create the first listing.
            </div>
          ) : (
            listings.map((item) => (
              <div
                key={item._id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.distanceKm} km away
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Sold by: {item.shopName}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Available Qty</span>
                      <p className="font-bold text-white">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Surplus Price</span>
                      <p className="font-black text-emerald-400">
                        ₹{item.surplusPrice}{" "}
                        <span className="text-[10px] line-through text-slate-500">₹{item.originalPrice}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-amber-400 font-semibold">
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestExchange(item)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 flex items-center justify-center gap-2"
                >
                  <span>Request B2B Stock Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: My B2B Dashboard */}
      {activeTab === "my-exchange" && (
        <div className="space-y-6">
          {/* Incoming Requests */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Incoming Buyer Requests</h3>
            {dashboardData?.incomingRequests?.length === 0 ? (
              <p className="text-xs text-slate-500">No pending incoming buyer requests.</p>
            ) : (
              dashboardData?.incomingRequests?.map((req: any) => (
                <div key={req._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{req.buyerShopName} requested {req.requestedQty} units</p>
                    <p className="text-slate-400">Item: {req.listingId?.productName} | Total Offer: ₹{req.offerPrice}</p>
                  </div>
                  {req.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespondRequest(req._id, "APPROVE")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, "REJECT")}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-rose-400 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-emerald-400">{req.status}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="List Surplus Stock for Nearby Shops">
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g. Whole Wheat Bread Packs"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
              >
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Dairy & Milk">Dairy & Milk</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Beverages">Beverages</option>
                <option value="Packaged Snacks">Packaged Snacks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Original Price (₹)</label>
              <input
                type="number"
                required
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Surplus Price (₹)</label>
              <input
                type="number"
                required
                value={formData.surplusPrice}
                onChange={(e) => setFormData({ ...formData, surplusPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Publish Surplus Listing
          </button>
        </form>
      </Modal>
    </div>
  );
};
