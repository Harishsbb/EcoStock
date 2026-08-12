import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { ProductManagementForm } from "./ProductManagementPage";
import { Search, Filter, Plus, Edit, Trash2, QrCode, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search,
        category,
        status,
      });
      setProducts(data.products || []);
    } catch (err) {
      console.warn("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, status]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Inventory Management</h2>
          <p className="text-xs text-slate-400 mt-1">Track product quantities, prices, supplier details, and expiry statuses.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or barcode..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Dairy & Milk">Dairy & Milk</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Beverages">Beverages</option>
            <option value="Packaged Snacks">Packaged Snacks</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical">Critical</option>
            <option value="Near Expiry">Near Expiry</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Qty</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    Loading inventory products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
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
                          <p className="text-[11px] text-slate-500">Cost: ₹{prod.purchasePrice}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-xs font-mono text-slate-300">{prod.sku}</p>
                      <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <QrCode className="w-3 h-3" /> {prod.barcode}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">{prod.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold text-sm ${
                          prod.quantity <= prod.minimumStock ? "text-amber-400" : "text-slate-100"
                        }`}
                      >
                        {prod.quantity}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">/ Min {prod.minimumStock}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹{prod.sellingPrice}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {prod.expiryDate ? new Date(prod.expiryDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={prod.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => handleDelete(prod._id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        maxWidth="max-w-2xl"
      >
        <ProductManagementForm
          initialProduct={editingProduct}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      </Modal>
    </div>
  );
};
