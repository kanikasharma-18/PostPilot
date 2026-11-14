import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none";

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5"
  };

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs focus:ring-blue-500",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs focus:ring-slate-400",
    outline:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-300",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus:ring-rose-500",
    ghost:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 focus:ring-slate-300",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
