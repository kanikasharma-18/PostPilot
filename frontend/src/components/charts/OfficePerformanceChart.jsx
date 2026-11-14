import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function OfficePerformanceChart({ data, height = 300 }) {
  const chartData = (data || []).map((o) => ({
    name: o.name.replace(" Sub Post Office", " SO").replace(" Head Post Office", " HPO").replace(" Branch Post Office", " BO"),
    successRate: o.successRate,
    parcels: o.totalParcels
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-2.5 border border-slate-200 rounded-lg shadow-md text-xs">
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-emerald-600 font-medium mt-0.5">
            Success Rate: {item.successRate}%
          </p>
          <p className="text-slate-500 text-[11px]">
            Volume: {new Intl.NumberFormat("en-IN").format(item.parcels)} parcels
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            domain={[75, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11, fill: "#334155" }}
            width={120}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="successRate"
            fill="#2563eb"
            radius={[0, 4, 4, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
