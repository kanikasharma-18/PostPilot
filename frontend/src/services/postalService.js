import api from "./api.js";
import { MOCK_POST_OFFICES, DEMO_DIVISION } from "../data/mockData.js";

const LOCAL_OFFICES_KEY = "postpilot_custom_offices";
const isBrowser = typeof localStorage !== "undefined" && typeof localStorage.getItem === "function";

function getLocalCustomOffices() {
  try {
    if (isBrowser) {
      const raw = localStorage.getItem(LOCAL_OFFICES_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch {
    return [];
  }
}

function saveLocalCustomOffice(office) {
  if (isBrowser) {
    const existing = getLocalCustomOffices();
    existing.unshift(office);
    localStorage.setItem(LOCAL_OFFICES_KEY, JSON.stringify(existing));
  }
}

export const postalService = {
  /**
   * Check if backend API is reachable
   */
  async checkHealth() {
    try {
      const res = await api.get("/health", { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  },

  /**
   * Fetch divisions
   */
  async getDivisions() {
    try {
      const res = await api.get("/divisions");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return { data: res.data, isLive: true };
      }
    } catch (err) {
      console.warn("[PostalService] Using mock divisions:", err.message);
    }
    return { data: [DEMO_DIVISION], isLive: false };
  },

  /**
   * Fetch all post offices
   */
  async getOffices() {
    const customLocal = getLocalCustomOffices();
    try {
      const res = await api.get("/offices");
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Normalize backend fields if backend schema is minimal
        const normalized = res.data.map(off => {
          // Merge with detailed mock fields if available
          const matchingMock = MOCK_POST_OFFICES.find(m => m.code === off.code || m.id === off.id);
          return {
            id: off.id,
            divisionId: off.divisionId || DEMO_DIVISION.id,
            code: off.code,
            name: off.name,
            type: off.type || matchingMock?.type || "Sub Post Office (SO)",
            pincode: off.pincode || matchingMock?.pincode || "110001",
            division: off.division || matchingMock?.division || "New Delhi South",
            location: off.location || matchingMock?.location || `${off.name}, Delhi`,
            latitude: off.latitude !== undefined ? Number(off.latitude) : (matchingMock?.latitude || 28.5355),
            longitude: off.longitude !== undefined ? Number(off.longitude) : (matchingMock?.longitude || 77.2100),
            status: off.status || matchingMock?.status || "Optimal",
            active: off.active !== undefined ? Boolean(off.active) : true,
            totalParcels: off.totalParcels !== undefined ? Number(off.totalParcels) : (matchingMock?.totalParcels || 12000),
            delivered: off.delivered !== undefined ? Number(off.delivered) : (matchingMock?.delivered || 11400),
            pending: off.pending !== undefined ? Number(off.pending) : (matchingMock?.pending || 400),
            delayed: off.delayed !== undefined ? Number(off.delayed) : (matchingMock?.delayed || 200),
            successRate: off.successRate !== undefined ? Number(off.successRate) : (matchingMock?.successRate || 95.0),
            slaCompliance: off.slaCompliance !== undefined ? Number(off.slaCompliance) : (matchingMock?.slaCompliance || 96.0),
            avgDeliveryTime: off.avgDeliveryTime || matchingMock?.avgDeliveryTime || "24.0 hrs",
            staffCount: off.staffCount !== undefined ? Number(off.staffCount) : (matchingMock?.staffCount || 12),
            deliveryAgents: off.deliveryAgents !== undefined ? Number(off.deliveryAgents) : (matchingMock?.deliveryAgents || 8),
            contactNumber: off.contactNumber || matchingMock?.contactNumber || "+91 11 2336 4142",
            supervisor: off.supervisor || matchingMock?.supervisor || "Designated Postmaster"
          };
        });
        return { data: [...customLocal, ...normalized], isLive: true };
      }
    } catch (err) {
      console.warn("[PostalService] Backend offices unavailable, using demonstration dataset:", err.message);
    }
    return { data: [...customLocal, ...MOCK_POST_OFFICES], isLive: false };
  },

  /**
   * Create a new post office
   */
  async createOffice(officeData) {
    let backendSuccess = false;
    let created = null;

    let targetDivisionId = officeData.divisionId;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!targetDivisionId || !uuidPattern.test(targetDivisionId)) {
      try {
        const divRes = await api.get("/divisions");
        if (Array.isArray(divRes.data) && divRes.data.length > 0 && uuidPattern.test(divRes.data[0].id)) {
          targetDivisionId = divRes.data[0].id;
        }
      } catch {
        // Fallback
      }
    }
    if (!targetDivisionId || !uuidPattern.test(targetDivisionId)) {
      targetDivisionId = DEMO_DIVISION.id;
    }

    try {
      const res = await api.post("/offices", {
        divisionId: targetDivisionId,
        code: officeData.code,
        name: officeData.name
      });
      if (res.data) {
        backendSuccess = true;
        created = res.data;
      }
    } catch (err) {
      console.warn("[PostalService] Could not save office to backend:", err.message);
    }

    const fullOffice = {
      id: created?.id || `off-custom-${Date.now()}`,
      divisionId: officeData.divisionId || DEMO_DIVISION.id,
      code: officeData.code,
      name: officeData.name,
      type: officeData.type || "Sub Post Office (SO)",
      pincode: officeData.pincode || "110001",
      division: officeData.division || "New Delhi South",
      location: officeData.location || "Delhi",
      latitude: Number(officeData.latitude) || 28.5355,
      longitude: Number(officeData.longitude) || 77.2100,
      status: officeData.status || "Optimal",
      active: true,
      totalParcels: Number(officeData.totalParcels) || 5000,
      delivered: Number(officeData.delivered) || 4750,
      pending: Number(officeData.pending) || 180,
      delayed: Number(officeData.delayed) || 70,
      successRate: Number(officeData.successRate) || 95.0,
      slaCompliance: 95.5,
      avgDeliveryTime: "24.0 hrs",
      staffCount: Number(officeData.staffCount) || 10,
      deliveryAgents: Number(officeData.deliveryAgents) || 6,
      contactNumber: officeData.contactNumber || "+91 11 2000 0000",
      supervisor: officeData.supervisor || "Appointed Postmaster"
    };

    saveLocalCustomOffice(fullOffice);
    return { data: fullOffice, savedToBackend: backendSuccess };
  },

  /**
   * Fetch indicators
   */
  async getIndicators() {
    try {
      const res = await api.get("/indicators");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return { data: res.data, isLive: true };
      }
    } catch (err) {
      console.warn("[PostalService] Indicators using fallback:", err.message);
    }
    return {
      data: [
        { id: "ind-01", code: "PARCEL_DELIVERED", name: "Parcels Delivered", unit: "Count", valueType: "COUNT" },
        { id: "ind-02", code: "SLA_COMPLIANCE", name: "SLA Compliance Rate", unit: "Percentage", valueType: "PERCENTAGE" },
        { id: "ind-03", code: "AVG_DELIVERY_TIME", name: "Average Delivery Time", unit: "Hours", valueType: "DECIMAL" }
      ],
      isLive: false
    };
  },

  /**
   * Fetch measurements
   */
  async getMeasurements() {
    try {
      const res = await api.get("/measurements");
      if (Array.isArray(res.data)) {
        return { data: res.data, isLive: true };
      }
    } catch (err) {
      console.warn("[PostalService] Measurements fallback:", err.message);
    }
    return { data: [], isLive: false };
  },

  /**
   * Post measurement
   */
  async createMeasurement(payload) {
    try {
      const res = await api.post("/measurements", payload);
      return { data: res.data, isLive: true };
    } catch (err) {
      console.warn("[PostalService] Could not save measurement to backend:", err.message);
      return { data: { id: `m-${Date.now()}`, ...payload }, isLive: false };
    }
  }
};
