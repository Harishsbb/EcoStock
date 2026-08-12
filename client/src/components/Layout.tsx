import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { LayoutDashboard, Boxes, ShoppingCart, Tag, QrCode } from "lucide-react";

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-slate-900 h-full shadow-2xl z-50">
            <Sidebar closeMobileMenu={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-16 md:pb-0">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around z-40 px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? "text-emerald-400 font-bold" : "text-slate-400"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? "text-emerald-400 font-bold" : "text-slate-400"
            }`
          }
        >
          <Boxes className="w-5 h-5" />
          <span>Stock</span>
        </NavLink>

        <NavLink
          to="/scan"
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 -mt-6 border-4 border-slate-950 font-bold"
        >
          <QrCode className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/pos"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? "text-emerald-400 font-bold" : "text-slate-400"
            }`
          }
        >
          <ShoppingCart className="w-5 h-5" />
          <span>POS</span>
        </NavLink>

        <NavLink
          to="/deals"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? "text-emerald-400 font-bold" : "text-slate-400"
            }`
          }
        >
          <Tag className="w-5 h-5" />
          <span>Deals</span>
        </NavLink>
      </div>
    </div>
  );
};
