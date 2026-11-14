import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { formatNumber } from "../../utils/formatters";

export default function DeliveryTrendChart({ data, height = 300 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
          <p className="font-semibold text-slate-800 border-b border-slate-100 pb-1">
            {label}
          </p>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}:
              </span>
              <span className="font-semibold text-slate-900">
                {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorInTransit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
          />
          <Area
            type="monotone"
            dataKey="delivered"
            name="Delivered"
            stroke="#16a34a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDelivered)"
          />
          <Area
            type="monotone"
            dataKey="inTransit"
            name="In Transit"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorInTransit)"
          />
          <Area
            type="monotone"
            dataKey="delayed"
            name="Delayed"
            stroke="#dc2626"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDelayed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
