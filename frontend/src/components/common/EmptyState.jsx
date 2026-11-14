import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no records matching your selected filters or search criteria.",
  actionLabel,
  onAction,
  className = ""
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-medium text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
