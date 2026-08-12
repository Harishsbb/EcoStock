import React, { useState, useEffect } from "react";
import { dealsService } from "../services/dealsService";
import { Tag, MapPin, Phone, Clock } from "lucide-react";

export const CustomerDealsFeedPage: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    dealsService.getDealsFeed().then((data) => {
      setDeals(data || []);
      setLoading(false);
    });
  }, []);

  const filteredDeals = deals.filter((d) => category === "ALL" || d.category === category);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <Tag className="w-3.5 h-3.5" /> Customer Smart Deals Marketplace
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Today's Local Fresh Deals</h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover steep discounts on near-expiry fresh groceries and goods from verified neighbourhood stores.
          </p>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Categories</option>
          <option value="Dairy & Milk">Dairy & Milk</option>
          <option value="Bakery & Bread">Bakery & Bread</option>
          <option value="Fresh Produce">Fresh Produce</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-500 col-span-3">Loading deal listings...</p>
        ) : filteredDeals.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 col-span-3">
            No active deals right now in this category. Check back soon!
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <div
              key={deal._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="relative mb-3">
                  <img
                    src={deal.imageUrl}
                    alt={deal.productName}
                    className="w-full h-40 rounded-2xl object-cover border border-slate-800 bg-slate-950"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-lg">
                    {deal.discountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {deal.category}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {deal.daysRemaining} days left
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors">
                  {deal.productName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {deal.shopName} ({deal.shopAddress})
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Special Deal Price</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">₹{deal.discountedPrice}</span>
                    <span className="text-xs line-through text-slate-500 ml-2">₹{deal.originalPrice}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${deal.shopPhone}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" /> Reserve / Call {deal.shopName}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
