import React, { useState, useEffect } from "react";
import { forecastService } from "../services/forecastService";
import { RefreshCw, Truck, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold mb-2">
            <RefreshCw className="w-3.5 h-3.5" /> Automated Replenishment Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Smart Reorder & Supplier Matching</h2>
          <p className="text-xs text-slate-400 mt-1">
            Auto-calculates required order volumes and matches with the lowest price supplier.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-slate-500 col-span-2">Scanning inventory thresholds...</p>
        ) : reorders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 col-span-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-slate-200">No reorders needed right now!</p>
            <p className="text-xs text-slate-500">All products have stock above minimum safety levels.</p>
          </div>
        ) : (
          reorders.map((item) => {
            const prod = item.product;
            const isOrdered = orderedIds.includes(prod._id);

            return (
              <div
                key={prod._id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-base text-white">{prod.name}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      Low Stock ({prod.quantity} left)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Min Stock Threshold</span>
                      <p className="font-bold text-slate-200">{prod.minimumStock} units</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Recommended Order</span>
                      <p className="font-bold text-emerald-400">{item.recommendedOrderQty} units</p>
                    </div>
                  </div>

                  {/* Supplier Price Comparison Matrix */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Supplier Pricing:</span>
                    <div className="space-y-1.5">
                      {item.supplierOffers?.map((sup: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            sup.isRecommended
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                              : "bg-slate-950 border-slate-800/80 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{sup.supplierName}</span>
                            {sup.isRecommended && (
                              <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
                                Best Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">{sup.deliveryDays}d delivery</span>
                            <span className="font-extrabold">₹{sup.unitPrice}/unit</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() =>
                      handleCreateOrder(prod._id, item.bestSupplier?.supplierName || "Default Supplier", item.recommendedOrderQty)
                    }
                    disabled={isOrdered}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${
                      isOrdered
                        ? "bg-slate-800 text-slate-500"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20"
                    }`}
                  >
                    {isOrdered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Purchase Order Issued
                      </>
                    ) : (
                      <>
                        <span>Create Purchase Order ({item.recommendedOrderQty} units)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
