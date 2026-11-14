import React from "react";
import { getStatusColor } from "../../utils/formatters";

export default function Badge({ children, status, variant, className = "" }) {
  const colorClass = status ? getStatusColor(status) : getVariantColor(variant);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {children}
    </span>
  );
}

function getVariantColor(variant) {
  switch (variant) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    case "danger":
    case "critical":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
    case "info":
    case "blue":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20";
  }
}
