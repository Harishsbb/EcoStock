import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Settings, Save, ShieldCheck } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<any>({
    name: user?.shop?.name || "FreshMart Organic Grocery",
    address: "42 Connaught Place, Inner Circle, New Delhi",
    phone: "+91 98765 43210",
    category: "Supermarket & Produce",
    expiryWarningDays: 7,
    lowStockThreshold: 10,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api.get("/shops/profile").then((res) => {
      if (res.data) setShop(res.data);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    try {
      await api.put("/shops/profile", shop);
      setSuccessMsg("Shop settings saved successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" /> Store Preferences & Thresholds
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop Profile & Parameters</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Configure shop profile details and automated expiry warning windows.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Shop Name</label>
          <input
            type="text"
            required
            value={shop.name}
            onChange={(e) => setShop({ ...shop, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Store Address</label>
          <input
            type="text"
            required
            value={shop.address}
            onChange={(e) => setShop({ ...shop, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Contact Phone</label>
            <input
              type="text"
              required
              value={shop.phone}
              onChange={(e) => setShop({ ...shop, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Store Category</label>
            <input
              type="text"
              required
              value={shop.category}
              onChange={(e) => setShop({ ...shop, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Expiry Warning Window (Days)</label>
            <input
              type="number"
              required
              value={shop.expiryWarningDays}
              onChange={(e) => setShop({ ...shop, expiryWarningDays: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Default Low Stock Threshold</label>
            <input
              type="number"
              required
              value={shop.lowStockThreshold}
              onChange={(e) => setShop({ ...shop, lowStockThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Save className="w-4 h-4" /> Save Profile Parameters
        </button>
      </form>
    </div>
  );
};
