import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { LayoutDashboard, Boxes, ShoppingCart, Tag, QrCode } from "lucide-react";

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl z-50 border-r border-slate-200">
            <Sidebar closeMobileMenu={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 flex items-center justify-around z-40 px-2 shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Command</span>
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <Boxes className="w-5 h-5" />
          <span>Stock</span>
        </NavLink>

        <NavLink
          to="/scan"
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 -mt-6 border-4 border-slate-50 font-bold active:scale-95 transition-transform"
        >
          <QrCode className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/pos"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <ShoppingCart className="w-5 h-5" />
          <span>POS</span>
        </NavLink>

        <NavLink
          to="/deals"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
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
