import React from "react";
import { FileSpreadsheet, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export const ReportsPage: React.FC = () => {
  const handleExportCsv = async () => {
    try {
      const response = await api.get("/reports/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `smartstock_inventory_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert("Failed to export report CSV.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Compliance & Store Intelligence
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reports & CSV Export</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Download store inventory valuation, waste audit metrics, and supplier performance summaries in CSV format.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Master CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-black text-base text-slate-900">Inventory Valuation & SKU Report</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Contains all registered SKUs, stock counts, cost prices, target sales margins, supplier mapping, and current status flags.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-black text-base text-slate-900">Waste Salvage & Expiry Audit</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Detailed tracking of revenue salvaged through AI dynamic markdowns vs unrecoverable damaged or expired stock loss.
          </p>
        </div>
      </div>
    </div>
  );
};
