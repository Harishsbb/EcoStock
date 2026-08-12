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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Store Analytics & Compliance
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reports & CSV Export</h2>
          <p className="text-xs text-slate-400 mt-1">Generate comprehensive inventory valuation, waste audit, and sales reports.</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV Master Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <h3 className="font-extrabold text-base text-white">Full Inventory Valuation Report</h3>
          <p className="text-xs text-slate-400">Includes all SKUs, quantities, purchase costs, selling prices, supplier associations, and status indicators.</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <ShieldCheck className="w-8 h-8 text-sky-400" />
          <h3 className="font-extrabold text-base text-white">Waste & Expiry Recovery Audit</h3>
          <p className="text-xs text-slate-400">Detailed breakdown of recovered revenue via smart discounts versus actual discarded stock value loss.</p>
        </div>
      </div>
    </div>
  );
};
