import React from "react";
import { ArrowUpRight, ArrowDownRight, AlertCircle, Minus } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

export default function KpiCard({
  title,
  value,
  change,
  trend = "up",
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600 bg-blue-50 border-blue-100",
  isPercent = false
}) {
  const getTrendStyle = () => {
    switch (trend) {
      case "up":
        return {
          icon: ArrowUpRight,
          class: "text-emerald-700 bg-emerald-50 border-emerald-200"
        };
      case "down":
        return {
          icon: ArrowDownRight,
          class: "text-emerald-700 bg-emerald-50 border-emerald-200"
        };
      case "alert":
        return {
          icon: AlertCircle,
          class: "text-rose-700 bg-rose-50 border-rose-200 font-semibold"
        };
      case "neutral":
      default:
        return {
          icon: Minus,
          class: "text-slate-600 bg-slate-50 border-slate-200"
        };
    }
  };

  const trendConfig = getTrendStyle();
  const TrendIcon = trendConfig.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          {isPercent ? `${value}%` : formatNumber(value)}
        </div>

        {change && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${trendConfig.class}`}
          >
            <TrendIcon className="w-3 h-3" />
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-2 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
