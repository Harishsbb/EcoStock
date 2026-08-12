import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { salesService, SaleItem } from "../services/salesService";
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, CreditCard, Wallet, Smartphone } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
      // Refresh products stock
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      {/* Left Column: Product Selection Grid */}
      <div className="lg:col-span-2 flex flex-col space-y-4 h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search POS items..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

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
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
          {filteredProducts.map((prod) => (
            <div
              key={prod._id}
              onClick={() => addToCart(prod)}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-24 rounded-xl object-cover border border-slate-800 bg-slate-950"
                />
                <div>
                  <h4 className="font-semibold text-xs text-slate-200 line-clamp-1 group-hover:text-emerald-400">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">Qty: {prod.quantity} units</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-extrabold text-sm text-emerald-400">₹{prod.sellingPrice}</span>
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Checkout Cart & Invoice Summary */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-full shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base text-white">Current POS Order</h3>
          </div>
          <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-semibold">
            {cart.length} Items
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2 divide-y divide-slate-800/60 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <ShoppingCart className="w-10 h-10 stroke-1 text-slate-600" />
              <p className="text-xs">Select products from the grid to add to basket.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product._id} className="pt-2 flex items-center justify-between gap-2">
                <div className="flex-1 truncate">
                  <p className="font-semibold text-xs text-slate-200 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-400">
                    ₹{item.product.sellingPrice} × {item.quantity} = ₹
                    {(item.product.sellingPrice - item.discount) * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(item.product._id, -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.product._id, 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/10 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Method & Total Breakdown */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaymentMethod("CASH")}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === "CASH"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === "UPI"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> UPI / QR
            </button>
            <button
              onClick={() => setPaymentMethod("CARD")}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === "CARD"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Card
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-200">₹{subtotal}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Markdown Discount</span>
                <span>-₹{discountTotal}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-white pt-1">
              <span>Total Payable</span>
              <span className="text-emerald-400">₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50"
          >
            {loading ? "Processing Sale..." : `Complete Sale (₹${total})`}
          </button>
        </div>
      </div>

      {/* Sale Completion Confirmation Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-white">Sale Completed Successfully!</h3>
            <p className="text-xs text-slate-400">Invoice: <span className="font-mono text-emerald-400">{completedSale.invoiceNumber}</span></p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="font-bold text-white">{completedSale.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Items</span>
                <span className="font-bold text-white">{completedSale.items?.length || 0}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm font-bold text-emerald-400 pt-2 border-t border-slate-800">
                <span>Amount Paid</span>
                <span>₹{completedSale.total}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedSale(null)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
            >
              Start Next Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
