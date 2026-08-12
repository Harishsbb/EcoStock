import React, { useState, useEffect } from "react";
import { supplierService, type Supplier } from "../services/supplierService";
import { Truck, Plus, Phone, Mail, MapPin, Star, Edit, Trash2 } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export const SuppliersPage: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    productsHandled: "",
    deliveryDays: 2,
    rating: 4.5,
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      productsHandled: "",
      deliveryDays: 2,
      rating: 4.5,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || "",
      email: sup.email || "",
      phone: sup.phone || "",
      address: sup.address || "",
      productsHandled: (sup.productsHandled || []).join(", "),
      deliveryDays: sup.deliveryDays || 2,
      rating: sup.rating || 4.5,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierService.updateSupplier(editingSupplier._id, formData as any);
      } else {
        await supplierService.createSupplier(formData as any);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save supplier");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this supplier?")) {
      try {
        await supplierService.deleteSupplier(id);
        fetchSuppliers();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete supplier");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-400" /> Supplier Directory & Price Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage vendor contacts, lead times, and unit pricing histories.</p>
        </div>

        {isOwner && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-500 col-span-3">Loading supplier directory...</p>
        ) : suppliers.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 col-span-3">
            No suppliers found. Click Add Supplier to create one.
          </div>
        ) : (
          suppliers.map((sup) => (
            <div
              key={sup._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white">{sup.name}</h3>
                    <p className="text-xs text-slate-400">Contact: {sup.contactPerson || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-400" /> {sup.rating || 4.5}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  {sup.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                  {sup.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{sup.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                  <span>Avg Delivery Lead Time</span>
                  <span className="font-bold text-emerald-400">{sup.deliveryDays || 2} Days</span>
                </div>
              </div>

              {isOwner && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(sup)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sup._id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Supplier Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Company / Supplier Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Save Supplier Details
          </button>
        </form>
      </Modal>
    </div>
  );
};
