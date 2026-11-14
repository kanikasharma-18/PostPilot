import React, { useState } from "react";
import { MapPin, Navigation, Info, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Badge from "../common/Badge";
import { formatNumber } from "../../utils/formatters";

export default function DivisionalMap({ offices = [], onSelectOffice }) {
  const [selectedPinId, setSelectedPinId] = useState(offices[0]?.id || null);
  const selectedPin = offices.find(office => office.id === selectedPinId) || offices[0] || null;
  const [viewMode, setViewMode] = useState("map"); // "map" or "table"

  // Relative coordinate projection inside SVG canvas (lat: 28.50 - 28.64, lon: 77.15 - 77.30)
  const minLat = 28.50;
  const maxLat = 28.64;
  const minLon = 77.15;
  const maxLon = 77.30;

  const project = (lat, lon) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 520 + 40;
    const y = 340 - ((lat - minLat) / (maxLat - minLat)) * 280 + 30;
    return { x: Math.max(30, Math.min(570, x)), y: Math.max(30, Math.min(370, y)) };
  };

  const getNodeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "optimal":
        return "#16a34a"; // emerald-600
      case "average":
        return "#f59e0b"; // amber-500
      case "critical":
        return "#dc2626"; // rose-600
      default:
        return "#64748b";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">
            Delhi South Postal Division Geolocation Matrix
          </span>
          <span className="text-[11px] text-slate-400">
            ({offices.length} Monitored Nodes)
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "map"
                ? "bg-white text-blue-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tactical Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-white text-blue-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Location Table
          </button>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* SVG Map Canvas */}
          <div className="lg:col-span-2 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner p-3 min-h-[360px] flex items-center justify-center">
            {/* Background grid lines */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-auto select-none"
              style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
            >
              <defs>
                <pattern
                  id="gridPattern"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="0.75"
                  />
                </pattern>
                {/* Radar pulse animation */}
                <radialGradient id="pulseGlow">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="600" height="400" fill="#090d16" />
              <rect width="600" height="400" fill="url(#gridPattern)" />

              {/* Division Boundaries & Transport Corridors */}
              <path
                d="M 60,60 L 220,40 L 440,80 L 540,160 L 530,320 L 380,360 L 160,340 L 70,240 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />

              {/* Ring Road and Major Logistics Arterials */}
              <path
                d="M 120,90 Q 280,110 460,130"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2"
                opacity="0.6"
              />
              <path
                d="M 180,60 Q 260,200 320,340"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2"
                opacity="0.6"
              />
              <path
                d="M 300,100 L 490,280"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2"
                opacity="0.6"
              />

              {/* Post Office Nodes */}
              {offices.map((office) => {
                const { x, y } = project(office.latitude, office.longitude);
                const isSelected = selectedPin?.id === office.id;
                const nodeColor = getNodeColor(office.status);

                return (
                  <g
                    key={office.id}
                    onClick={() => {
                      setSelectedPinId(office.id);
                      if (onSelectOffice) onSelectOffice(office);
                    }}
                    className="cursor-pointer transition-transform duration-150"
                  >
                    {/* Pulsing ring for selected node */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="18"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Node shadow/glow */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "11" : "8"}
                      fill={nodeColor}
                      opacity={isSelected ? "1" : "0.9"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />

                    {/* Small inner dot */}
                    <circle cx={x} cy={y} r="2.5" fill="#ffffff" />

                    {/* Label */}
                    <text
                      x={x + 12}
                      y={y + 4}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight={isSelected ? "bold" : "500"}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {office.code.replace("DEL-", "")}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tactical Legend overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center gap-3 text-[10px] text-slate-300 backdrop-blur-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Optimal (&gt;93%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Average (88-92%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Critical (&lt;88%)
              </span>
            </div>
          </div>

          {/* Active Node Detail Card */}
          {selectedPin ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <Badge status={selectedPin.status}>
                    {selectedPin.status} Performance
                  </Badge>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {selectedPin.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedPin.code} • PIN {selectedPin.pincode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Success Rate
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedPin.successRate}%
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    SLA Compliance
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    {selectedPin.slaCompliance}%
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Parcels Handled
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatNumber(selectedPin.totalParcels)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Delayed Parcels
                  </span>
                  <span className="text-sm font-semibold text-rose-600">
                    {formatNumber(selectedPin.delayed)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Supervisor:</span>
                  <span className="font-medium text-slate-800">{selectedPin.supervisor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Beats:</span>
                  <span className="font-medium text-slate-800">{selectedPin.deliveryAgents} active agents</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Transit Time:</span>
                  <span className="font-medium text-slate-800">{selectedPin.avgDeliveryTime}</span>
                </div>
              </div>

              {onSelectOffice && (
                <button
                  type="button"
                  onClick={() => onSelectOffice(selectedPin)}
                  className="w-full mt-2 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Inspect Office Clearance Matrix <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Select any node on the map to inspect details
            </div>
          )}
        </div>
      ) : (
        /* Location Table Fallback View */
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-4 py-3">Post Office Name</th>
                <th className="px-3 py-3">Code</th>
                <th className="px-3 py-3">PIN Code</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Parcels</th>
                <th className="px-3 py-3">Delivered</th>
                <th className="px-3 py-3">Success Rate</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offices.map((office) => (
                <tr
                  key={office.id}
                  onClick={() => onSelectOffice && onSelectOffice(office)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {office.name}
                  </td>
                  <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">
                    {office.code}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{office.pincode}</td>
                  <td className="px-3 py-3 text-slate-500">{office.type}</td>
                  <td className="px-3 py-3 font-medium text-slate-800">
                    {formatNumber(office.totalParcels)}
                  </td>
                  <td className="px-3 py-3 font-medium text-emerald-600">
                    {formatNumber(office.delivered)}
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-900">
                    {office.successRate}%
                  </td>
                  <td className="px-3 py-3">
                    <Badge status={office.status}>{office.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
