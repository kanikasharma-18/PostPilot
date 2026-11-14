import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  Timer,
  Calendar,
  Layers
} from "lucide-react";
import { useData } from "../context/DataContext";
import { analyticsService } from "../services/analyticsService";
import KpiCard from "../components/dashboard/KpiCard";
import Card from "../components/common/Card";
import DateRangePicker from "../components/common/DateRangePicker";
import DeliveryTrendChart from "../components/charts/DeliveryTrendChart";
import MonthlyParcelChart from "../components/charts/MonthlyParcelChart";
import StatusDistributionChart from "../components/charts/StatusDistributionChart";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
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

const SERVICE_TYPE_DATA = [
  { service: "Speed Post", avgHours: 19.4, slaRate: 96.8, volume: 92400 },
  { service: "Business Parcel", avgHours: 32.1, slaRate: 91.2, volume: 48900 },
  { service: "Registered Post", avgHours: 27.5, slaRate: 94.1, volume: 44200 },
  { service: "Express Cargo", avgHours: 16.2, slaRate: 98.4, volume: 24200 }
];

export default function DeliveryAnalytics() {
  const { selectedRange, backendStatus } = useData();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [activeServiceFilter, setActiveServiceFilter] = useState("All");

  useEffect(() => {
    loadAnalytics();
  }, [selectedRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [kpiRes, trendsRes, monthlyRes, distRes] = await Promise.all([
        analyticsService.getKPIs(selectedRange),
        analyticsService.getDeliveryTrends(),
        analyticsService.getMonthlyStats(),
        analyticsService.getStatusDistribution()
      ]);
      setKpis(kpiRes.data);
      setTrends(trendsRes.data);
      setMonthlyStats(monthlyRes.data);
      setDistribution(distRes.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-14 bg-white rounded-xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Delivery Operations Analytics
            </h1>
            {!backendStatus.isLive && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Sample Demonstration Data
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Turnaround latency, first-attempt completion ratios, and logistics channel efficiency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker />
        </div>
      </div>

      {/* Primary KPI Metrics */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <KpiCard
            title="Total Handled"
            value={kpis.totalParcels?.value || 0}
            change={kpis.totalParcels?.change}
            trend={kpis.totalParcels?.trend}
            icon={Package}
            iconColor="text-blue-600 bg-blue-50 border-blue-200"
          />

          <KpiCard
            title="Delivered"
            value={kpis.successfulDeliveries?.value || 0}
            change={kpis.successfulDeliveries?.change}
            trend={kpis.successfulDeliveries?.trend}
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
          />

          <KpiCard
            title="Pending Beats"
            value={kpis.pendingDeliveries?.value || 0}
            change={kpis.pendingDeliveries?.change}
            trend={kpis.pendingDeliveries?.trend}
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50 border-amber-200"
          />

          <KpiCard
            title="SLA Breached"
            value={kpis.delayedDeliveries?.value || 0}
            change={kpis.delayedDeliveries?.change}
            trend={kpis.delayedDeliveries?.trend}
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50 border-rose-200"
          />

          <KpiCard
            title="Avg Transit Time"
            value="24.8 hrs"
            change="-1.2 hrs"
            trend="down"
            icon={Timer}
            iconColor="text-indigo-600 bg-indigo-50 border-indigo-200"
          />

          <KpiCard
            title="First-Attempt Rate"
            value="89.4"
            isPercent={true}
            change="+1.1%"
            trend="up"
            icon={Truck}
            iconColor="text-teal-600 bg-teal-50 border-teal-200"
          />
        </div>
      )}

      {/* Main Trends and Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Delivery Volume & Delay Trend"
            subtitle="Daily clearance progression across all delivery beats"
          >
            <DeliveryTrendChart data={trends} height={300} />
          </Card>
        </div>

        <Card
          title="Delivery Clearance Ratio"
          subtitle="Proportional split of current consignment states"
        >
          <StatusDistributionChart data={distribution} height={300} />
        </Card>
      </div>

      {/* Service-Type Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Average Delivery Transit Latency by Service Type"
          subtitle="Hours elapsed from hub receipt to doorstep delivery"
        >
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SERVICE_TYPE_DATA}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="service"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip
                  formatter={(val) => [`${val} hrs`, "Average Transit Time"]}
                  contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
                />
                <Bar
                  dataKey="avgHours"
                  name="Transit Hours"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Monthly Parcel Processing Volume"
          subtitle="Received vs Dispatched vs Doorstep Delivered (Monthly Aggregates)"
        >
          <MonthlyParcelChart data={monthlyStats} height={280} />
        </Card>
      </div>
    </div>
  );
}
