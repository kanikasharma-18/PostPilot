import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { formatNumber, formatPercent } from "../../utils/formatters";

export default function StatusDistributionChart({ data, height = 300 }) {
  const total = (data || []).reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? (item.value / total) * 100 : 0;
      return (
        <div className="bg-white p-2.5 border border-slate-200 rounded-lg shadow-md text-xs">
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="font-medium text-slate-700 mt-0.5">
            {formatNumber(item.value)} parcels ({formatPercent(pct)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }} className="relative flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {(data || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
