import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { formatNumber } from "../../utils/formatters";

export default function MonthlyParcelChart({ data, height = 300 }) {
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
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
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
          <Bar
            dataKey="received"
            name="Parcels Received"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="dispatched"
            name="Dispatched"
            fill="#0284c7"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="delivered"
            name="Delivered"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
