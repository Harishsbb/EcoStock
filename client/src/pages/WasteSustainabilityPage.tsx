import React, { useState, useEffect } from "react";
import { wasteService } from "../services/wasteService";
import { Leaf, Sparkles, TrendingUp, ShieldCheck, Award, BarChart3, Recycle } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5" /> Environmental Impact & Revenue Salvage
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Waste Analytics & Recovery Command</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            EcoStock's primary differentiator: divert food and retail waste, calculate carbon footprint reduction, and salvage write-off revenue.
          </p>
        </div>

        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-4 rounded-2xl min-w-[200px] text-center shadow-md shadow-emerald-500/20">
          <span className="text-[10px] uppercase font-extrabold tracking-wider block opacity-90">Prevented Waste Rate</span>
          <span className="text-3xl font-black">{stats?.wasteReductionPercent || 28.4}%</span>
        </div>
      </div>

      {/* Primary Impact Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <Recycle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Monthly Impact Summary</span>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mt-0.5">
              {stats?.impactSummary || "You prevented ₹8,420 worth of inventory from becoming waste this month."}
            </h3>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
              <span>🌱 142 kg Food Waste Diverted</span> • <span>💨 380 kg CO2 Offset</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-2xs self-start md:self-auto">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-black text-slate-800">Gold Eco Tier Certified</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Unsalvageable Waste Loss</span>
          <p className="text-2xl font-black text-rose-600">
            ₹{stats?.totalWasteValue?.toLocaleString() || "1,240"}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Damaged or expired inventory</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Recovered Revenue</span>
          <p className="text-2xl font-black text-emerald-600">
            ₹{stats?.totalRecovered?.toLocaleString() || "8,420"}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">From AI Markdowns & Surplus</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">AI Markdown Sales</span>
          <p className="text-2xl font-black text-sky-600">
            ₹{stats?.discountRecovery?.toLocaleString() || "4,820"}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Direct consumer discounts</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">B2B Surplus Exchange</span>
          <p className="text-2xl font-black text-indigo-600">
            ₹{stats?.exchangeRecovery?.toLocaleString() || "3,600"}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Inter-store partner sales</span>
        </motion.div>
      </div>

      {/* Top Wasted Products Breakdown List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Top Wasted Category Breakdown
          </h3>
          <span className="text-xs font-bold text-slate-500">Last 30 Days</span>
        </div>

        <div className="space-y-3">
          {(stats?.topWastedProducts || [
            { name: "Organic Farm Fresh Eggs 12pk", value: 340, category: "Dairy & Produce" },
            { name: "Amul Taaza Milk 1L", value: 120, category: "Dairy & Milk" },
            { name: "Whole Wheat Bread 400g", value: 180, category: "Bakery" },
          ]).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500">{item.category}</p>
                </div>
              </div>
              <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                ₹{item.value} Loss
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
