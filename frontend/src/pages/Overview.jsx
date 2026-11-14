import React, { useState, useEffect } from "react";
import {
  Building2,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { analyticsService } from "../services/analyticsService";
import { postalService } from "../services/postalService";
import KpiCard from "../components/dashboard/KpiCard";
import DeliveryTrendChart from "../components/charts/DeliveryTrendChart";
import MonthlyParcelChart from "../components/charts/MonthlyParcelChart";
import OfficePerformanceChart from "../components/charts/OfficePerformanceChart";
import StatusDistributionChart from "../components/charts/StatusDistributionChart";
import DivisionalMap from "../components/dashboard/DivisionalMap";
import AlertsList from "../components/dashboard/AlertsList";
import TopOfficesList from "../components/dashboard/TopOfficesList";
import DateRangePicker from "../components/common/DateRangePicker";
import OfficeDetailModal from "../components/tables/OfficeDetailModal";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { toast } from "sonner";

export default function Overview() {
  const { user } = useAuth();
  const { selectedRange, backendStatus } = useData();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [offices, setOffices] = useState([]);
  const [rankings, setRankings] = useState({ top: [], needsAttention: [] });
  const [inspectedOffice, setInspectedOffice] = useState(null);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [
        kpiRes,
        trendsRes,
        monthlyRes,
        distRes,
        alertsRes,
        officesRes,
        rankingsRes
      ] = await Promise.all([
        analyticsService.getKPIs(selectedRange),
        analyticsService.getDeliveryTrends(),
        analyticsService.getMonthlyStats(),
        analyticsService.getStatusDistribution(),
        analyticsService.getCriticalAlerts(),
        postalService.getOffices(),
        analyticsService.getOfficeRankings()
      ]);

      setKpis(kpiRes.data);
      setTrends(trendsRes.data);
      setMonthlyStats(monthlyRes.data);
      setDistribution(distRes.data);
      setAlerts(alertsRes.data);
      setOffices(officesRes.data);
      setRankings(rankingsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedRange]);

  const handleManualRefresh = () => {
    loadData(true);
    toast.success("Dashboard metrics refreshed");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* A. Welcome Banner & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Good Morning, {user?.role || "Divisional Officer"}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              DoP DISU #119
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Here is your postal network performance overview for{" "}
            <strong className="text-slate-700">{user?.division || "New Delhi South Division"}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <DateRangePicker />
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={refreshing}
            onClick={handleManualRefresh}
            title="Refresh operational telemetry"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Demonstration Data Banner if backend is disconnected */}
      {!backendStatus.isLive && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demonstration Dataset Active:</strong> Real-world operational schema simulating 28 post offices in New Delhi South Division. Seamlessly connects to FastAPI once live.
            </span>
          </div>
        </div>
      )}

      {/* B. Six Primary KPI Cards */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Divisional Key Performance Indicators (KPIs)
        </h2>
        {!backendStatus.isLive && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Sample Demonstration Data
          </span>
        )}
      </div>

      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <KpiCard
            title="Total Offices"
            value={kpis.totalOffices?.value || 28}
            change={kpis.totalOffices?.change}
            trend={kpis.totalOffices?.trend}
            subtitle={`${kpis.totalOffices?.active || 27} active beats`}
            icon={Building2}
            iconColor="text-blue-600 bg-blue-50 border-blue-200"
          />

          <KpiCard
            title="Total Parcels"
            value={kpis.totalParcels?.value || 0}
            change={kpis.totalParcels?.change}
            trend={kpis.totalParcels?.trend}
            subtitle={kpis.totalParcels?.label || "Handled"}
            icon={Package}
            iconColor="text-indigo-600 bg-indigo-50 border-indigo-200"
          />

          <KpiCard
            title="Delivered"
            value={kpis.successfulDeliveries?.value || 0}
            change={kpis.successfulDeliveries?.change}
            trend={kpis.successfulDeliveries?.trend}
            subtitle="Completed beats"
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
          />

          <KpiCard
            title="Pending"
            value={kpis.pendingDeliveries?.value || 0}
            change={kpis.pendingDeliveries?.change}
            trend={kpis.pendingDeliveries?.trend}
            subtitle="In sorting pipeline"
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50 border-amber-200"
          />

          <KpiCard
            title="Delayed"
            value={kpis.delayedDeliveries?.value || 0}
            change={kpis.delayedDeliveries?.change}
            trend={kpis.delayedDeliveries?.trend}
            subtitle="Breached SLA limit"
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50 border-rose-200"
          />

          <KpiCard
            title="Success Rate"
            value={kpis.overallSuccessRate?.value || 93.2}
            change={kpis.overallSuccessRate?.change}
            trend={kpis.overallSuccessRate?.trend}
            subtitle="Target: 95.0%"
            isPercent={true}
            icon={TrendingUp}
            iconColor="text-teal-600 bg-teal-50 border-teal-200"
          />
        </div>
      )}

      {/* C. Primary Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Delivery Performance Trend */}
        <Card
          title="Delivery Clearance Trend"
          subtitle="Daily volume breakdown of delivered, in-transit, and delayed consignments"
        >
          <DeliveryTrendChart data={trends} height={290} />
        </Card>

        {/* 2. Monthly Parcel Inflow & Dispatch */}
        <Card
          title="Monthly Parcel Throughput"
          subtitle="Monthly volume comparison: parcels received vs dispatched vs delivered"
        >
          <MonthlyParcelChart data={monthlyStats} height={290} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Post Office Performance Ranking */}
        <div className="lg:col-span-2">
          <Card
            title="Post Office Clearance Ranking"
            subtitle="Top performing delivery centers by successful SLA completion rate"
          >
            <OfficePerformanceChart
              data={rankings.top.concat(rankings.needsAttention.slice(0, 2))}
              height={280}
            />
          </Card>
        </div>

        {/* 4. Delivery Status Distribution */}
        <Card
          title="Consignment Status"
          subtitle="Proportional breakdown across division"
        >
          <StatusDistributionChart data={distribution} height={280} />
        </Card>
      </div>

      {/* D. Geographic Performance Overview (Tactical Map + Matrix) */}
      <Card
        title="Divisional Geospatial Command Matrix"
        subtitle="Live delivery status mapping of Head, Sub, and Branch Post Offices in South Delhi"
      >
        <DivisionalMap
          offices={offices}
          onSelectOffice={(office) => setInspectedOffice(office)}
        />
      </Card>

      {/* E. Critical Operational Alerts */}
      <Card
        title="Operational Alerts & SLA Exceptions"
        subtitle="Automated alerts requiring divisional officer intervention or beat reinforcement"
      >
        <AlertsList alerts={alerts} />
      </Card>

      {/* F. Top and Low Performing Offices */}
      <TopOfficesList
        topOffices={rankings.top}
        needsAttention={rankings.needsAttention}
        onSelectOffice={(office) => setInspectedOffice(office)}
      />

      {/* Detailed Inspection Modal */}
      <OfficeDetailModal
        office={inspectedOffice}
        isOpen={!!inspectedOffice}
        onClose={() => setInspectedOffice(null)}
      />
    </div>
  );
}
