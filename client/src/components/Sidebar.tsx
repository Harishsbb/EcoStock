import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Boxes,
  Package,
  QrCode,
  ShoppingCart,
  Percent,
  TrendingUp,
  RefreshCw,
  Truck,
  Leaf,
  Store,
  Tag,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  closeMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ closeMobileMenu }) => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Boxes },
    { name: "Products", href: "/products", icon: Package },
    { name: "Scan Product", href: "/scan", icon: QrCode },
    { name: "Sales / POS", href: "/pos", icon: ShoppingCart },
    { name: "Smart Discounts", href: "/discounts", icon: Percent, badge: "AI" },
    { name: "Demand Forecast", href: "/forecast", icon: TrendingUp },
    { name: "Smart Reorder", href: "/reorders", icon: RefreshCw },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Waste & Eco", href: "/waste", icon: Leaf },
    { name: "Surplus Exchange", href: "/exchange", icon: Store },
    { name: "Customer Deals", href: "/deals", icon: Tag },
    ...(isOwner
      ? [
          { name: "Reports & Export", href: "/reports", icon: FileSpreadsheet },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Boxes className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
            SmartStock
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded uppercase font-bold">
              Pro
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">Predict. Prevent. Recover.</p>
        </div>
      </div>

      {/* Role Badge Banner */}
      <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 truncate max-w-[120px] font-medium">{user?.shop?.name || "My Store"}</span>
        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isOwner
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
          }`}
        >
          {user?.role || "GUEST"}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Footer User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || "user@smartstock.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
