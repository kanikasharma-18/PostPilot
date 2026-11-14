import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Shield, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import { toast } from "sonner";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("rajesh.kumar");
  const [password, setPassword] = useState("••••••••••••");
  const [role, setRole] = useState("divisional_officer");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password, role });
      toast.success("Authentication successful. Welcome to PostPilot DISU.");
      navigate("/");
    } catch {
      toast.error("Authentication failed. Please check credentials.");
    }
  };

  const handleQuickRole = (selectedRole, defaultName) => {
    setRole(selectedRole);
    setUsername(defaultName);
    login({ username: defaultName, role: selectedRole }).then(() => {
      toast.success(`Authenticated as ${defaultName}`);
      navigate("/");
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Header Brand */}
        <div className="bg-[#0a192f] p-6 text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 mb-3">
            <Send className="w-6 h-6 -rotate-12" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">PostPilot DISU</h2>
          <p className="text-xs text-slate-400 mt-1">
            Department of Posts • Problem Statement #119
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Divisional Command & Analytics Portal
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Officer Service Account / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="rajesh.kumar@indiapost.gov.in"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password / Secure Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Administrative Role Context
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="divisional_officer">
                  Divisional Postal Officer (SSPO)
                </option>
                <option value="superintendent">
                  Assistant Superintendent (ASPO)
                </option>
                <option value="inspector">
                  Inspector of Posts (IP)
                </option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Access Command Center <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick-Access Evaluator Buttons */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
              Quick Evaluator Demo Login
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickRole("divisional_officer", "Rajesh Kumar, IPoS")
                }
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-800">
                    Rajesh Kumar, IPoS
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Divisional Postal Officer (Full Access)
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickRole("superintendent", "Pooja Sharma")
                }
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-800">
                    Pooja Sharma
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Assistant Superintendent of Posts
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Protected Government of India Information System
        </div>
      </div>
    </div>
  );
}
