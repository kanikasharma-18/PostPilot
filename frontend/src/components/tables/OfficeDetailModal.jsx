import React from "react";
import {
  Building2,
  MapPin,
  Phone,
  User,
  Users,
  Clock,
  TrendingUp,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  Calendar
} from "lucide-react";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatNumber } from "../../utils/formatters";

export default function OfficeDetailModal({ office, isOpen, onClose }) {
  if (!office) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={office.name}
      subtitle={`${office.type} • Department of Posts Code: ${office.code}`}
      maxWidth="max-w-3xl"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Inspection View
        </Button>
      }
    >
      <div className="space-y-6 text-xs">
        {/* Header Status & Key Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Operational Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Badge status={office.status}>{office.status} Performance</Badge>
              <span className="text-slate-600 font-semibold">{office.division} Division</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Overall Delivery Success
            </span>
            <span className="text-xl font-bold text-slate-900">{office.successRate}%</span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] uppercase font-semibold">Total Parcels</span>
            </div>
            <p className="text-base font-bold text-slate-900">{formatNumber(office.totalParcels)}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] uppercase font-semibold">Delivered</span>
            </div>
            <p className="text-base font-bold text-emerald-600">{formatNumber(office.delivered)}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] uppercase font-semibold">Pending</span>
            </div>
            <p className="text-base font-bold text-amber-600">{formatNumber(office.pending)}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-[10px] uppercase font-semibold">Delayed</span>
            </div>
            <p className="text-base font-bold text-rose-600">{formatNumber(office.delayed)}</p>
          </div>
        </div>

        {/* Operational & Administrative Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Facility & Location
            </h4>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{office.location} (PIN: {office.pincode})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{office.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Avg Turnaround: <strong className="text-slate-800">{office.avgDeliveryTime}</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Staffing & Beat Deployment
            </h4>
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>In-Charge: <strong className="text-slate-800">{office.supervisor}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Total Sanctioned Staff: {office.staffCount} personnel</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Active Delivery Beats: <strong className="text-emerald-700">{office.deliveryAgents} Postmen/GDS</strong></span>
            </div>
          </div>
        </div>

        {/* SLA & DISU Directive note */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-blue-900">SLA Compliance Index</span>
            <span className="font-bold text-blue-700">{office.slaCompliance}%</span>
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, office.slaCompliance)}%` }}
            />
          </div>
          <p className="text-[11px] text-blue-800 mt-2">
            Target SLA compliance benchmark: 95.0%. Daily clearance log updated every 4 hours.
          </p>
        </div>
      </div>
    </Modal>
  );
}
