import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { MOCK_POST_OFFICES } from "../../data/mockData";
import { toast } from "sonner";

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, backendStatus, checkBackend, globalSearch, setGlobalSearch } = useData();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [testingBackend, setTestingBackend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTestBackend = async () => {
    setTestingBackend(true);
    const isLive = await checkBackend();
    setTestingBackend(false);
    if (isLive) {
      toast.success("Connected to live backend API at " + backendStatus.url);
    } else {
      toast.info("Backend is in high-fidelity demonstration mode (FastAPI/Node not currently listening on " + backendStatus.url + ")");
    }
  };

  const searchResults = globalSearch.trim().length > 1
    ? MOCK_POST_OFFICES.filter(
        o =>
          o.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          o.code.toLowerCase().includes(globalSearch.toLowerCase()) ||
          o.pincode.includes(globalSearch)
      ).slice(0, 5)
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search post offices, PIN codes, reports..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Search Popover */}
          {searchOpen && searchResults.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setSearchOpen(false)}
              />
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Post Offices
                </div>
                {searchResults.map((office) => (
                  <button
                    key={office.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setGlobalSearch("");
                      navigate(`/offices?search=${encodeURIComponent(office.code)}`);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{office.name}</div>
                      <div className="text-[11px] text-slate-500">{office.code} • PIN: {office.pincode}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {office.successRate}% Success
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Date Time Display */}
        <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
          <span className="text-xs font-semibold text-slate-700">{currentTime || "Loading..."}</span>
          <span className="text-[10px] text-slate-400">Indian Standard Time (IST)</span>
        </div>

        {/* Backend Status Pill */}
        <button
          onClick={handleTestBackend}
          disabled={testingBackend}
          title="Click to re-ping backend API"
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-all ${
            backendStatus.isLive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          }`}
        >
          {testingBackend ? (
            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
          ) : backendStatus.isLive ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <Activity className="w-3 h-3 text-blue-600" />
          )}
          <span>{backendStatus.isLive ? "Live API Connected" : "Demo Data Mode"}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Notifications ({unreadCount} unread)
                  </span>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifOpen(false);
                        navigate("/notifications");
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-900 truncate">
                        {n.title}
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {n.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              RK
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || "Rajesh Kumar, IPoS"}
              </span>
              <span className="text-[10px] text-slate-500">
                {user?.role || "Divisional Officer"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.designation}</p>
                  <p className="text-[10px] text-blue-600 font-medium mt-0.5">{user?.division}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Officer Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      toast.info("Switched view to South Delhi Division context.");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Postal Sub-Division</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate("/login");
                      toast.success("Logged out successfully");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
