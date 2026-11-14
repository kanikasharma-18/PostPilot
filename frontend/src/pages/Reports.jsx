import React, { useState, useEffect } from "react";
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSpreadsheet
} from "lucide-react";
import { reportService } from "../services/reportService";
import { postalService } from "../services/postalService";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useData } from "../context/DataContext";
import { formatNumber, formatPercent } from "../utils/formatters";
import { exportToCSV, triggerPrint } from "../utils/exportUtils";
import { toast } from "sonner";

export default function Reports() {
  const { backendStatus } = useData();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("monthly");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [officesList, setOfficesList] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    async function init() {
      const res = await postalService.getOffices();
      setOfficesList(res.data);
      loadReport("monthly", "Last 30 Days", "all");
    }
    init();
  }, []);

  const loadReport = async (type = reportType, range = dateRange, office = selectedOffice) => {
    setLoading(true);
    try {
      const data = await reportService.generateReport({
        reportType: type,
        dateRange: range,
        officeId: office
      });
      setReportData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate analytical report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData?.tableData) return;
    const filename = `postpilot-${reportType}-report-${Date.now()}.csv`;
    exportToCSV(reportData.tableData, filename);
    toast.success("CSV report exported successfully");
  };

  const reportTypes = [
    { id: "daily", label: "Daily Operations Clearance", desc: "Day-end delivery beat audit" },
    { id: "weekly", label: "Weekly Delivery & SLA", desc: "Weekly throughput & latency breakdown" },
    { id: "monthly", label: "Monthly Governance Summary", desc: "Official monthly MIS performance review" },
    { id: "office-wise", label: "Office-Wise Comparative", desc: "Benchmarked performance by postal beat" },
    { id: "delay", label: "Delivery Delay Root-Cause", desc: "Bottleneck analytics & SLA exceptions" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Divisional Analytical Reports
            </h1>
            {!backendStatus.isLive && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Sample Demonstration Data
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Department of Posts MIS analytical report generation and compliance archives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={triggerPrint}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Configuration Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Report Template
          </label>
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              loadReport(e.target.value, dateRange, selectedOffice);
            }}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
          >
            {reportTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Evaluation Period
          </label>
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              loadReport(reportType, e.target.value, selectedOffice);
            }}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Postal Beat Scope
          </label>
          <select
            value={selectedOffice}
            onChange={(e) => {
              setSelectedOffice(e.target.value);
              loadReport(reportType, dateRange, e.target.value);
            }}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
          >
            <option value="all">All Division Offices (28 Monitored)</option>
            {officesList.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generated Report Document Paper View */}
      {loading ? (
        <LoadingSkeleton rows={12} />
      ) : reportData ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Official Document Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                Department of Posts • Government of India
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {reportData.metadata.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Division: <strong className="text-slate-800">{reportData.metadata.division}</strong> • Period: {reportData.metadata.dateRange}
              </p>
            </div>

            <div className="text-left md:text-right text-[11px] text-slate-500 font-mono space-y-0.5">
              <div>Report ID: <strong className="text-slate-800">{reportData.metadata.reportId}</strong></div>
              <div>Generated: {new Date(reportData.metadata.generatedAt).toLocaleString("en-IN")}</div>
              <div>Authority: {reportData.metadata.generatedBy}</div>
            </div>
          </div>

          {/* Key Executive Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Handled</span>
              <span className="text-lg font-bold text-slate-900">{formatNumber(reportData.summary.totalParcels)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Delivered</span>
              <span className="text-lg font-bold text-emerald-600">{formatNumber(reportData.summary.delivered)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pending</span>
              <span className="text-lg font-bold text-amber-600">{formatNumber(reportData.summary.pending)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Delayed</span>
              <span className="text-lg font-bold text-rose-600">{formatNumber(reportData.summary.delayed)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Success Rate</span>
              <span className="text-lg font-bold text-blue-700">{reportData.summary.avgSuccess}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">SLA Compliance</span>
              <span className="text-lg font-bold text-teal-700">{reportData.summary.avgSla}%</span>
            </div>
          </div>

          {/* Key Analytical Findings */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              DISU Key Operational Findings
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-blue-950">
              {reportData.keyFindings.map((finding, index) => (
                <li key={index} className="leading-relaxed">
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Data Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">Office Code</th>
                  <th className="px-3 py-2.5">Office Name</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5 text-right">Handled</th>
                  <th className="px-3 py-2.5 text-right">Delivered</th>
                  <th className="px-3 py-2.5 text-right">Delayed</th>
                  <th className="px-3 py-2.5 text-right">Success %</th>
                  <th className="px-3 py-2.5 text-right">SLA %</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">
                      {row["Office Code"]}
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-800">
                      {row["Office Name"]}
                    </td>
                    <td className="px-3 py-2 text-slate-500">
                      {row["Type"]}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatNumber(row["Total Parcels"])}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-emerald-600">
                      {formatNumber(row["Delivered"])}
                    </td>
                    <td className="px-3 py-2 text-right text-rose-600 font-medium">
                      {formatNumber(row["Delayed"])}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">
                      {row["Success Rate (%)"]}%
                    </td>
                    <td className="px-3 py-2 text-right text-blue-700 font-medium">
                      {row["SLA Compliance (%)"]}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Badge status={row["Status"]}>{row["Status"]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signoff Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end text-xs text-slate-500">
            <div>
              <p>Generated by PostPilot DISU Platform • Problem Statement #119</p>
              <p className="text-[10px] text-slate-400">Department of Posts, Ministry of Communications, New Delhi</p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <div className="w-36 border-b border-slate-300 pb-1 mb-1"></div>
              <span className="font-semibold text-slate-800">Divisional Postal Officer</span>
              <p className="text-[10px] text-slate-400">Authorized Signature & Seal</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
