import React, { useState, useEffect } from "react";
import { forecastService } from "../services/forecastService";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Demand Velocity Predictive Analytics
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Product Demand Forecasting</h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculates 30-day moving average velocity, estimated stockout countdowns, and optimal replenishment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Forecast Selector List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Store Products</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-slate-500">Generating velocity projections...</p>
            ) : (
              forecasts.map((f) => (
                <div
                  key={f.productId}
                  onClick={() => setSelectedProduct(f)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedProduct?.productId === f.productId
                      ? "bg-slate-800 border-emerald-500/60 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-white truncate max-w-[170px]">{f.productName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        f.confidence === "High"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {f.confidence} Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-slate-400">
                    <div>
                      <span className="block text-[9px] uppercase font-medium">Stock</span>
                      <span className="font-bold text-slate-200">{f.currentStock}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-medium">Daily Sales</span>
                      <span className="font-bold text-emerald-400">{f.avgDailySales}/day</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-medium">Stockout</span>
                      <span className="font-bold text-rose-400">{f.estimatedStockoutDays} days</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detailed Forecast Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
          {selectedProduct ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">{selectedProduct.productName}</h3>
                  <p className="text-xs text-slate-400">SKU: {selectedProduct.sku} | Category: {selectedProduct.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Recommended Reorder</span>
                  <p className="text-lg font-black text-emerald-400">{selectedProduct.recommendedReorder} units</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Inventory</span>
                  <p className="text-xl font-black text-slate-100">{selectedProduct.currentStock}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Daily Sales</span>
                  <p className="text-xl font-black text-emerald-400">{selectedProduct.avgDailySales}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Stockout</span>
                  <p className="text-xl font-black text-rose-400">{selectedProduct.estimatedStockoutDays} Days</p>
                </div>
              </div>

              {/* Chart */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Historical Demand Velocity</h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProduct.historicalSales || []}>
                      <defs>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="_id" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                        itemStyle={{ color: "#818cf8" }}
                      />
                      <Area type="monotone" dataKey="dailyQty" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Select a product to view demand forecast.</div>
          )}
        </div>
      </div>
    </div>
  );
};
