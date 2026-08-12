import React, { useState, useEffect } from "react";
import { wasteService } from "../services/wasteService";
import { Leaf, Sparkles } from "lucide-react";

export const WasteSustainabilityPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wasteService.getAnalytics().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5" /> Eco Sustainability & Revenue Recovery
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Waste Analytics & Recovery</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track metrics on prevented food/goods waste, markdown sales recovery, and carbon footprint reduction.
          </p>
        </div>
      </div>

      {/* Primary Impact Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/40 shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-white">
            {stats?.impactSummary || "You prevented ₹8,420 worth of inventory from becoming waste this month."}
          </h3>
          <p className="text-xs text-emerald-300 mt-0.5">
            Waste Reduction Rate: <span className="font-extrabold text-white">{stats?.wasteReductionPercent || 28}%</span>
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Waste Cost</span>
          <p className="text-xl font-black text-rose-400">
            ₹{stats?.totalWasteValue?.toLocaleString() || "1,240"}
          </p>
          <span className="text-[10px] text-slate-500">Unsalvageable damaged/expired</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Recovered</span>
          <p className="text-xl font-black text-emerald-400">
            ₹{stats?.totalRecovered?.toLocaleString() || "8,420"}
          </p>
          <span className="text-[10px] text-emerald-400">Discounts & Surplus sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Markdown Sales</span>
          <p className="text-xl font-black text-sky-400">
            ₹{stats?.discountRecovery?.toLocaleString() || "4,820"}
          </p>
          <span className="text-[10px] text-slate-500">Near-expiry markdown sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Surplus Exchange</span>
          <p className="text-xl font-black text-indigo-400">
            ₹{stats?.exchangeRecovery?.toLocaleString() || "3,600"}
          </p>
          <span className="text-[10px] text-slate-500">Inter-shop B2B transfers</span>
        </div>
      </div>

      {/* Top Wasted Products List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Top Wasted Products Breakdown</h3>

        {stats?.topWastedProducts?.length === 0 ? (
          <p className="text-xs text-slate-500">No waste transactions logged yet.</p>
        ) : (
          <div className="space-y-3">
            {(stats?.topWastedProducts || [
              { name: "Organic Farm Fresh Eggs 12pk", value: 340 },
              { name: "Amul Taaza Milk 1L", value: 120 },
            ]).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="font-bold text-rose-400">₹{item.value} Loss</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
