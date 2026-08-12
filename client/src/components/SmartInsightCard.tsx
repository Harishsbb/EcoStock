import React from "react";
import { ArrowRight, AlertTriangle, Clock, TrendingUp, Sparkles } from "lucide-react";
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
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case "expiry":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "supplier":
        return <TrendingUp className="w-5 h-5 text-sky-400" />;
      case "waste":
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getBorder = () => {
    switch (type) {
      case "prediction":
        return "border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-slate-900/60";
      case "expiry":
        return "border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-slate-900/60";
      case "supplier":
        return "border-sky-500/20 hover:border-sky-500/40 bg-gradient-to-br from-sky-950/20 to-slate-900/60";
      case "waste":
        return "border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-slate-900/60";
    }
  };

  return (
    <div className={`p-5 rounded-2xl border ${getBorder()} backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
            {getIcon()}
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        </div>
        {badge && (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1 duration-200"
      >
        {actionText}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
