import React, { useState, useEffect } from "react";
import { dealsService } from "../services/dealsService";
import { Tag, MapPin, Phone, Clock, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Tag className="w-3.5 h-3.5" /> Customer Dynamic Deals Hub
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Local Fresh Deals</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Discover steep markdown discounts on near-expiry fresh produce & goods from verified neighbourhood retail stores.
          </p>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Deal Categories</option>
          <option value="Dairy & Milk">Dairy & Milk</option>
          <option value="Bakery & Bread">Bakery & Bread</option>
          <option value="Fresh Produce">Fresh Produce</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-3">Loading active deal feeds...</p>
        ) : filteredDeals.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center text-slate-500 col-span-3 shadow-2xs space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800">No active local deals found in this category.</p>
            <p className="text-xs text-slate-400">Check back soon as store algorithms update pricing!</p>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <motion.div
              key={deal._id}
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3">
                  <img
                    src={deal.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
                    alt={deal.productName}
                    className="w-full h-44 rounded-2xl object-cover border border-slate-200 bg-slate-50"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md">
                    {deal.discountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {deal.category}
                  </span>
                  <span className="text-xs text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3 h-3" /> {deal.daysRemaining} days left
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 leading-tight">
                  {deal.productName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {deal.shopName} ({deal.shopAddress})
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">Special Deal Price</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700">₹{deal.discountedPrice}</span>
                    <span className="text-xs line-through text-slate-400 ml-2">₹{deal.originalPrice}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${deal.shopPhone}`}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" /> Reserve / Call {deal.shopName}
              </a>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
