import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function DateRangePicker() {
  const { selectedRange, setSelectedRange } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [rangeError, setRangeError] = useState("");

  const ranges = ["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Date Range"];

  const handleSelect = (range) => {
    if (range === "Custom Date Range") {
      setShowCustomModal(true);
      setIsOpen(false);
    } else {
      setSelectedRange(range);
      setIsOpen(false);
    }
  };

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return;
    if (customStart > customEnd) {
      setRangeError("End date must be on or after the start date.");
      return;
    }

    setSelectedRange(`${customStart} to ${customEnd}`);
    setRangeError("");
    setShowCustomModal(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span>{selectedRange}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-30 w-48 mt-1 origin-top-right bg-white rounded-xl shadow-lg border border-slate-200 py-1 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
            {ranges.map((range) => {
              const active = selectedRange === range ||
                (range === "Custom Date Range" && selectedRange.includes(" to "));
              return (
                <button
                  key={range}
                  onClick={() => handleSelect(range)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{range}</span>
                  {active && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full animate-in zoom-in-95 duration-150">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Select Custom Date Range
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    setRangeError("");
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    setRangeError("");
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            {rangeError && (
              <p className="mt-2 text-xs text-rose-600" role="alert">{rangeError}</p>
            )}
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustomRange}
                disabled={!customStart || !customEnd}
                className="px-3.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
