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
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" /> Store Preferences
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Shop Profile & Settings</h2>
          <p className="text-xs text-slate-400 mt-1">Configure shop details and automated alert threshold parameters.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Shop Name</label>
          <input
            type="text"
            required
            value={shop.name}
            onChange={(e) => setShop({ ...shop, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Address</label>
          <input
            type="text"
            required
            value={shop.address}
            onChange={(e) => setShop({ ...shop, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Phone</label>
            <input
              type="text"
              required
              value={shop.phone}
              onChange={(e) => setShop({ ...shop, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Category</label>
            <input
              type="text"
              required
              value={shop.category}
              onChange={(e) => setShop({ ...shop, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Expiry Warning Window (Days)</label>
            <input
              type="number"
              required
              value={shop.expiryWarningDays}
              onChange={(e) => setShop({ ...shop, expiryWarningDays: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-slate-300">Default Low Stock Threshold</label>
            <input
              type="number"
              required
              value={shop.lowStockThreshold}
              onChange={(e) => setShop({ ...shop, lowStockThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 flex items-center justify-center gap-2 mt-4"
        >
          <Save className="w-4 h-4" /> Save Profile Preferences
        </button>
      </form>
    </div>
  );
};
