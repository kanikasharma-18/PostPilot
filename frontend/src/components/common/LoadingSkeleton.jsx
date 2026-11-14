import React from "react";

export default function LoadingSkeleton({ rows = 4, className = "" }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
      <div className="h-8 bg-slate-100 rounded-md w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-slate-100 rounded-md flex-1" />
          <div className="h-4 bg-slate-100 rounded-md w-24" />
          <div className="h-4 bg-slate-100 rounded-md w-16" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="w-8 h-8 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/4" />
    </div>
  );
}
