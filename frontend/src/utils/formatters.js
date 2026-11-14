/**
 * Formatting utilities for PostPilot DISU Platform
 */

export function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return new Intl.NumberFormat("en-IN").format(Number(val));
}

export function formatPercent(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return "0.0%";
  return `${Number(val).toFixed(decimals)}%`;
}

export function formatDate(dateString, options = {}) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  };
  return new Intl.DateTimeFormat("en-IN", defaultOptions).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "optimal":
    case "excellent":
    case "delivered":
    case "healthy":
    case "low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    case "average":
    case "moderate":
    case "in transit":
    case "medium":
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    case "critical":
    case "delayed":
    case "high":
    case "severe":
    case "poor":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
    case "pending":
    case "inactive":
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20";
  }
}
