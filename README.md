# PostPilot – DISU Command & Analytics Dashboard
### Department of Posts (DoP) • Problem Statement #119
**Data Insights and Strategic Unit (DISU) Decision Support Platform**

PostPilot is an enterprise-grade postal operations command and predictive analytics platform engineered for the Department of Posts (DoP), Ministry of Communications, Government of India. The platform equips Divisional Postal Officers (SSPOs/ASPOs) with actionable operational telemetry to monitor postal clearance, identify underperforming beats and post offices, predict delivery delays using Machine Learning, and make data-backed administrative decisions.

---

## 1. Project Overview & Objectives

In modern postal logistics, delivery clearance delays and beat bottlenecks often go undetected until SLAs are breached. PostPilot establishes an integrated **Data Insights and Strategic Unit (DISU)** command centre that:
- **Monitors Network Clearance in Real-Time**: Tracks parcel throughput, first-attempt completion rates, and sorting queues across Head Post Offices (HPOs), Sub Post Offices (SOs), and Branch Post Offices (BOs).
- **Pinpoints Underperforming Post Offices**: Identifies postal beats suffering from staff shortages, logistics congestion, or persistent delivery backlogs.
- **Predicts Delivery Delays (ML Pipeline)**: Evaluates transit latency risks before delivery failure occurs using an XGBoost / Random Forest predictive ensemble.
- **Generates Compliance & Audit Reports**: Automates daily beat audits, monthly governance MIS summaries, and delivery delay root-cause reports for divisional reviews.

---

## 2. Team Architecture & Responsibilities

The project is structured into three collaborative modules:

```
+-------------------------------------------------------------------+
|               Member 2: React Dashboard (Frontend)               |
|       React 19 • Vite 8 • Tailwind CSS v4 • Recharts • Sonner      |
+---------------------------------+---------------------------------+
                                  |
            REST API (Axios with Auth Bearer Token Interceptor)
                                  |
        +-------------------------+-------------------------+
        |                                                   |
        v                                                   v
+-------------------------------+   +-------------------------------+
| Member 1: Express + Postgres  |   | Member 3: Prediction Module  |
|   - Divisions & Post Offices  |   |   - Delay Risk Demonstration |
|   - Measurements & Indicators|   |   - Analytics Integration    |
|   - REST API                  |   |   - Future ML Service Hook   |
+-------------------------------+   +-------------------------------+
```

- **Member 1 (Backend & Database)**: Node.js, Express REST APIs, PostgreSQL, Prisma ORM, and data persistence.
- **Member 2 (Frontend & UI/UX)**: React 19 architecture, enterprise UI/UX design, geospatial tactical mapping, Recharts data visualizers, and service layer integration.
- **Member 3 (Data Analytics & Machine Learning)**: The dashboard includes a delay-prediction interface backed by demonstration data, ready to integrate with a production ML service.

---

## 3. Technology Stack

### Frontend (Member 2)
- **Core**: React 19, Vite 8, JavaScript (ES Modules)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom Administrative Navy Theme
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts v3 (Area, Composed, Horizontal Bar, Donut, Stacked)
- **Icons & Alerts**: Lucide React, Sonner Toast Notifications
- **HTTP Client**: Axios with request/response interceptors and timeout guards
- **Export Engine**: Client-side CSV generation & `@media print` formatted reports

### Backend & Database (Member 1)
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **ORM / Client**: Prisma ORM (`@prisma/client`)
- **Models**: `Division`, `Office`, `Indicator`, `Measurement`

### Data Science & ML (Member 3)
- **Current status**: Prediction screens use demonstration data; a separate production ML service is not included in this repository.
- **Integration direction**: Delay-risk scoring, root-cause classification, and preventive-action recommendations.

---

## 4. Key Application Modules

