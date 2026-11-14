import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers
} from "lucide-react";
import { postalService } from "../services/postalService";
import OfficeMonitoringTable from "../components/tables/OfficeMonitoringTable";
import OfficeDetailModal from "../components/tables/OfficeDetailModal";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useData } from "../context/DataContext";
import { toast } from "sonner";

export default function PostOfficeMonitoring() {
  const { backendStatus } = useData();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState([]);
  const [inspectedOffice, setInspectedOffice] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add Office
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Sub Post Office (SO)",
    pincode: "",
    location: "",
    status: "Optimal",
    totalParcels: 10000,
    delivered: 9500,
    pending: 350,
    delayed: 150,
    successRate: 95.0,
    supervisor: "",
    contactNumber: "+91 11 2000 0000"
  });

  const loadOffices = async () => {
    setLoading(true);
    try {
      const res = await postalService.getOffices();
      setOffices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load post offices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffices();
  }, []);

  const handleCreateOffice = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Office code and name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await postalService.createOffice(formData);
      toast.success(
        res.savedToBackend
          ? "Office created and saved to PostgreSQL backend!"
          : "Office registered in local demonstration directory."
      );
      setAddModalOpen(false);
      setFormData({
        code: "",
        name: "",
        type: "Sub Post Office (SO)",
        pincode: "",
        location: "",
        status: "Optimal",
        totalParcels: 10000,
        delivered: 9500,
        pending: 350,
        delayed: 150,
        successRate: 95.0,
        supervisor: "",
        contactNumber: "+91 11 2000 0000"
      });
      await loadOffices();
    } catch (err) {
      toast.error("Failed to register office: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-white rounded-xl border border-slate-200 animate-pulse" />
        <LoadingSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Post Office Network Monitoring
            </h1>
            {!backendStatus.isLive && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Sample Demonstration Data
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Active divisional clearance matrix, operational volume thresholds, and beat supervisory records.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <OfficeMonitoringTable
        offices={offices}
        onInspectOffice={(office) => setInspectedOffice(office)}
        onAddNewOffice={() => setAddModalOpen(true)}
        initialSearch={initialSearch}
      />

      {/* Detail Inspection Modal */}
      <OfficeDetailModal
        office={inspectedOffice}
        isOpen={!!inspectedOffice}
        onClose={() => setInspectedOffice(null)}
      />

      {/* Add New Office Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Register New Post Office"
          subtitle="Add an administrative post office node to New Delhi South Division"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={isSubmitting}
                onClick={handleCreateOffice}
              >
                Register Post Office
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateOffice} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Office Code (e.g. DEL-SO-110049) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="DEL-SO-110049"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Office Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Green Park Sub Post Office"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Office Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="Head Post Office (HPO)">Head Post Office (HPO)</option>
                  <option value="Sub Post Office (SO)">Sub Post Office (SO)</option>
                  <option value="Branch Post Office (BO)">Branch Post Office (BO)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  6-Digit Postal PIN Code
                </label>
                <input
                  type="text"
                  placeholder="110016"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Physical Location & Beat Area
                </label>
                <input
                  type="text"
                  placeholder="Main Market, Green Park, South Delhi"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Postmaster / Supervisor
                </label>
                <input
                  type="text"
                  placeholder="K. L. Sharma, Sub-Postmaster"
                  value={formData.supervisor}
                  onChange={(e) =>
                    setFormData({ ...formData, supervisor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Performance Classification
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="Optimal">Optimal (&gt;93% clearance)</option>
                  <option value="Average">Average (88-92%)</option>
                  <option value="Critical">Critical (&lt;88%)</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
