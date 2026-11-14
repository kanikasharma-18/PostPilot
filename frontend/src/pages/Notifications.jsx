import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Filter
} from "lucide-react";
import { useData } from "../context/DataContext";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { toast } from "sonner";

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useData();

  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical Alerts" },
    { id: "warning", label: "Performance Warnings" },
    { id: "system", label: "System Updates" },
    { id: "delivery", label: "Delivery Updates" }
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === "all") return true;
    return n.type === activeCategory;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "delivery":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "system":
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Notification & Dispatch Centre
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Operational alerts, automated ML model triggers, and SLA threshold violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={() => {
                markAllAsRead();
                toast.success("All notifications marked as read");
              }}
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => {
                clearNotifications();
                toast.success("Notification center cleared");
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeCategory === c.id
                ? "bg-blue-600 text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications in this category"
          description="You are completely caught up with all operational dispatches."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.read ? "bg-blue-50/30" : "hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {notif.title}
                    </span>
                    <Badge variant={notif.type}>{notif.category}</Badge>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span>{notif.timestamp}</span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Navigate to Section <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-medium shrink-0 cursor-pointer"
                  title="Mark as read"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
