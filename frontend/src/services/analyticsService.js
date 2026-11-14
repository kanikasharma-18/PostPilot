import api from "./api.js";
import {
  MOCK_KPIS,
  MOCK_DELIVERY_TRENDS,
  MOCK_MONTHLY_PARCEL_STATS,
  MOCK_STATUS_DISTRIBUTION,
  MOCK_CRITICAL_ALERTS,
  MOCK_POST_OFFICES
} from "../data/mockData.js";

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
  async getDeliveryTrends(days = 14) {
    try {
      const res = await api.get(`/analytics/delivery-trends?days=${days}`);
      if (Array.isArray(res.data)) {
        return { data: res.data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: MOCK_DELIVERY_TRENDS, isLive: false };
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
