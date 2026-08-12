import React from "react";
import { ArrowRight, AlertTriangle, Clock, TrendingUp, Sparkles, ShieldAlert, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export interface SmartInsightProps {
  type: "prediction" | "expiry" | "supplier" | "waste";
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  badge?: string;
}

export const SmartInsightCard: React.FC<SmartInsightProps> = ({
  type,
  title,
  description,
  actionText,
  actionLink,
  badge,
}) => {
  const getIcon = () => {
    switch (type) {
      case "prediction":
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case "expiry":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "supplier":
        return <TrendingUp className="w-5 h-5 text-sky-600" />;
      case "waste":
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getStyle = () => {
    switch (type) {
      case "prediction":
        return {
          bg: "bg-gradient-to-br from-rose-50/70 via-white to-white",
          border: "border-rose-200/90 hover:border-rose-400/80",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
          iconBg: "bg-rose-100/80",
          btnColor: "text-rose-700 hover:text-rose-800",
        };
      case "expiry":
        return {
          bg: "bg-gradient-to-br from-amber-50/70 via-white to-white",
          border: "border-amber-200/90 hover:border-amber-400/80",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
          iconBg: "bg-amber-100/80",
          btnColor: "text-amber-700 hover:text-amber-800",
        };
      case "supplier":
        return {
          bg: "bg-gradient-to-br from-sky-50/70 via-white to-white",
          border: "border-sky-200/90 hover:border-sky-400/80",
          badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
          iconBg: "bg-sky-100/80",
          btnColor: "text-sky-700 hover:text-sky-800",
        };
      case "waste":
        return {
          bg: "bg-gradient-to-br from-emerald-50/70 via-white to-white",
          border: "border-emerald-200/90 hover:border-emerald-400/80",
          badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
          iconBg: "bg-emerald-100/80",
          btnColor: "text-emerald-700 hover:text-emerald-800",
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`p-5 rounded-2xl border ${style.border} ${style.bg} transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${style.iconBg} shadow-2xs`}>
              {getIcon()}
            </div>
            <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{title}</h4>
          </div>
          {badge && (
            <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full border shadow-2xs ${style.badgeClass}`}>
              {badge}
            </span>
          )}
        </div>

        <p className="text-slate-600 text-xs mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      <Link
        to={actionLink}
        className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.btnColor} transition-colors group-hover:translate-x-1 duration-200 pt-2 border-t border-slate-100`}
      >
        <span>{actionText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
