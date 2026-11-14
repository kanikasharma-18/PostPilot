# PostPilot DISU – API Integration & Contract Document
**Department of Posts (DoP) Problem Statement #119**

**Data Insights & Strategic Unit (DISU) Decision Support Platform**

This document establishes the official integration contract between:
- **Member 1 (Backend & Database)**: Python, FastAPI, PostgreSQL
- **Member 2 (Frontend & UI/UX)**: React 19, Vite 8, Tailwind CSS v4, Recharts
- **Member 3 (ML & Predictive Analytics)**: Pandas, Random Forest + XGBoost Delay Predictor

---

## 1. System Communication Architecture

```
+-------------------------------------------------------------------+
|               Member 2: React Dashboard (Frontend)               |
|            Base URL: import.meta.env.VITE_API_BASE_URL            |
+---------------------------------+---------------------------------+
                                  |
            REST API (Axios with Auth Bearer Token Interceptor)
                                  |
        +-------------------------+-------------------------+
        |                                                   |
        v                                                   v
+-------------------------------+   +-------------------------------+
|  Member 1: FastAPI + Postgres |   |   Member 3: ML Microservice   |
|   - Divisional Offices Matrix |   |   - Delay Risk Inference      |
|   - Measurements & Volumes    |   |   - Root-Cause Classification |
|   - Officer Authentication    |   |   - Preventive Actions Engine |
+-------------------------------+   +-------------------------------+
```

---

## 2. API Endpoints Mapping Matrix

| # | Endpoint Name | Method | Expected Request | Expected Response Structure | Frontend Component / Page | Status |
|---|---|---|---|---|---|---|
| 1 | `Health Check` | `GET /health` | None | `{"status": "healthy"}` | `Navbar.jsx`, `Settings.jsx`, `DataContext.jsx` | **Defined in `server.js`** (Ready; Server Offline) |
| 2 | `Get Divisions` | `GET /api/divisions` | None | `[{"id": "uuid", "code": "DEL-S-11", "name": "New Delhi South Division"}]` | `Settings.jsx`, `Sidebar.jsx`, `postalService.js` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 3 | `Create Division` | `POST /api/divisions` | `{"code": "str", "name": "str"}` | `{"id": "uuid", "code": "str", "name": "str"}` | `postalService.js` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 4 | `Get Post Offices` | `GET /api/offices` | Query: `?divisionId=uuid` (optional) | `[{"id": "uuid", "divisionId": "uuid", "code": "DEL-HO-110001", "name": "Connaught Place HPO"}]` | `Overview.jsx`, `PostalPerformance.jsx`, `PostOfficeMonitoring.jsx` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 5 | `Create Post Office` | `POST /api/offices` | `{"divisionId": "uuid", "code": "str", "name": "str"}` | `{"id": "uuid", "divisionId": "uuid", "code": "str", "name": "str"}` | `PostOfficeMonitoring.jsx` (Add Office Modal) | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 6 | `Get Indicators` | `GET /api/indicators` | None | `[{"id": "uuid", "code": "str", "name": "str", "unit": "str", "valueType": "COUNT/DECIMAL/PERCENTAGE"}]` | `postalService.js` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 7 | `Get Measurements` | `GET /api/measurements` | Query: `?officeId=uuid&periodStart=date&periodEnd=date` | `[{"id": "uuid", "officeId": "uuid", "indicatorId": "uuid", "value": "1200", "periodStart": "2026-11-01", "periodEnd": "2026-11-14"}]` | `postalService.js` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 8 | `Create Measurement` | `POST /api/measurements` | `{"officeId": "uuid", "indicatorId": "uuid", "periodStart": "ISO", "periodEnd": "ISO", "value": 100}` | `{"id": "uuid", ...}` | `postalService.js` | **Defined in `apiRoutes.js`** (Ready; Server Offline) |
| 9 | `Officer Authentication` | `POST /api/auth/login` | `{"username": "str", "password": "str", "role": "str"}` | `{"token": "jwt_token_string", "user": {"id": "str", "name": "str", "role": "str", "designation": "str"}}` | `Login.jsx`, `authService.js` | *Pending Backend Implementation* (Demo auth active) |
| 10 | `Overview KPIs` | `GET /api/analytics/kpis` | Query: `?range=Last 30 Days` | `{"totalOffices": {"value": 28, "change": "+3.7%", "trend": "up"}, "totalParcels": {"value": 209700, "change": "+8.4%", "trend": "up"}, ...}` | `Overview.jsx`, `KpiCard.jsx` | *Pending Backend Implementation* (Demo dataset active) |
| 11 | `Delivery Trends` | `GET /api/analytics/delivery-trends` | Query: `?days=14` | `[{"date": "01 Nov", "delivered": 6420, "inTransit": 810, "pending": 320, "delayed": 160}]` | `Overview.jsx`, `DeliveryAnalytics.jsx`, `DeliveryTrendChart.jsx` | *Pending Backend Implementation* (Demo dataset active) |
| 12 | `Monthly Parcel Stats` | `GET /api/analytics/monthly-stats` | None | `[{"month": "Nov", "received": 209700, "dispatched": 205400, "delivered": 195413}]` | `Overview.jsx`, `DeliveryAnalytics.jsx`, `MonthlyParcelChart.jsx` | *Pending Backend Implementation* (Demo dataset active) |
| 13 | `Status Distribution` | `GET /api/analytics/status-distribution` | None | `[{"name": "Delivered", "value": 195413, "color": "#16a34a"}, ...]` | `Overview.jsx`, `DeliveryAnalytics.jsx`, `StatusDistributionChart.jsx` | *Pending Backend Implementation* (Demo dataset active) |
| 14 | `Critical Alerts` | `GET /api/analytics/alerts` | None | `[{"id": "alt-01", "severity": "Critical", "officeName": "str", "officeCode": "str", "title": "str", "description": "str", "timestamp": "str", "actionRequired": "str"}]` | `Overview.jsx`, `AlertsList.jsx` | *Pending Backend Implementation* (Demo dataset active) |
| 15 | `Delay Risk Predictions (ML)` | `GET /api/predictions/delays` | Query: `?risk=All/High/Medium/Low` | `[{"id": "pred-001", "consignmentId": "SP784912093IN", "postOffice": "Okhla SO", "riskLevel": "High", "predictedDelay": "18.5 hrs", "confidence": "94.2%", "riskFactor": "str", "recommendedAction": "str"}]` | `DelayPredictions.jsx`, `predictionService.js` | *Pending ML Implementation (Member 3)* (Demo ML output active) |
| 16 | `Execute Preventive Action` | `POST /api/predictions/:id/prevent` | `{"action": "Reroute consignment batch via Tughlakabad Sub-Hub"}` | `{"success": true, "message": "Preventive dispatch re-routing initiated."}` | `DelayPredictions.jsx` | *Pending ML Implementation (Member 3)* (Simulation handler active) |

