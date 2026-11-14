import React, { useState, useEffect } from "react";
import {
  ClockAlert,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Info
} from "lucide-react";
import { predictionService } from "../services/predictionService";
import DelayRiskChart from "../components/charts/DelayRiskChart";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { toast } from "sonner";

export default function DelayPredictions() {
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState("All");
  const [predictions, setPredictions] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);
  const [executingId, setExecutingId] = useState(null);

  useEffect(() => {
    loadPredictions();
  }, [riskFilter]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const [predsRes, distData] = await Promise.all([
        predictionService.getPredictions(riskFilter),
        predictionService.getRiskDistribution()
      ]);
      setPredictions(predsRes.data);
      setModelMeta(predsRes.modelMetadata);
      setRiskDistribution(distData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load delay predictions");
    } finally {
      setLoading(false);
    }
  };

  const handlePreventiveAction = async (prediction) => {
    setExecutingId(prediction.id);
    try {
      const res = await predictionService.executePreventiveAction(
        prediction.consignmentId,
        prediction.recommendedAction
      );
      toast.success(res.message);
    } finally {
      setExecutingId(null);
    }
  };

  const highRiskCount = predictions.filter(p => p.riskLevel === "High").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & ML Pipeline Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Delivery Delay Predictive Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              Member 3 ML Module
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Predictive transit latency modeling based on historical RMS hub bottlenecking, weather, and beat loads.
          </p>
        </div>
      </div>

      {/* Model Information Notice */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
        <div className="flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold block">
              Model: {modelMeta?.modelName || "Random Forest + XGBoost Delay Classifier"}
            </span>
            <span className="text-[11px] text-indigo-700">
              Accuracy: <strong>{modelMeta?.accuracy || "92.4%"}</strong> • Trained on: {modelMeta?.trainedOn || "1.24M DoP Articles"} • Batch Run: {modelMeta?.lastBatchRun || "Today, 08:00 AM"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 font-semibold text-amber-800">
            Demonstration ML Predictions (Simulated Output)
          </span>
        </div>
      </div>

      {/* Overview Cards & Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium uppercase">
                High-Risk Flagged
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-600 mt-2">
              {highRiskCount} Consignments
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Predicted to breach 24h & 48h SLA thresholds without intervention.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Avg Predicted Delay
              </span>
              <ClockAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              14.8 Hours
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Down from 18.2 hours in previous weekly evaluation cycle.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Preventive Interventions
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              100% Recommended
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Automated reroutes generated for all flagged transit bottlenecks.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card
            title="Consignment Risk Classification Breakdown"
            subtitle="Risk levels determined by XGBoost feature weighting (Distance, Hub Traffic, Beat Absenteeism)"
          >
            <DelayRiskChart data={riskDistribution} height={250} />
          </Card>
        </div>
      </div>

      {/* Filterable Predictions Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Delay Risk Predictions
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing predicted delays with confidence intervals and suggested preventive directives
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Risk Filter:</span>
            {["All", "High", "Medium", "Low"].map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  riskFilter === level
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-4 py-3">Consignment ID</th>
                <th className="px-3 py-3">Post Office</th>
                <th className="px-3 py-3">Service</th>
                <th className="px-3 py-3 text-center">Risk Level</th>
                <th className="px-3 py-3">Predicted Delay</th>
                <th className="px-3 py-3">Confidence</th>
                <th className="px-3 py-3">Primary Risk Factor</th>
                <th className="px-4 py-3 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    {p.consignmentId}
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-slate-800 block">{p.postOffice}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.officeCode}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{p.serviceType}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge status={p.riskLevel}>{p.riskLevel}</Badge>
                  </td>
                  <td className="px-3 py-3 font-bold text-rose-600">
                    +{p.predictedDelay}
                  </td>
                  <td className="px-3 py-3 text-slate-700 font-medium">
                    {p.confidence}
                  </td>
                  <td className="px-3 py-3 text-slate-600 max-w-xs">
                    {p.riskFactor}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant={p.riskLevel === "High" ? "danger" : "secondary"}
                      size="sm"
                      loading={executingId === p.consignmentId}
                      onClick={() => handlePreventiveAction(p)}
                      className="text-[11px]"
                    >
                      Preventive Dispatch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
