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
  Sparkles,
  Zap,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  closeMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ closeMobileMenu }) => {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const navigationSections: { title: string; items: NavItem[] }[] = [
    {
      title: "Command Center",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Inventory", href: "/inventory", icon: Boxes },
        { name: "Products", href: "/products", icon: Package },
        { name: "Scan Product", href: "/scan", icon: QrCode },
        { name: "Sales / POS", href: "/pos", icon: ShoppingCart },
      ],
    },
    {
      title: "AI Intelligence",
      items: [
        { name: "Smart Discounts", href: "/discounts", icon: Percent, badge: "AI Dynamic" },
        { name: "Demand Forecast", href: "/forecast", icon: TrendingUp, badge: "Predictive" },
        { name: "Smart Reorder", href: "/reorders", icon: RefreshCw },
      ],
    },
    {
      title: "Eco & Surplus Network",
      items: [
        { name: "Waste & Eco Recovery", href: "/waste", icon: Leaf, highlight: true },
        { name: "Surplus Exchange", href: "/exchange", icon: Store },
        { name: "Suppliers", href: "/suppliers", icon: Truck },
        { name: "Customer Deals Feed", href: "/deals", icon: Tag },
      ],
    },
    ...(isOwner
      ? [
          {
            title: "Admin & Reports",
            items: [
              { name: "Reports & Export", href: "/reports", icon: FileSpreadsheet },
              { name: "Settings", href: "/settings", icon: Settings },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            EcoStock
            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
              Pro
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">Command & Intelligence</p>
        </div>
      </div>

      {/* Role & Store Banner */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
            {user?.shop?.name || "My Retail Store"}
          </span>
        </div>
        <span
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
            isOwner
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-sky-100 text-sky-800 border border-sky-200"
          }`}
        >
          {user?.role || "GUEST"}
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50/60 text-emerald-700 border border-emerald-200/80 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom User Info */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="truncate min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || "owner@smartstock.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
