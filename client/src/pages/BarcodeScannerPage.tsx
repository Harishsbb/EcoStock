import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import { Badge } from "../components/Badge";
import { QrCode, Search, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

export const BarcodeScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanSuccessMsg, setScanSuccessMsg] = useState("");

  const handleLookup = async (barcodeToSearch: string) => {
    if (!barcodeToSearch.trim()) return;
    setLoading(true);
    setError("");
    setScanSuccessMsg("");

    try {
      const prod = await productService.getProductByBarcode(barcodeToSearch.trim());
      setScannedProduct(prod);
      setScanSuccessMsg(`Product found: ${prod.name}`);
    } catch (err: any) {
      setScannedProduct(null);
      setError(err.response?.data?.message || `No product found for barcode: ${barcodeToSearch}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        handleLookup(decodedText);
        scanner.clear().catch(() => {});
      },
      (errorMessage) => {
        // quiet error
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300 pb-8">
      <div className="text-center space-y-1 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6 text-emerald-600" /> Barcode & QR Scanner
        </h2>
        <p className="text-xs text-slate-500">Point device camera at a product barcode or enter barcode digits manually.</p>
      </div>

      {/* Manual Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex gap-2">
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Enter Barcode manually (e.g. 890126201001)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-mono focus:bg-white focus:border-emerald-500"
        />
        <button
          onClick={() => handleLookup(barcodeInput)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <Search className="w-4 h-4" /> Lookup
        </button>
      </div>

      {/* Quick Barcode Demo Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold">Quick Demo Barcodes:</span>
        <button
          onClick={() => {
            setBarcodeInput("890126201001");
            handleLookup("890126201001");
          }}
          className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold"
        >
          Milk (890126201001)
        </button>
        <button
          onClick={() => {
            setBarcodeInput("890126201002");
            handleLookup("890126201002");
          }}
          className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold"
        >
          Bread (890126201002)
        </button>
        <button
          onClick={() => {
            setBarcodeInput("890126201003");
            handleLookup("890126201003");
          }}
          className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-mono font-bold"
        >
          Eggs (890126201003)
        </button>
      </div>

      {/* Camera Container */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center space-y-4">
        <div id="reader" className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 bg-slate-50" />
      </div>

      {/* Result Card */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {scannedProduct && (
        <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-md space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs">
            <CheckCircle className="w-4 h-4" /> Product Successfully Identified
          </div>

          <div className="flex items-start gap-4">
            <img
              src={scannedProduct.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
              alt={scannedProduct.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 bg-slate-50 shrink-0"
            />
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-black text-slate-900">{scannedProduct.name}</h3>
              <p className="text-xs text-slate-500 font-mono">SKU: {scannedProduct.sku} | Barcode: {scannedProduct.barcode}</p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-black text-emerald-700">₹{scannedProduct.sellingPrice}</span>
                <span className="text-xs text-slate-600 font-bold">Stock: {scannedProduct.quantity} units</span>
                <Badge status={scannedProduct.status} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => navigate(`/pos?add=${scannedProduct._id}`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" /> Add to POS Order
            </button>
            <button
              onClick={() => navigate(`/inventory?search=${scannedProduct.sku}`)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200"
            >
              View in Inventory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
