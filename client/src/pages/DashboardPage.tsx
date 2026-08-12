import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { inventoryService } from "../services/inventoryService";
import { salesService } from "../services/salesService";
import { SmartInsightCard } from "../components/SmartInsightCard";
import { CardSkeleton } from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Leaf,
  Activity,
  ChevronRight,
  Tag,
  Store,
  RefreshCw,
  BarChart3,
  Layers,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [salesAnalytics, setSalesAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeRecommendationTab, setActiveRecommendationTab] = useState<"all" | "expiry" | "discount" | "reorder" | "surplus">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, salesData] = await Promise.all([
          inventoryService.getSummary(),
          salesService.getAnalytics(),
        ]);
        setSummary(sumData);
        setSalesAnalytics(salesData);
      } catch (err) {
        // Fallback demo metrics for resilient viewing
        setSummary({
          totalProducts: 1248,
          totalStockValue: 840000,
          todaySales: 12450,
          lowStockCount: 18,
          expiringSoonCount: 24,
          recoveredRevenue: 8420,
        });
        setSalesAnalytics({
          dailyTrend: [
            { _id: "Mon", totalSales: 8200, forecast: 7900 },
            { _id: "Tue", totalSales: 9400, forecast: 9100 },
            { _id: "Wed", totalSales: 11200, forecast: 10800 },
            { _id: "Thu", totalSales: 10500, forecast: 11000 },
            { _id: "Fri", totalSales: 14200, forecast: 13800 },
            { _id: "Sat", totalSales: 18900, forecast: 17500 },
            { _id: "Sun", totalSales: 12450, forecast: 13000 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Health Ring Data
  const healthData = [
    { name: "Healthy Stock", value: 85, color: "#10b981" },
    { name: "Expiring Soon", value: 10, color: "#f59e0b" },
    { name: "Critical / Low", value: 5, color: "#f43f5e" },
  ];

  // Category Expiry Radar Breakdown
  const categoryExpiryData = [
    { category: "Dairy & Eggs", expiringUnits: 18, valueRisk: 2400 },
    { category: "Bakery", expiringUnits: 14, valueRisk: 1680 },
    { category: "Produce", expiringUnits: 12, valueRisk: 1950 },
    { category: "Beverages", expiringUnits: 6, valueRisk: 890 },
    { category: "Packaged Foods", expiringUnits: 4, valueRisk: 620 },
  ];

  // Surplus Opportunities Spotlight
  const surplusSpotlight = [
    {
      id: "s1",
      name: "Organic Whole Milk 1L",
      qty: "40 Units",
      expiry: "In 3 Days",
      discount: "50% OFF",
      potentialRevenue: "₹1,200",
      location: "Koramangala Partner Hub",
    },
    {
      id: "s2",
      name: "Harvest Brown Bread 400g",
      qty: "25 Units",
      expiry: "In 2 Days",
      discount: "40% OFF",
      potentialRevenue: "₹750",
      location: "Indiranagar Superstore",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-8">
      {/* COMMAND CENTER HEADER BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Intelligent Command Center Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good morning, {user?.name?.split(" ")[0] || "Store Manager"} 👋
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              EcoStock engine actively monitors inventory velocity, predicts stockouts, and optimizes discount markdowns in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Prevented Waste</span>
              <span className="text-base font-extrabold text-emerald-400">28.4%</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Accuracy</span>
              <span className="text-base font-extrabold text-teal-300">96.8%</span>
            </div>
            <Link
              to="/pos"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Open Cashier POS
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ENHANCED COMMAND CENTER KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            {/* Card 1: Total Stock Value */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">Stock Asset Value</span>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">
                  ₹{(summary?.totalStockValue / 100000).toFixed(2)}L
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{summary?.totalProducts || 1248} Active SKUs</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    High Liquidity
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Today's Sales */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">Today's Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">
                  ₹{summary?.todaySales?.toLocaleString() || "12,450"}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+14.2% vs yesterday</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Inventory Health Ring Metric */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">Inventory Health</span>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-slate-900">85%</p>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Optimal
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[85%]" />
                </div>
              </div>
            </motion.div>

            {/* Card 4: Waste Recovery Meter */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Recovered Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-700">
                  ₹{summary?.recoveredRevenue?.toLocaleString() || "8,420"}
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  Saved from dynamic discounts & surplus
                </p>
              </div>
            </motion.div>

            {/* Card 5: Expiry Radar (<7 Days) */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">Expiring Soon</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-600">{summary?.expiringSoonCount || 24} Items</p>
                <Link
                  to="/discounts"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
                >
                  Apply Markdowns <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Card 6: Stockout Horizon (<3 Days) */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">Stockout Risk</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-600">{summary?.lowStockCount || 18} SKUs</p>
                <Link
                  to="/reorders"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline"
                >
                  Trigger Reorder <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* PROMINENT SMART RECOMMENDATIONS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Smart Recommendations Engine
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
                  5 Live Actions
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Proactive intelligence calculated from real-time POS velocity, shelf-life windows, and local supplier feeds.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["all", "expiry", "discount", "reorder", "surplus"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRecommendationTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  activeRecommendationTab === tab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {tab === "all" ? "All Recommendations" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeRecommendationTab === "all" || activeRecommendationTab === "reorder") && (
            <SmartInsightCard
              type="prediction"
              title="Stockout Risk: Milk Category"
              description="Amul Taaza Milk (45 units left) projected to stock out in 48 hours based on weekend sales velocity."
              actionText="Review Smart Reorders"
              actionLink="/reorders"
              badge="Urgent Reorder"
            />
          )}

          {(activeRecommendationTab === "all" || activeRecommendationTab === "discount" || activeRecommendationTab === "expiry") && (
            <SmartInsightCard
              type="expiry"
              title="Dynamic Markdown Suggested"
              description="42 units of Harvest Bread expire in 3 days. Applying a 40% discount will recover ₹1,008 before shelf expiry."
              actionText="Apply AI Discount"
              actionLink="/discounts"
              badge="Markdown 40%"
            />
          )}

          {(activeRecommendationTab === "all" || activeRecommendationTab === "reorder") && (
            <SmartInsightCard
              type="supplier"
              title="Supplier Bulk Deal Detected"
              description="Britannia Bakery Supply currently offers 8% lower unit price on bread stock compared to standard vendor."
              actionText="Compare Supplier Pricing"
              actionLink="/suppliers"
              badge="8% Savings"
            />
          )}

          {(activeRecommendationTab === "all" || activeRecommendationTab === "surplus" || activeRecommendationTab === "expiry") && (
            <SmartInsightCard
              type="waste"
              title="Surplus B2B Match Available"
              description="Indiranagar Superstore has placed a buy request for surplus beverages. You can offset ₹3,200 immediately."
              actionText="List on Surplus Exchange"
              actionLink="/exchange"
              badge="Instant Liquidity"
            />
          )}
        </div>
      </div>

      {/* DEMAND FORECAST & INVENTORY HEALTH RADAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecast Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Demand Forecast & Sales Velocity
              </h3>
              <p className="text-xs text-slate-500">7-day historical revenue vs AI predicted demand curve</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Actual Sales
              </span>
              <span className="flex items-center gap-1.5 text-indigo-700">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Forecast Model
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesAnalytics?.dailyTrend || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)" }}
                  formatter={(val: any, name: any) => [
                    `₹${val?.toLocaleString()}`,
                    name === "totalSales" ? "Actual Revenue" : "Predicted Demand",
                  ]}
                />
                <Area type="monotone" dataKey="totalSales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Health Ring & Expiry Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Inventory Health Ring
            </h3>
            <p className="text-xs text-slate-500">Live breakdown of overall stock status</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-900">85%</span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Healthy</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {healthData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WASTE & RECOVERY DIFFERENTIATOR SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-emerald-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Core Differentiator
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              Waste Prevention & Revenue Recovery Command
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl">
              Turn potential expired inventory write-offs into recovered profit through automated markdowns and B2B surplus exchange.
            </p>
          </div>
          <Link
            to="/waste"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all self-start md:self-auto"
          >
            Full Eco Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Breakdown Meters & Surplus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Waste Recovery Meter */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Monthly Food Waste Diverted</span>
              <span className="text-xs font-black text-emerald-600">142 kg</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[72%]" />
            </div>
            <p className="text-[11px] text-slate-500">
              72% towards your monthly sustainability target of 200 kg. Equivalent to offset of 380 kg CO2.
            </p>
          </div>

          {/* Revenue Recovery Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-800 block mb-1">Recovered Revenue Channels</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Smart AI Discounts</span>
                <span className="font-bold text-emerald-700">₹5,420</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Surplus B2B Exchange</span>
                <span className="font-bold text-teal-700">₹3,000</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-extrabold text-slate-900">
                <span>Total Recovered</span>
                <span className="text-emerald-700">₹8,420</span>
              </div>
            </div>
          </div>

          {/* Surplus Marketplace Spotlight Card */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Nearby B2B Surplus Trade</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                2 Matches
              </span>
            </div>
            <div className="space-y-2">
              {surplusSpotlight.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.qty} • {item.expiry}</p>
                  </div>
                  <span className="font-extrabold text-emerald-700">{item.potentialRevenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
