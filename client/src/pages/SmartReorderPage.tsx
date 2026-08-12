import React, { useState, useEffect } from "react";
import { forecastService } from "../services/forecastService";
import { RefreshCw, Truck, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export const SmartReorderPage: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";
  const [reorders, setReorders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    forecastService.getReorders().then((data) => {
      setReorders(data || []);
      setLoading(false);
    });
  }, []);

  const handleCreateOrder = (prodId: string, supplierName: string, orderQty: number) => {
    alert(`Purchase Order successfully generated!\nSupplier: ${supplierName}\nQuantity: ${orderQty} units.`);
    setOrderedIds((prev) => [...prev, prodId]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <RefreshCw className="w-3.5 h-3.5" /> Automated Replenishment Engine
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Reorder & Supplier Matching</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Auto-calculates required order volumes and compares registered supplier price lists for optimal margin protection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-2">Scanning inventory thresholds...</p>
        ) : reorders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center text-slate-500 col-span-2 space-y-2 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-800">No Reorders Required</h3>
            <p className="text-xs text-slate-400">All store products have quantities above minimum threshold limits.</p>
          </div>
        ) : (
          reorders.map((item) => {
            const prod = item.product;
            const isOrdered = orderedIds.includes(prod._id);

            return (
              <motion.div
                key={prod._id}
                whileHover={{ y: -3 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-black text-base text-slate-900">{prod.name}</h3>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Low Stock ({prod.quantity} units)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Threshold</span>
                      <p className="font-extrabold text-slate-800">{prod.minimumStock} units</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Order</span>
                      <p className="font-black text-emerald-700">{item.recommendedOrderQty} units</p>
                    </div>
                  </div>

                  {/* Supplier Price Comparison */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Supplier Pricing:</span>
                    <div className="space-y-2">
                      {item.supplierOffers?.map((sup: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                            sup.isRecommended
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{sup.supplierName}</span>
                            {sup.isRecommended && (
                              <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black uppercase">
                                Best Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-normal">{sup.deliveryDays}d delivery</span>
                            <span className="font-black text-slate-900">₹{sup.unitPrice}/unit</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() =>
                      handleCreateOrder(prod._id, item.bestSupplier?.supplierName || "Primary Supplier", item.recommendedOrderQty)
                    }
                    disabled={isOrdered}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all ${
                      isOrdered
                        ? "bg-slate-100 text-slate-400"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                    }`}
                  >
                    {isOrdered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Purchase Order Issued
                      </>
                    ) : (
                      <>
                        <span>Generate Purchase Order ({item.recommendedOrderQty} units)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
