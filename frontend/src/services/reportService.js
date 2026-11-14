import { MOCK_POST_OFFICES, DEMO_DIVISION } from "../data/mockData.js";

export const reportService = {
  /**
   * Generate an analytical report based on template type and date range
   */
  async generateReport({ reportType, dateRange = "Last 30 Days", officeId = "all" }) {
    // Filter post offices if specific office selected
    const offices = officeId === "all"
      ? MOCK_POST_OFFICES
      : MOCK_POST_OFFICES.filter(o => o.id === officeId);

    const totalOffices = offices.length;
    const totalParcels = offices.reduce((acc, o) => acc + o.totalParcels, 0);
    const delivered = offices.reduce((acc, o) => acc + o.delivered, 0);
    const pending = offices.reduce((acc, o) => acc + o.pending, 0);
    const delayed = offices.reduce((acc, o) => acc + o.delayed, 0);
    const avgSuccess = totalParcels > 0 ? (delivered / totalParcels) * 100 : 0;
    const avgSla = (offices.reduce((acc, o) => acc + o.slaCompliance, 0) / totalOffices) || 0;

    let reportTitle = "Operational Performance Report";
    let keyFindings = [];

    switch (reportType) {
      case "daily":
        reportTitle = "Daily Postal Operations Clearance Audit";
        keyFindings = [
          "Division processed parcels at an average clearance rate of 94.2% today.",
          "Okhla Industrial Area SO reported the highest parcel inflow.",
          "Connaught Place HPO achieved 100% morning beat delivery completion."
        ];
        break;
      case "weekly":
        reportTitle = "Weekly Divisional Delivery & SLA Audit";
        keyFindings = [
          "Weekly volume grew by 6.3% driven by festive e-commerce consignments.",
          "Average delivery transit latency was 26.8 hours across the division.",
          "Two branch offices (Sarita Vihar & Khanpur) need temporary beat reinforcement."
        ];
        break;
      case "monthly":
        reportTitle = "Monthly Post Office SLA & Governance Summary";
        keyFindings = [
          "Overall monthly delivery success rate achieved 93.19% against the 95.0% target.",
          "21 out of 28 post offices met or exceeded the 90% SLA compliance threshold.",
          "Total parcel volume processed: 209,700 articles."
        ];
        break;
      case "office-wise":
        reportTitle = "Office-Wise Comparative Performance Analysis";
        keyFindings = [
          "Chanakyapuri SO and Connaught Place HPO ranked as top tier performers.",
          "Branch offices with fewer staff showed higher vulnerability to sudden volume surges.",
          "Average staff productivity: 820 articles per delivery agent per month."
        ];
        break;
      case "delay":
        reportTitle = "Delivery Delay & Bottleneck Root-Cause Report";
        keyFindings = [
          "Primary delay driver (44%): Sorting hub congestion during peak hours (18:00 - 21:00).",
          "Secondary delay driver (28%): Delivery beat agent absenteeism without substitutes.",
          "Tertiary factor (18%): Incomplete or ambiguous destination pin codes and street addresses."
        ];
        break;
      default:
        reportTitle = "Comprehensive Divisional Performance Review";
        keyFindings = [
          "Overall network operational stability is within standard parameters.",
          "Data Insights and Strategic Unit (DISU) recommendations active."
        ];
    }

    return {
      metadata: {
        reportId: `REP-DOP-${Math.floor(100000 + Math.random() * 900000)}`,
        generatedAt: new Date().toISOString(),
        generatedBy: "Rajesh Kumar, IPoS (Divisional Officer)",
        division: DEMO_DIVISION.name,
        dateRange,
        reportType,
        title: reportTitle
      },
      summary: {
        totalOffices,
        totalParcels,
        delivered,
        pending,
        delayed,
        avgSuccess: Number(avgSuccess.toFixed(1)),
        avgSla: Number(avgSla.toFixed(1))
      },
      keyFindings,
      tableData: offices.map(o => ({
        "Office Code": o.code,
        "Office Name": o.name,
        "Type": o.type,
        "PIN Code": o.pincode,
        "Total Parcels": o.totalParcels,
        "Delivered": o.delivered,
        "Pending": o.pending,
        "Delayed": o.delayed,
        "Success Rate (%)": o.successRate,
        "SLA Compliance (%)": o.slaCompliance,
        "Status": o.status
      }))
    };
  }
};
