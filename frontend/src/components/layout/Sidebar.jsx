import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  MapPin,
  ClockAlert,
  FileBarChart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { unreadCount } = useData();

  const navItems = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/performance", label: "Postal Performance", icon: Building2 },
    { to: "/delivery-analytics", label: "Delivery Analytics", icon: TrendingUp },
    { to: "/offices", label: "Post Office Monitoring", icon: MapPin },
    { to: "/predictions", label: "Delay Predictions", icon: ClockAlert, badge: "AI" },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/notifications", label: "Notifications", icon: Bell, count: unreadCount },
    { to: "/settings", label: "Settings", icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a192f] text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
            <Send className="w-5 h-5 -rotate-12" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                PostPilot
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DISU
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                Department of Posts
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                } ${collapsed ? "justify-center px-2" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105`} />

              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}

              {!collapsed && item.count > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white min-w-4 text-center">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Division Badge */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200 truncate">
                Delhi South Div
              </span>
            </div>
            <p className="text-[10px] text-slate-400">PS #119 Command Center</p>
          </div>
        ) : (
          <div className="flex justify-center" title="New Delhi South Division">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-200 shrink-0 ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs h-full bg-[#0a192f] shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
