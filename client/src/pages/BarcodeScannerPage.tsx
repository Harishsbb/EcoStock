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
    // Initialize html5-qrcode scanner on mount if container element exists
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
        // quiet scan error callback
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6 text-emerald-400" /> Barcode & QR Scanner
        </h2>
        <p className="text-xs text-slate-400">Point your device camera at a product barcode or enter code manually.</p>
      </div>

      {/* Manual Search Bar fallback */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-2">
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Enter Barcode manually (e.g. 890126201001)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => handleLookup(barcodeInput)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Lookup
        </button>
      </div>

      {/* Sample Demo Barcodes Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium">Quick Demo Barcodes:</span>
        <button
          onClick={() => {
            setBarcodeInput("890126201001");
            handleLookup("890126201001");
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono"
        >
          Milk (890126201001)
        </button>
        <button
          onClick={() => {
            setBarcodeInput("890126201002");
            handleLookup("890126201002");
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono"
        >
          Bread (890126201002)
        </button>
        <button
          onClick={() => {
            setBarcodeInput("890126201003");
            handleLookup("890126201003");
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono"
        >
          Eggs (890126201003)
        </button>
      </div>

      {/* Camera View Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center space-y-4">
        <div id="reader" className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 bg-slate-950" />
      </div>

      {/* Result Card */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {scannedProduct && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle className="w-4 h-4" /> Product Found
          </div>

          <div className="flex items-start gap-4">
            <img
              src={scannedProduct.imageUrl}
              alt={scannedProduct.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-800 bg-slate-950"
            />
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-white">{scannedProduct.name}</h3>
              <p className="text-xs text-slate-400">SKU: {scannedProduct.sku} | Barcode: {scannedProduct.barcode}</p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-black text-emerald-400">₹{scannedProduct.sellingPrice}</span>
                <span className="text-xs text-slate-300 font-semibold">Stock: {scannedProduct.quantity} units</span>
                <Badge status={scannedProduct.status} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={() => navigate(`/pos?add=${scannedProduct._id}`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Add to POS Basket
            </button>
            <button
              onClick={() => navigate(`/inventory?search=${scannedProduct.sku}`)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700"
            >
              View in Inventory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
