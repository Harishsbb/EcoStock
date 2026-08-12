import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { salesService, SaleItem } from "../services/salesService";
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, CreditCard, Wallet, Smartphone, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export const POSPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const addProductId = searchParams.get("add");

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "UPI">("CASH");
  const [loading, setLoading] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  useEffect(() => {
    productService.getProducts().then((data) => {
      const list = data.products || [];
      setProducts(list);
      if (addProductId) {
        const found = list.find((p: Product) => p._id === addProductId);
        if (found) addToCart(found);
      }
    });
  }, [addProductId]);

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert(`Cannot add ${product.name} - Out of stock!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert(`Maximum available stock (${product.quantity}) reached for ${product.name}`);
          return prev;
        }
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.quantity) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const discountTotal = cart.reduce((sum, item) => sum + item.discount * item.quantity, 0);
  const total = Math.max(0, subtotal - discountTotal);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items: SaleItem[] = cart.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.sellingPrice,
        discountAmount: item.discount,
        total: (item.product.sellingPrice - item.discount) * item.quantity,
      }));

      const res = await salesService.createSale({
        items,
        subtotal,
        discountTotal,
        taxTotal: 0,
        total,
        paymentMethod,
      });

      setCompletedSale(res);
      setCart([]);
      const updated = await productService.getProducts();
      setProducts(updated.products || []);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchesCat = category === "ALL" || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-8rem)] animate-in fade-in duration-300 pb-8">
      {/* Left Column: Register Search & Product Grid */}
      <div className="lg:col-span-2 flex flex-col space-y-4 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search POS items or scan barcode..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Dairy & Milk">Dairy & Milk</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Beverages">Beverages</option>
            <option value="Packaged Snacks">Packaged Snacks</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1 max-h-[600px]">
          {filteredProducts.map((prod) => (
            <motion.div
              key={prod._id}
              whileHover={{ y: -2 }}
              onClick={() => addToCart(prod)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <img
                  src={prod.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
                  alt={prod.name}
                  className="w-full h-24 rounded-xl object-cover border border-slate-200 bg-slate-50"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Stock: {prod.quantity} units</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-black text-sm text-emerald-700">₹{prod.sellingPrice}</span>
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Checkout Drawer */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-base text-slate-900">Current POS Order</h3>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
            {cart.length} Items
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1 max-h-[340px]">
          {cart.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <ShoppingCart className="w-10 h-10 stroke-1 text-slate-300" />
              <p className="text-xs font-medium">Click items on the left to add to basket.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product._id} className="pt-2 flex items-center justify-between gap-2">
                <div className="flex-1 truncate">
                  <p className="font-bold text-xs text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ₹{item.product.sellingPrice} × {item.quantity} = ₹
                    {(item.product.sellingPrice - item.discount) * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(item.product._id, -1)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black w-5 text-center text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.product._id, 1)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1 rounded text-rose-600 hover:bg-rose-50 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment & Totals */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaymentMethod("CASH")}
              className={`flex-1 py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === "CASH"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`flex-1 py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === "UPI"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> UPI / QR
            </button>
            <button
              onClick={() => setPaymentMethod("CARD")}
              className={`flex-1 py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === "CARD"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Card
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span className="text-slate-900 font-bold">₹{subtotal}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Markdown Savings</span>
                <span>-₹{discountTotal}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-1">
              <span>Total Amount</span>
              <span className="text-emerald-700">₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : `Complete Order (₹${total})`}
          </button>
        </div>
      </div>

      {/* Sale Completion Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-black text-slate-900">Order Completed Successfully!</h3>
            <p className="text-xs text-slate-500 font-mono">Invoice: <span className="font-bold text-slate-900">{completedSale.invoiceNumber}</span></p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode</span>
                <span className="font-bold text-slate-900">{completedSale.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Items Count</span>
                <span className="font-bold text-slate-900">{completedSale.items?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-emerald-700 pt-2 border-t border-slate-200">
                <span>Amount Paid</span>
                <span>₹{completedSale.total}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedSale(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700"
            >
              Start Next Cashier Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
