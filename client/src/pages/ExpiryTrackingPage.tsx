import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ExpiryTrackingPage: React.FC = () => {
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts().then((data) => {
      const list = data.products || [];
      const nearExp = list.filter((p: Product) => p.status === "Near Expiry" || p.status === "Expired");
      setExpiringProducts(nearExp);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" /> Shelf-Life Expiry Control
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Expiry Risk & Write-off Prevention</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitor inventory approaching expiration dates to trigger automated markdown pricing or surplus exchanges before complete loss.
          </p>
        </div>

        <Link
          to="/discounts"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Open Smart Markdown Engine</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Potential Risk Value</th>
                <th className="py-3.5 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Scanning shelf-life records...
                  </td>
                </tr>
              ) : expiringProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-xs">
                    No products currently nearing expiry! Store inventory is healthy.
                  </td>
                </tr>
              ) : (
                expiringProducts.map((prod) => {
                  const today = new Date();
                  const exp = new Date(prod.expiryDate!);
                  const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const riskValue = prod.sellingPrice * prod.quantity;

                  return (
                    <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">{prod.name}</p>
                            <p className="text-[10px] text-slate-400">Category: {prod.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{prod.quantity} units</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        {new Date(prod.expiryDate!).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1 ${
                            days <= 0
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {days <= 0 ? "Expired" : `${days} days left`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-600">₹{riskValue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to="/discounts"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold inline-flex items-center gap-1 transition-colors"
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