1. **Executive Overview Dashboard (`/`)**:
   - Welcome banner for Divisional Postal Officers with custom date-range filtering (*Today, Last 7 Days, Last 30 Days, Last 90 Days, Custom*).
   - 6 KPI cards: Total Offices, Total Parcels Processed, Successful Deliveries, Pending Deliveries, Delayed Deliveries, and Network Success Rate.
   - 4 Interactive Recharts: Delivery Clearance Trend, Monthly Parcel Throughput, Post Office Clearance Ranking, and Status Distribution.
   - Geospatial Division Matrix: Zero-dependency interactive SVG vector map of South Delhi postal corridors with color-coded node health (*Optimal, Average, Critical*).
   - Critical Operational Alerts list with detailed root-cause modal and acknowledgment workflows.
   - Leaderboards for Top Performing and Underperforming beats.

2. **Postal Performance Directory (`/performance`)**:
   - Division-wide performance matrix with active/inactive office breakdown and SLA compliance indices.
   - Searchable, sortable, and filterable table with full postal beat inspection modals.

3. **Delivery Operations Analytics (`/delivery-analytics`)**:
   - Deep operational telemetry: Turnaround latency (avg 24.8 hrs) and first-attempt completion ratios (89.4%).
   - Service-type transit latency breakdown (*Speed Post, Business Parcel, Registered Post, Express Cargo*).
   - Daily clearance volume curves vs SLA threshold markers.

4. **Post Office Monitoring Matrix (`/offices`)**:
   - 11-column administrative table (*Office ID, Name, Division, Location, Total Parcels, Delivered, Pending, Delayed, Success Rate, Status, Actions*).
   - Multi-column sorting, pagination, and status filters.
   - **"Register New Post Office"** modal with validation.
   - One-click CSV data export.

5. **Delay Prediction Intelligence (`/predictions`)**:
   - Machine Learning delay prediction pipeline interface (Member 3).
   - Model telemetry: *PostPilot-DelayNet (Random Forest + XGBoost Ensemble, 92.4% accuracy)*.
   - Filterable high-risk consignment matrix with predicted delay hours, model confidence %, and primary risk factors.
   - Actionable **"Preventive Dispatch"** rerouting trigger with immediate toast feedback.

6. **Analytical Reports Center (`/reports`)**:
   - 5 pre-configured report templates: Daily Operations Clearance, Weekly Delivery & SLA Audit, Monthly Governance Summary, Office-Wise Comparative Review, and Delay Root-Cause Analysis.
   - Executive summaries, DISU operational findings, and structured data tables.
   - Browser print trigger (`window.print()`) and instant CSV export.

7. **Notification & Dispatch Center (`/notifications`)**:
   - Categorized notifications (*Critical Alerts, Performance Warnings, System Updates, Delivery Updates*).
   - Unread badge tracking, mark as read, mark all read, clear all, and deep links.

8. **Platform Settings & Governance (`/settings`)**:
   - Divisional Officer profile editor with persistent local storage.
   - Backend API base URL configuration (`VITE_API_BASE_URL`) with live health connection test button.
   - Architecture summary and team integration specs.

---

## 5. Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Frontend Installation & Setup
```bash
# 1. From the repository root, enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application will launch at `http://localhost:5173/` (or `http://localhost:5174/`).

### Quick Evaluator Demo Login
On the login screen, click **"Rajesh Kumar, IPoS (Divisional Postal Officer)"** under *Quick Evaluator Demo Login* to immediately access the dashboard.

### Running Automated Verification Suite
To verify all 43 services, data formatters, and fallback integrations:
```bash
cd frontend
node verify_frontend.mjs
```

---

## 6. API Integration & Backend Contract

The frontend connects to the backend through a modular Axios service layer configured in `src/services/api.js`.
- If the backend is running, the top navigation displays **"Live API Connected"**.
- If the backend is offline, the frontend gracefully falls back to the high-fidelity demonstration dataset with **"Demo Data Mode"** clearly indicated.
- For endpoint schemas, request parameters, and backend integration notes, refer to [`API_INTEGRATION.md`](./API_INTEGRATION.md).

---

## 7. License & Credits

Developed for the **Department of Posts (DoP) Problem Statement #119**.

Author: **nagesh sharma**
