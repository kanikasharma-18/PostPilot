import api from "./api.js";
import {
  MOCK_KPIS,
  MOCK_DELIVERY_TRENDS,
  MOCK_MONTHLY_PARCEL_STATS,
  MOCK_STATUS_DISTRIBUTION,
  MOCK_CRITICAL_ALERTS,
  MOCK_POST_OFFICES
} from "../data/mockData.js";

function getTrendDate(point) {
  if (!point || typeof point.date !== "string") return null;

  if (point.isoDate) {
    const date = new Date(`${point.isoDate}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const dateText = /\b\d{4}\b/.test(point.date) ? point.date : `${point.date} 2026`;
  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function filterDeliveryTrendsByRange(data, range) {
  if (!Array.isArray(data) || data.length === 0 || typeof range !== "string") {
    return data;
  }

  const datedPoints = data
    .map(point => ({ point, date: getTrendDate(point) }))
    .filter(item => item.date);

  if (datedPoints.length === 0) return data;

  let start;
  let end;
  const customRange = range.match(/^(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})$/);

  if (customRange) {
    start = new Date(`${customRange[1]}T00:00:00`);
    end = new Date(`${customRange[2]}T23:59:59.999`);
  } else {
    const latestDate = new Date(Math.max(...datedPoints.map(item => item.date.getTime())));
    const daysByRange = {
      Today: 1,
      "Last 7 Days": 7,
      "Last 30 Days": 30,
      "Last 90 Days": 90
    };
    const days = daysByRange[range];
    if (!days) return data;

    start = new Date(latestDate);
    start.setDate(start.getDate() - days + 1);
    end = latestDate;
    end.setHours(23, 59, 59, 999);
  }

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }

  return datedPoints
    .filter(({ date }) => date >= start && date <= end)
    .map(({ point }) => point);
}

export const analyticsService = {
  /**
   * Get KPI summary for selected date range
   */
  async getKPIs(range = "Last 30 Days") {
    try {
      const res = await api.get(`/analytics/kpis?range=${encodeURIComponent(range)}`);
      if (res.data && res.data.totalParcels) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Backend endpoint not ready yet -> use mock
    }
    const data = MOCK_KPIS[range] || MOCK_KPIS["Last 30 Days"];
    return { data, isLive: false };
  },

  /**
   * Get daily/weekly delivery performance trend
   */
  async getDeliveryTrends(range = 14) {
    const daysByRange = {
      Today: 1,
      "Last 7 Days": 7,
      "Last 30 Days": 30,
      "Last 90 Days": 90
    };
    const customRange = typeof range === "string"
      ? range.match(/^(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})$/)
      : null;
    const customDays = customRange
      ? Math.ceil(
          (new Date(`${customRange[2]}T00:00:00`) - new Date(`${customRange[1]}T00:00:00`)) /
            86400000
        ) + 1
      : 14;
    const days = typeof range === "number"
      ? range
      : daysByRange[range] || customDays;

    try {
      const res = await api.get(`/analytics/delivery-trends?days=${days}`);
      if (Array.isArray(res.data)) {
        return {
          data: typeof range === "string" ? filterDeliveryTrendsByRange(res.data, range) : res.data,
          isLive: true
        };
      }
    } catch {
      // Fallback
    }
    return {
      data: typeof range === "string"
        ? filterDeliveryTrendsByRange(MOCK_DELIVERY_TRENDS, range)
        : MOCK_DELIVERY_TRENDS,
      isLive: false
    };
  },

  /**
   * Get monthly parcel statistics (Received, Dispatched, Delivered)
   */
  async getMonthlyStats() {
    try {
      const res = await api.get("/analytics/monthly-stats");
      if (Array.isArray(res.data)) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: MOCK_MONTHLY_PARCEL_STATS, isLive: false };
  },

  /**
   * Get delivery status distribution
   */
  async getStatusDistribution() {
    try {
      const res = await api.get("/analytics/status-distribution");
      if (Array.isArray(res.data)) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: MOCK_STATUS_DISTRIBUTION, isLive: false };
  },

  /**
   * Get critical alerts
   */
  async getCriticalAlerts() {
    try {
      const res = await api.get("/analytics/alerts");
      if (Array.isArray(res.data)) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: MOCK_CRITICAL_ALERTS, isLive: false };
  },

  /**
   * Get top performing and low performing offices
   */
  async getOfficeRankings() {
    try {
      const res = await api.get("/analytics/office-rankings");
      if (res.data?.top && res.data?.needsAttention) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Fallback
    }

    const sortedBySuccess = [...MOCK_POST_OFFICES].sort((a, b) => b.successRate - a.successRate);
    const top = sortedBySuccess.slice(0, 4);
    const needsAttention = [...MOCK_POST_OFFICES]
      .filter(o => o.status === "Critical" || o.status === "Average")
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 4);

    return {
      data: { top, needsAttention },
      isLive: false
    };
  }
};
