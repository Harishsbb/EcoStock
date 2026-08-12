import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ExpiryTrackingPage: React.FC = () => {
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts().then((data) => {
      const list = data.products || [];
      // Filter near expiry or expired
      const nearExp = list.filter((p: Product) => p.status === "Near Expiry" || p.status === "Expired");
      setExpiringProducts(nearExp);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" /> Expiry Risk & Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor inventory approaching shelf-life expiration to prevent complete product write-offs.
          </p>
        </div>

        <Link
          to="/discounts"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Open Smart Discount Engine</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Potential Risk Value</th>
                <th className="py-3.5 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    Scanning expiry records...
                  </td>
                </tr>
              ) : expiringProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No products currently nearing expiry! Stock is healthy.
                  </td>
                </tr>
              ) : (
                expiringProducts.map((prod) => {
                  const today = new Date();
                  const exp = new Date(prod.expiryDate!);
                  const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const riskValue = prod.sellingPrice * prod.quantity;

                  return (
                    <tr key={prod._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-950"
                          />
                          <div>
                            <p className="font-semibold text-slate-200 text-sm leading-tight">{prod.name}</p>
                            <p className="text-[11px] text-slate-500">Category: {prod.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{prod.quantity} units</td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {new Date(prod.expiryDate!).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1 ${
                            days <= 0
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse"
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {days <= 0 ? "Expired" : `${days} days left`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-400">₹{riskValue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to="/discounts"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <span>Apply Markdown</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
