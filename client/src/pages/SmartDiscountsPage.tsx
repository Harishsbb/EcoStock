import React, { useState, useEffect } from "react";
import { discountService, type DiscountRecommendation } from "../services/discountService";
import { Sparkles, Check, X, Sliders, ShieldCheck, Percent, ArrowRight, TrendingUp } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export const SmartDiscountsPage: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const [recommendations, setRecommendations] = useState<DiscountRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Customize Modal State
  const [selectedRec, setSelectedRec] = useState<DiscountRecommendation | null>(null);
  const [customPercent, setCustomPercent] = useState(30);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await discountService.getRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAction = async (id: string, status: string, customVal?: number) => {
    try {
      await discountService.updateStatus(id, status, customVal);
      fetchRecommendations();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update discount recommendation");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Dynamic Pricing Engine
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Discount Recommendations</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calculated by analyzing remaining shelf-life windows, historical POS sales velocity, and predicted demand elasticity to optimize revenue recovery.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 min-w-[180px] text-center">
          <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">Potential Recovered Value</span>
          <span className="text-2xl font-black text-emerald-700">₹12,450</span>
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs col-span-2">
            Calculating dynamic markdown algorithms...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center col-span-2 space-y-3 shadow-2xs">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Markdown Actions Required</h3>
            <p className="text-xs text-slate-500">All current inventory items have healthy sales velocity and safe shelf-life coverage.</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <motion.div
              key={rec._id}
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {rec.productName}
                  </h3>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      rec.status === "ACCEPTED" || rec.status === "CUSTOMIZED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : rec.status === "REJECTED"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                    }`}
                  >
                    {rec.status === "PENDING"
                      ? `${rec.recommendedDiscountPercent}% Suggested`
                      : rec.status}
                  </span>
                </div>

                {/* Algorithm Rationale Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed mb-4">
                  <span className="font-bold text-emerald-700 block mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Rationale:
                  </span>
                  {rec.reason}
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-emerald-50/40 text-center border border-emerald-100">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Price</span>
                    <span className="text-sm font-bold text-slate-800 line-through">₹{rec.currentPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-extrabold block">AI Target Price</span>
                    <span className="text-base font-black text-emerald-700">
                      ₹{rec.recommendedPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Expected Recovery</span>
                    <span className="text-sm font-extrabold text-teal-700">₹{rec.expectedRecovery}</span>
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleAction(rec._id, "ACCEPTED")}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
                  >
                    <Check className="w-4 h-4" /> Apply ({rec.recommendedDiscountPercent}%)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRec(rec);
                      setCustomPercent(rec.recommendedDiscountPercent);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Customize discount %"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(rec._id, "REJECTED")}
                    className="p-2.5 rounded-xl bg-slate-100 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 text-center italic">Requires Manager approval to apply discount.</p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Customize Modal */}
      <Modal isOpen={!!selectedRec} onClose={() => setSelectedRec(null)} title="Customize Discount Rate">
        <div className="space-y-4">
          <p className="text-xs text-slate-600">Adjust target discount percentage for <strong>{selectedRec?.productName}</strong>:</p>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <input
              type="range"
              min="5"
              max="75"
              step="5"
              value={customPercent}
              onChange={(e) => setCustomPercent(Number(e.target.value))}
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xl font-black text-emerald-700 w-16 text-right">{customPercent}%</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Adjusted Price Output:</span>
            <span className="text-base text-emerald-700 font-black">
              ₹{selectedRec ? Math.round(selectedRec.currentPrice * (1 - customPercent / 100)) : 0}
            </span>
          </div>
          <button
            onClick={() => {
              if (selectedRec) {
                handleAction(selectedRec._id, "CUSTOMIZED", customPercent);
                setSelectedRec(null);
              }
            }}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Confirm Custom Rate ({customPercent}%)
          </button>
        </div>
      </Modal>
    </div>
  );
};
