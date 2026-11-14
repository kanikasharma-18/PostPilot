import React, { useState } from "react";
import { AlertCircle, AlertTriangle, Info, Clock, CheckCircle2, ChevronRight, X } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { toast } from "sonner";

export default function AlertsList({ alerts = [], onAlertDismiss }) {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dismissedIds, setDismissedIds] = useState([]);

  const activeAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  const handleAcknowledge = (alert) => {
    setDismissedIds(prev => [...prev, alert.id]);
    setSelectedAlert(null);
    toast.success(`Operational alert for ${alert.officeName} marked as acknowledged.`);
    if (onAlertDismiss) onAlertDismiss(alert.id);
  };

  const getAlertIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-3">
      {activeAlerts.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No Critical Alerts</p>
          <p className="text-[11px] text-slate-400">All divisional delivery nodes operating within standard parameters.</p>
        </div>
      ) : (
        activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              alert.severity === "Critical"
                ? "bg-rose-50/40 border-rose-200 hover:bg-rose-50/70"
                : "bg-amber-50/40 border-amber-200 hover:bg-amber-50/70"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge status={alert.severity}>{alert.severity}</Badge>
                  <span className="text-xs font-bold text-slate-900">
                    {alert.officeName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({alert.officeCode})
                  </span>
                </div>
                <h5 className="text-xs font-semibold text-slate-800 mt-1">
                  {alert.title}
                </h5>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                  {alert.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAlert(alert)}
                className="text-xs"
              >
                View Details
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Alert Details Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title="Operational Exception Details"
          subtitle={`Department of Posts Alert ID: ${selectedAlert.id}`}
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAcknowledge(selectedAlert)}
              >
                Acknowledge & Record Directive
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Post Office</span>
                <span className="font-bold text-slate-900 text-sm">{selectedAlert.officeName}</span>
                <span className="text-slate-500 font-mono text-[11px] block">{selectedAlert.officeCode}</span>
              </div>
              <Badge status={selectedAlert.severity}>{selectedAlert.severity} Severity</Badge>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Incident Header</span>
              <p className="font-semibold text-slate-800 mt-0.5">{selectedAlert.title}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Operational Assessment</span>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 leading-relaxed">
                {selectedAlert.description}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Recommended DISU Directive</span>
              <p className="text-blue-900 bg-blue-50/80 p-3 rounded-lg border border-blue-100 mt-1 font-medium leading-relaxed">
                {selectedAlert.actionRequired}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Timestamp: {selectedAlert.timestamp}</span>
              <span>Status: Active Monitoring</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
