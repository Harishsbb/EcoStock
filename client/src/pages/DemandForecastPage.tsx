import React, { useState, useEffect } from "react";
import { forecastService } from "../services/forecastService";
import { TrendingUp, BarChart3, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export const DemandForecastPage: React.FC = () => {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    forecastService.getForecast().then((data) => {
      setForecasts(data || []);
      if (data && data.length > 0) setSelectedProduct(data[0]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Predictive Demand Analytics
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Demand Forecasting</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calculates 30-day sales velocity averages, stockout risk countdowns, and automated replenishment quantities.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 min-w-[170px] text-center">
          <span className="text-[10px] text-indigo-800 font-extrabold uppercase tracking-wider block">Model Confidence Rate</span>
          <span className="text-2xl font-black text-indigo-700">96.8%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Selector List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Catalog Velocity Rankings</h3>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-slate-400">Calculating velocity models...</p>
            ) : (
              forecasts.map((f) => (
                <div
                  key={f.productId}
                  onClick={() => setSelectedProduct(f)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedProduct?.productId === f.productId
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white border-slate-200/90 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-sm truncate max-w-[170px]">{f.productName}</h4>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        selectedProduct?.productId === f.productId
                          ? "bg-emerald-500 text-white"
                          : f.confidence === "High"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {f.confidence} Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                    <div>
                      <span className={`block text-[9px] uppercase font-bold ${selectedProduct?.productId === f.productId ? "text-slate-400" : "text-slate-400"}`}>
                        Stock
                      </span>
                      <span className="font-extrabold">{f.currentStock}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase font-bold ${selectedProduct?.productId === f.productId ? "text-slate-400" : "text-slate-400"}`}>
                        Daily Sales
                      </span>
                      <span className={`font-extrabold ${selectedProduct?.productId === f.productId ? "text-emerald-400" : "text-emerald-700"}`}>
                        {f.avgDailySales}/day
                      </span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase font-bold ${selectedProduct?.productId === f.productId ? "text-slate-400" : "text-slate-400"}`}>
                        Stockout Risk
                      </span>
                      <span className={`font-extrabold ${selectedProduct?.productId === f.productId ? "text-rose-400" : "text-rose-600"}`}>
                        {f.estimatedStockoutDays} days
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detailed Forecast Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6">
          {selectedProduct ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedProduct.productName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    SKU: {selectedProduct.sku} • Category: {selectedProduct.category}
                  </p>
                </div>
                <div className="text-right bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Suggested Reorder</span>
                  <p className="text-lg font-black text-emerald-700">{selectedProduct.recommendedReorder} units</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Stock</span>
                  <p className="text-2xl font-black text-slate-900">{selectedProduct.currentStock}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Daily Velocity</span>
                  <p className="text-2xl font-black text-emerald-700">{selectedProduct.avgDailySales}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Stockout Horizon</span>
                  <p className="text-2xl font-black text-rose-600">{selectedProduct.estimatedStockoutDays} Days</p>
                </div>
              </div>

              {/* Chart */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Historical Sales Velocity Trend
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProduct.historicalSales || []}>
                      <defs>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "14px", boxShadow: "0 10px 20px -5px rgba(0,0,0,0.06)" }}
                        itemStyle={{ color: "#4f46e5" }}
                        formatter={(val: any) => [`${val} units`, "Daily Velocity"]}
                      />
                      <Area type="monotone" dataKey="dailyQty" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">Select a product to view demand forecast.</div>
          )}
        </div>
      </div>
    </div>
  );
};
