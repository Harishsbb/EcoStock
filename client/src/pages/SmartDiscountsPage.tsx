import React, { useState, useEffect } from "react";
import { discountService, type DiscountRecommendation } from "../services/discountService";
import { Sparkles, Check, X, Sliders, ShieldCheck } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Expiry-Aware Smart Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Smart Discount Recommendations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic markdown algorithms combine remaining shelf-life, daily sales velocity, and excess stock.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-slate-500 text-xs col-span-2">Calculating optimal markdown recommendations...</p>
        ) : recommendations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 col-span-2 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-bold text-slate-200">No active markdown recommendations required.</p>
            <p className="text-xs text-slate-500">All store items have healthy stock coverage buffers.</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec._id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {rec.productName}
                  </h3>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      rec.status === "ACCEPTED" || rec.status === "CUSTOMIZED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : rec.status === "REJECTED"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse"
                    }`}
                  >
                    {rec.status === "PENDING"
                      ? `${rec.recommendedDiscountPercent}% Recommended`
                      : rec.status}
                  </span>
                </div>

                {/* Explainable AI Reasoning Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
                  <span className="font-bold text-emerald-400 block mb-0.5">Algorithm Rationale:</span>
                  {rec.reason}
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/40 text-center border border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Price</span>
                    <span className="text-sm font-bold text-slate-300">₹{rec.currentPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Markdown Price</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      ₹{rec.recommendedPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Revenue</span>
                    <span className="text-sm font-extrabold text-emerald-400">₹{rec.expectedRecovery}</span>
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleAction(rec._id, "ACCEPTED")}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Accept ({rec.recommendedDiscountPercent}%)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRec(rec);
                      setCustomPercent(rec.recommendedDiscountPercent);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    title="Customize discount %"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(rec._id, "REJECTED")}
                    className="p-2.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                    title="Reject recommendation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 text-center italic">Requires Store Owner approval.</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Customize Modal */}
      <Modal isOpen={!!selectedRec} onClose={() => setSelectedRec(null)} title="Customize Discount Rate">
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Set custom discount percentage for {selectedRec?.productName}:</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="75"
              step="5"
              value={customPercent}
              onChange={(e) => setCustomPercent(Number(e.target.value))}
              className="flex-1 accent-emerald-500"
            />
            <span className="text-xl font-extrabold text-emerald-400 w-16 text-right">{customPercent}%</span>
          </div>
          <p className="text-xs text-slate-300">
            Adjusted Markdown Price: ₹{selectedRec ? Math.round(selectedRec.currentPrice * (1 - customPercent / 100)) : 0}
          </p>
          <button
            onClick={() => {
              if (selectedRec) {
                handleAction(selectedRec._id, "CUSTOMIZED", customPercent);
                setSelectedRec(null);
              }
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Apply Custom Discount ({customPercent}%)
          </button>
        </div>
      </Modal>
    </div>
  );
};
