import React, { useState, useEffect } from "react";
import { supplierService, type Supplier } from "../services/supplierService";
import { Truck, Plus, Phone, Mail, MapPin, Star, Edit, Trash2 } from "lucide-react";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" /> Vendor Directory & Supply Logistics
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Supplier Directory</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Maintain registered vendor contact details, lead time performance SLAs, and wholesale catalog pricing.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Supplier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-3">Loading supplier directory...</p>
        ) : suppliers.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center text-slate-500 col-span-3 shadow-2xs space-y-2">
            <Truck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800">No suppliers registered yet.</p>
            <p className="text-xs text-slate-400">Click Add New Supplier to populate vendor contacts.</p>
          </div>
        ) : (
          suppliers.map((sup) => (
            <motion.div
              key={sup._id}
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-base text-slate-900">{sup.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Contact: {sup.contactPerson || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-800 text-xs font-black bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {sup.rating || 4.5}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  {sup.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                  {sup.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{sup.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-semibold">Delivery SLA Lead Time</span>
                  <span className="font-black text-emerald-700">{sup.deliveryDays || 2} Days</span>
                </div>
              </div>

              {isOwner && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(sup)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sup._id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Supplier Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Company / Vendor Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-slate-700">Address / City</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Save Supplier Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