---

## 3. Recommended FastAPI Schemas for Member 1

Member 1 can directly copy these Pydantic schemas into their FastAPI application (`main.py` / `schemas.py`):

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class DivisionSchema(BaseModel):
    id: Optional[str] = None
    code: str
    name: str

class OfficeSchema(BaseModel):
    id: Optional[str] = None
    divisionId: str
    code: str
    name: str
    type: Optional[str] = "Sub Post Office (SO)"
    pincode: Optional[str] = "110001"
    location: Optional[str] = None
    status: Optional[str] = "Optimal"

class MeasurementCreate(BaseModel):
    officeId: str
    indicatorId: str
    periodStart: date
    periodEnd: date
    value: float

class KpiCardItem(BaseModel):
    value: float
    change: Optional[str] = None
    trend: Optional[str] = "up"
    label: Optional[str] = None

class DashboardKpis(BaseModel):
    totalOffices: KpiCardItem
    totalParcels: KpiCardItem
    successfulDeliveries: KpiCardItem
    pendingDeliveries: KpiCardItem
    delayedDeliveries: KpiCardItem
    overallSuccessRate: KpiCardItem
```

---

## 4. Recommended Machine Learning Payload Format for Member 3

When Member 3 deploys their Python Pandas & XGBoost pipeline, the delay predictions should return:

```json
[
  {
    "id": "pred-001",
    "consignmentId": "SP784912093IN",
    "postOffice": "Okhla Industrial Area SO",
    "officeCode": "DEL-SO-110020",
    "serviceType": "Speed Post",
    "riskLevel": "High",
    "predictedDelay": "18.5 hrs",
    "confidence": "94.2%",
    "riskFactor": "Sorting Hub Congestion",
    "destinationPin": "110020",
    "originHub": "Naraina NSH",
    "recommendedAction": "Reroute consignment batch via Tughlakabad Sub-Hub"
  }
]
```

---

## 5. Fail-Safe Service Architecture

To guarantee that the frontend **never crashes or displays broken views during evaluation**, every service method (`postalService`, `analyticsService`, `predictionService`, `reportService`):
1. Attempts to connect to `VITE_API_BASE_URL` with a 8-second timeout.
2. If the backend is running and responds with status 200, uses live database data.
3. If the backend is offline, unreachable, or returns a 404/500, gracefully falls back to the high-fidelity Department of Posts demonstration dataset without breaking any UI components.
4. Indicates live connection status in the top navigation bar with a live ping button.
