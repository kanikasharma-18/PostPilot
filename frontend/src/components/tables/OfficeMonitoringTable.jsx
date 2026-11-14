import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus
} from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { formatNumber } from "../../utils/formatters";
import { exportToCSV } from "../../utils/exportUtils";

export default function OfficeMonitoringTable({
  offices = [],
  onInspectOffice,
  onAddNewOffice,
  initialSearch = ""
}) {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("totalParcels");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchSearch =
        office.name.toLowerCase().includes(search.toLowerCase()) ||
        office.code.toLowerCase().includes(search.toLowerCase()) ||
        office.pincode.includes(search) ||
        office.location.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        office.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [offices, search, statusFilter]);

  const sortedOffices = useMemo(() => {
    return [...filteredOffices].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredOffices, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedOffices.length / pageSize) || 1;
  const paginatedOffices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOffices.slice(start, start + pageSize);
  }, [sortedOffices, currentPage, pageSize]);

  const handleExport = () => {
    const exportData = sortedOffices.map((o) => ({
      "Office ID": o.id,
      "Code": o.code,
      "Name": o.name,
      "Division": o.division,
      "PIN Code": o.pincode,
      "Location": o.location,
      "Total Parcels": o.totalParcels,
      "Delivered": o.delivered,
      "Pending": o.pending,
      "Delayed": o.delayed,
      "Success Rate (%)": o.successRate,
      "Status": o.status
    }));
    exportToCSV(exportData, "postpilot-post-offices.csv");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search office name, code, PIN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            {["All", "Optimal", "Average", "Critical"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onAddNewOffice && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onAddNewOffice}
            >
              Add Office
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      {paginatedOffices.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="No matching post offices"
            description="Try adjusting your search criteria or resetting status filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th
                  onClick={() => handleSort("code")}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Office ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Post Office Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 hidden md:table-cell">Division</th>
                <th className="px-3 py-3 hidden lg:table-cell">Location</th>
                <th
                  onClick={() => handleSort("totalParcels")}
                  className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("delivered")}
                  className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Delivered</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 text-right hidden sm:table-cell">Pending</th>
                <th className="px-3 py-3 text-right hidden sm:table-cell">Delayed</th>
                <th
                  onClick={() => handleSort("successRate")}
                  className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Success %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOffices.map((office) => (
                <tr
                  key={office.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                    {office.code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{office.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      PIN: {office.pincode} • {office.type?.split(" ")[0]}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 hidden md:table-cell">
                    {office.division}
                  </td>
                  <td className="px-3 py-3 text-slate-500 hidden lg:table-cell truncate max-w-xs">
                    {office.location}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-800">
                    {formatNumber(office.totalParcels)}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-emerald-600">
                    {formatNumber(office.delivered)}
                  </td>
                  <td className="px-3 py-3 text-right text-amber-600 hidden sm:table-cell">
                    {formatNumber(office.pending)}
                  </td>
                  <td className="px-3 py-3 text-right text-rose-600 font-semibold hidden sm:table-cell">
                    {formatNumber(office.delayed)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900">
                    {office.successRate}%
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge status={office.status}>{office.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onInspectOffice(office)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Inspect office clearance matrix"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing{" "}
          <strong className="text-slate-700">
            {sortedOffices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-700">
            {Math.min(currentPage * pageSize, sortedOffices.length)}
          </strong>{" "}
          of <strong className="text-slate-700">{sortedOffices.length}</strong> post offices
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
