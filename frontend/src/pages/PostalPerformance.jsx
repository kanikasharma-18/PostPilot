import React, { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  Search
} from "lucide-react";
import { postalService } from "../services/postalService";
import OfficeMonitoringTable from "../components/tables/OfficeMonitoringTable";
import OfficeDetailModal from "../components/tables/OfficeDetailModal";
import Card from "../components/common/Card";
import KpiCard from "../components/dashboard/KpiCard";
import Button from "../components/common/Button";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { formatNumber } from "../utils/formatters";
import { useData } from "../context/DataContext";
import { toast } from "sonner";

export default function PostalPerformance() {
  const { backendStatus } = useData();
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState([]);
  const [inspectedOffice, setInspectedOffice] = useState(null);

  useEffect(() => {
    loadOffices();
  }, []);

  const loadOffices = async () => {
    setLoading(true);
    try {
      const res = await postalService.getOffices();
      setOffices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load postal performance data");
    } finally {
      setLoading(false);
    }
  };

  const totalOffices = offices.length;
  const activeOffices = offices.filter(o => o.active).length;
  const inactiveOffices = totalOffices - activeOffices;
  const totalParcels = offices.reduce((acc, o) => acc + o.totalParcels, 0);
  const totalDelivered = offices.reduce((acc, o) => acc + o.delivered, 0);
  const avgSuccessRate = totalParcels > 0
    ? ((totalDelivered / totalParcels) * 100).toFixed(1)
    : "0.0";
  const optimalCount = offices.filter(o => o.status === "Optimal").length;
  const criticalCount = offices.filter(o => o.status === "Critical").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-white rounded-xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Postal Performance Directory
            </h1>
            {!backendStatus.isLive && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Sample Demonstration Data
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Comprehensive operational audit and SLA evaluation across all divisional postal beats.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Post Offices"
          value={totalOffices}
          subtitle={`${activeOffices} Active, ${inactiveOffices} Inactive`}
          icon={Building2}
          iconColor="text-blue-600 bg-blue-50 border-blue-200"
        />

        <KpiCard
          title="Optimal SLA Clearance"
          value={optimalCount}
          subtitle={`${Math.round((optimalCount / totalOffices) * 100)}% of network`}
          trend="up"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />

        <KpiCard
          title="Critical Delay Risk"
          value={criticalCount}
          subtitle="Action directive issued"
          trend="alert"
          icon={AlertTriangle}
          iconColor="text-rose-600 bg-rose-50 border-rose-200"
        />

        <KpiCard
          title="Network Clearance Rate"
          value={avgSuccessRate}
          isPercent={true}
          subtitle="Target threshold: 95.0%"
          trend="up"
          icon={TrendingUp}
          iconColor="text-teal-600 bg-teal-50 border-teal-200"
        />
      </div>

      {/* Office Performance Table */}
      <OfficeMonitoringTable
        offices={offices}
        onInspectOffice={(office) => setInspectedOffice(office)}
      />

      {/* Detail Inspection Modal */}
      <OfficeDetailModal
        office={inspectedOffice}
        isOpen={!!inspectedOffice}
        onClose={() => setInspectedOffice(null)}
      />
    </div>
  );
}
