import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import Badge from "../common/Badge";
import { formatNumber, formatPercent } from "../../utils/formatters";

export default function TopOfficesList({ topOffices = [], needsAttention = [], onSelectOffice }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Performing Offices */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Top Performing Post Offices
              </h3>
              <p className="text-[11px] text-slate-500">Highest delivery clearance & SLA rate</p>
            </div>
          </div>
          <Link
            to="/performance"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {topOffices.map((office, idx) => (
            <div
              key={office.id || idx}
              onClick={() => onSelectOffice && onSelectOffice(office)}
              className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {office.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {office.code} • {office.type?.split(" ")[0]}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-emerald-600">
                  {office.successRate}%
                </span>
                <p className="text-[10px] text-slate-400">
                  {formatNumber(office.totalParcels)} parcels
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Attention Offices */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Needs Immediate Attention
              </h3>
              <p className="text-[11px] text-slate-500">Underperforming beats & delivery backlogs</p>
            </div>
          </div>
          <Link
            to="/offices"
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
          >
            Audit Matrix <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {needsAttention.map((office) => {
            const delayPct = office.totalParcels > 0
              ? ((office.delayed / office.totalParcels) * 100).toFixed(1)
              : "0.0";

            return (
              <div
                key={office.id}
                onClick={() => onSelectOffice && onSelectOffice(office)}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-rose-50/30 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">
                      {office.name}
                    </h4>
                    <Badge status={office.status}>{office.status}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {office.code} • {office.pending} pending articles
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-rose-600">
                    {delayPct}% Delayed
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Success: {office.successRate}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
