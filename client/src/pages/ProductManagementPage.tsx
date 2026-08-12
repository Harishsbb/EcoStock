import React, { useState } from "react";
import { productService, Product } from "../services/productService";
import { supplierService, Supplier } from "../services/supplierService";
import { Save } from "lucide-react";

interface FormProps {
  initialProduct?: Product | null;
  onSuccess: () => void;
}

export const ProductManagementForm: React.FC<FormProps> = ({ initialProduct, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    sku: initialProduct?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: initialProduct?.barcode || `${Math.floor(890000000000 + Math.random() * 99999999)}`,
    category: initialProduct?.category || "Dairy & Milk",
    purchasePrice: initialProduct?.purchasePrice || "",
    sellingPrice: initialProduct?.sellingPrice || "",
    quantity: initialProduct?.quantity || "",
    minimumStock: initialProduct?.minimumStock || 10,
    expiryDate: initialProduct?.expiryDate ? new Date(initialProduct.expiryDate).toISOString().split("T")[0] : "",
    supplierId: initialProduct?.supplierId?._id || initialProduct?.supplierId || "",
    imageUrl: initialProduct?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    supplierService.getSuppliers().then((data) => setSuppliers(data || [])).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (initialProduct?._id) {
        await productService.updateProduct(initialProduct._id, formData as any);
      } else {
        await productService.createProduct(formData as any);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Product Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Amul Taaza Toned Milk 1L"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">SKU Code</label>
          <input
            type="text"
            name="sku"
            required
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-mono font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Barcode Number</label>
          <input
            type="text"
            name="barcode"
            required
            value={formData.barcode}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-mono font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          >
            <option value="Dairy & Milk">Dairy & Milk</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Beverages">Beverages</option>
            <option value="Packaged Snacks">Packaged Snacks</option>
            <option value="Personal Care">Personal Care</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Supplier Vendor</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Cost Price (₹)</label>
          <input
            type="number"
            name="purchasePrice"
            required
            value={formData.purchasePrice}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Sell Price (₹)</label>
          <input
            type="number"
            name="sellingPrice"
            required
            value={formData.sellingPrice}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            required
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Min Stock</label>
          <input
            type="number"
            name="minimumStock"
            required
            value={formData.minimumStock}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase mb-1 text-slate-700">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? "Saving..." : initialProduct ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
};
