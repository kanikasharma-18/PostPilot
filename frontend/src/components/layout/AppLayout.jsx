import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
