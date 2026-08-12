import React from "react";

interface BadgeProps {
  status: "Healthy" | "Low Stock" | "Critical" | "Near Expiry" | "Expired" | string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  switch (status) {
    case "Healthy":
      return <span className="badge-healthy"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Healthy</span>;
    case "Low Stock":
      return <span className="badge-warning"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Low Stock</span>;
    case "Critical":
      return <span className="badge-critical"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Critical</span>;
    case "Near Expiry":
      return <span className="badge-warning"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>Near Expiry</span>;
    case "Expired":
      return <span className="badge-critical"><span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>Expired</span>;
    default:
      return <span className="badge-info">{status}</span>;
  }
};
