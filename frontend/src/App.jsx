
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5001/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [counts, setCounts] = useState({
    Divisions: 0,
    Offices: 0,
    Indicators: 0,
    Measurements: 0
  });
  const [error, setError] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [offices, setOffices] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [divisionForm, setDivisionForm] = useState({ code: "", name: "" });
  const [officeForm, setOfficeForm] = useState({
    divisionId: "",
    code: "",
    name: ""
  });
  const [indicatorForm, setIndicatorForm] = useState({
    code: "",
    name: "",
    description: "",
    unit: "",
    valueType: "COUNT"
  });
  const [measurementForm, setMeasurementForm] = useState({
    officeId: "",
    indicatorId: "",
    periodStart: "",
    periodEnd: "",
    value: ""
  });
  const [editingMeasurementId, setEditingMeasurementId] = useState("");
  const [editingValue, setEditingValue] = useState("");

  async function loadDashboardCounts() {
    const responses = await Promise.all([
      fetch(`${API_BASE_URL}/divisions`),
      fetch(`${API_BASE_URL}/offices`),
      fetch(`${API_BASE_URL}/indicators`),
      fetch(`${API_BASE_URL}/measurements`)
    ]);

    if (responses.some((response) => !response.ok)) {
      throw new Error("Could not load dashboard counts.");
    }

    const [divisionsData, officesData, indicatorsData, measurementsData] =
      await Promise.all(responses.map((response) => response.json()));

    setDivisions(divisionsData);
    setOffices(officesData);
    setIndicators(indicatorsData);
    setMeasurements(measurementsData);
    setCounts({
      Divisions: divisionsData.length,
      Offices: officesData.length,
      Indicators: indicatorsData.length,
      Measurements: measurementsData.length
    });
  }

  async function loadDivisionsAndOffices() {
    setLoading(true);
    setError("");
    try {
      const [divisionsResponse, officesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/divisions`),
        fetch(`${API_BASE_URL}/offices`)
      ]);

      if (!divisionsResponse.ok || !officesResponse.ok) {
        throw new Error("Could not load divisions and offices.");
      }

      const divisionsData = await divisionsResponse.json();
      const officesData = await officesResponse.json();
      setDivisions(divisionsData);
      setOffices(officesData);
      if (divisionsData.length > 0 && !officeForm.divisionId) {
        setOfficeForm((form) => ({ ...form, divisionId: divisionsData[0].id }));
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadIndicators() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/indicators`);
      if (!response.ok) throw new Error("Could not load indicators.");
      setIndicators(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMeasurements() {
    setLoading(true);
    setError("");
    try {
      const [measurementsResponse, officesResponse, indicatorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/measurements`),
        fetch(`${API_BASE_URL}/offices`),
        fetch(`${API_BASE_URL}/indicators`)
      ]);

      if (!measurementsResponse.ok || !officesResponse.ok || !indicatorsResponse.ok) {
        throw new Error("Could not load measurements.");
      }

      const measurementsData = await measurementsResponse.json();
      const officesData = await officesResponse.json();
      const indicatorsData = await indicatorsResponse.json();
      setMeasurements(measurementsData);
      setOffices(officesData);
      setIndicators(indicatorsData);
      setMeasurementForm((form) => ({
        ...form,
        officeId: form.officeId || officesData[0]?.id || "",
        indicatorId: form.indicatorId || indicatorsData[0]?.id || ""
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadCounts() {
      try {
        await loadDashboardCounts();
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadCounts();
  }, []);

  async function addDivision(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!divisionForm.code.trim() || !divisionForm.name.trim()) {
      setError("Division code and name are required.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/divisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(divisionForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not add division.");
      setDivisionForm({ code: "", name: "" });
      await loadDivisionsAndOffices();
      await loadDashboardCounts();
      setSuccess("Division added successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function addOffice(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!officeForm.divisionId || !officeForm.code.trim() || !officeForm.name.trim()) {
      setError("Division, office code and office name are required.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/offices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officeForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not add office.");
      setOfficeForm({ divisionId: divisions[0]?.id || "", code: "", name: "" });
      await loadDivisionsAndOffices();
      await loadDashboardCounts();
      setSuccess("Office added successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function addIndicator(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!indicatorForm.code.trim() || !indicatorForm.name.trim() ||
        !indicatorForm.description.trim() || !indicatorForm.unit.trim()) {
      setError("Code, name, description and unit are required.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/indicators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(indicatorForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not add indicator.");
      setIndicatorForm({
        code: "",
        name: "",
        description: "",
        unit: "",
        valueType: "COUNT"
      });
      await loadIndicators();
      await loadDashboardCounts();
      setSuccess("Indicator added successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function addMeasurement(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!measurementForm.officeId || !measurementForm.indicatorId ||
        !measurementForm.periodStart || !measurementForm.periodEnd ||
        measurementForm.value === "") {
      setError("Office, indicator, dates and value are required.");
      return;
    }
    if (measurementForm.periodStart > measurementForm.periodEnd) {
      setError("Period start cannot be after period end.");
      return;
    }
    if (!Number.isFinite(Number(measurementForm.value))) {
      setError("Value must be numeric.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/measurements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurementForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not add measurement.");
      setMeasurementForm({
        ...measurementForm,
        periodStart: "",
        periodEnd: "",
        value: ""
      });
      await loadMeasurements();
      await loadDashboardCounts();
      setSuccess("Measurement added successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function updateMeasurement(measurement) {
    setError("");
    setSuccess("");
    if (editingValue === "" || !Number.isFinite(Number(editingValue))) {
      setError("Value must be numeric.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/measurements/${measurement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodStart: measurement.periodStart.slice(0, 10),
          periodEnd: measurement.periodEnd.slice(0, 10),
          value: editingValue
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update measurement.");
      setEditingMeasurementId("");
      setEditingValue("");
      await loadMeasurements();
      await loadDashboardCounts();
      setSuccess("Measurement updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const menuItems = [
    { label: "Dashboard", icon: "▦" },
    { label: "Divisions & Offices", icon: "⌂" },
    { label: "Indicators", icon: "◈" },
    { label: "Measurements", icon: "▤" }
  ];
  const measurementValues = measurements
    .map((measurement) => Number(measurement.value))
    .filter((value) => Number.isFinite(value));
  const measurementTotal = measurementValues.reduce((total, value) => total + value, 0);
  const measurementAverage = measurementValues.length > 0
    ? measurementTotal / measurementValues.length
    : 0;
  const measurementMaximum = measurementValues.length > 0 ? Math.max(...measurementValues) : 0;
  const measurementMinimum = measurementValues.length > 0 ? Math.min(...measurementValues) : 0;
  const chartMeasurements = [...measurements]
    .sort((first, second) => new Date(first.periodStart) - new Date(second.periodStart))
    .slice(-8);
  const chartMaximum = Math.max(
    ...chartMeasurements.map((measurement) => Number(measurement.value)).filter(Number.isFinite),
    1
  );
  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const openPage = (page) => {
    setActivePage(page);
    setError("");
    setSuccess("");
    if (page === "Divisions & Offices") loadDivisionsAndOffices();
    if (page === "Indicators") loadIndicators();
    if (page === "Measurements") loadMeasurements();
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">PostPilot</h2>
        <p className="subtitle">POSTAL PERFORMANCE SYSTEM</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={activePage === item.label ? "nav-item active" : "nav-item"}
              onClick={() => openPage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>Department of Posts</strong>
          <span>Government of India</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <span className="topbar-kicker">POSTAL PERFORMANCE SYSTEM</span>
            <h3>{activePage}</h3>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications">♢</button>
            <span>PostPilot Administration</span>
            <div className="profile-badge">PA</div>
          </div>
        </header>

        {activePage === "Dashboard" ? (
          <section className="dashboard">
            <div className="page-intro">
              <div>
                <span className="eyebrow">OVERVIEW</span>
                <h1>Dashboard</h1>
                <p>Monitor postal performance across divisions and offices.</p>
              </div>
              <div className="live-status"><span /> Live data</div>
            </div>

            <div className="stats-grid">
              {[
                { label: "Divisions", description: "Administrative divisions", icon: "◈", color: "purple" },
                { label: "Offices", description: "Registered postal offices", icon: "⌂", color: "blue" },
                { label: "Indicators", description: "Performance indicators", icon: "◉", color: "green" },
                { label: "Measurements", description: "Recorded measurements", icon: "▤", color: "orange" }
              ].map((item) => (
                <div className={`stat-card ${item.color}`} key={item.label}>
                  <div className="stat-card-top">
                    <span className="stat-icon">{item.icon}</span>
                    <span className="stat-label">{item.label}</span>
                  </div>
                  <h2>{counts[item.label]}</h2>
                  <span className="stat-description">{item.description}</span>
                </div>
              ))}
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="dashboard-content-grid">
              <div className="overview-card">
                <div className="card-heading">
                  <div>
                    <h2>Measurements Overview</h2>
                    <p>Recorded values across all reporting periods</p>
                  </div>
                  <span className="card-period">All time</span>
                </div>
                {chartMeasurements.length === 0 ? (
                  <div className="empty-state chart-empty">
                    <span className="empty-icon">⌁</span>
                    <strong>No measurements yet</strong>
                    <span>Add a measurement to see performance trends.</span>
                  </div>
                ) : (
                  <>
                    <div className="chart">
                      <div className="chart-y-axis">
                        <span>{chartMaximum.toFixed(0)}</span>
                        <span>{(chartMaximum / 2).toFixed(0)}</span>
                        <span>0</span>
                      </div>
                      <div className="chart-bars">
                        {chartMeasurements.map((measurement) => {
                          const value = Number(measurement.value);
                          const height = Math.max((value / chartMaximum) * 100, 4);
                          return (
                            <div className="bar-column" key={measurement.id}>
                              <span className="bar-value">{value}</span>
                              <div className="bar-track">
                                <div className="bar" style={{ height: `${height}%` }} />
                              </div>
                              <span className="bar-label">{formatDate(measurement.periodStart).slice(0, 6)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="summary-grid">
                      <div><span>Total</span><strong>{measurementTotal.toFixed(2)}</strong></div>
                      <div><span>Average</span><strong>{measurementAverage.toFixed(2)}</strong></div>
                      <div><span>Maximum</span><strong>{measurementMaximum.toFixed(2)}</strong></div>
                      <div><span>Minimum</span><strong>{measurementMinimum.toFixed(2)}</strong></div>
                    </div>
                  </>
                )}
              </div>

              <div className="overview-card recent-card">
                <div className="card-heading">
                  <div>
                    <h2>Recent Measurements</h2>
                    <p>Latest submitted performance records</p>
                  </div>
                  <button className="text-button" type="button" onClick={() => openPage("Measurements")}>
                    View all <span>→</span>
                  </button>
                </div>
                {measurements.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">▤</span>
                    <strong>No recent measurements</strong>
                    <span>Submitted records will appear here.</span>
                  </div>
                ) : (
                  <div className="recent-list">
                    {measurements.slice(0, 5).map((measurement) => (
                      <div className="recent-row" key={measurement.id}>
                        <div className="recent-main">
                          <strong>{measurement.office?.name || measurement.officeId}</strong>
                          <span>{measurement.indicator?.name || measurement.indicatorId}</span>
                        </div>
                        <span className="recent-period">{formatDate(measurement.periodStart)}</span>
                        <strong className="recent-value">{measurement.value}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="quick-actions">
              <div className="section-heading">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Common administration tasks</p>
                </div>
              </div>
              <div className="action-grid">
                {[
                  { label: "Add Division", description: "Create a new division", page: "Divisions & Offices", icon: "◈", color: "purple" },
                  { label: "Add Office", description: "Register a postal office", page: "Divisions & Offices", icon: "⌂", color: "blue" },
                  { label: "Add Indicator", description: "Define a performance metric", page: "Indicators", icon: "◉", color: "green" },
                  { label: "Add Measurement", description: "Record a new value", page: "Measurements", icon: "▤", color: "orange" }
                ].map((action) => (
                  <button className="action-card" type="button" key={action.label} onClick={() => openPage(action.page)}>
                    <span className={`action-icon ${action.color}`}>{action.icon}</span>
                    <span className="action-copy"><strong>{action.label}</strong><span>{action.description}</span></span>
                    <span className="action-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
            <footer className="app-footer">© 2026 Department of Posts, Government of India. All rights reserved.</footer>
          </section>
        ) : activePage === "Divisions & Offices" ? (
          <section className="dashboard">
            <h1>Divisions & Offices</h1>
            <p>Manage divisions and the offices that belong to them.</p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {loading ? (
              <p>Loading divisions and offices...</p>
            ) : (
              <div className="management-grid">
                <div className="management-card">
                  <h2>Add Division</h2>
                  <form onSubmit={addDivision} className="simple-form">
                    <input
                      placeholder="Division code"
                      value={divisionForm.code}
                      onChange={(event) =>
                        setDivisionForm({ ...divisionForm, code: event.target.value })
                      }
                      required
                    />
                    <input
                      placeholder="Division name"
                      value={divisionForm.name}
                      onChange={(event) =>
                        setDivisionForm({ ...divisionForm, name: event.target.value })
                      }
                      required
                    />
                    <button type="submit">Add Division</button>
                  </form>

                  <h2>Divisions</h2>
                  <table>
                    <thead>
                      <tr><th>Code</th><th>Name</th></tr>
                    </thead>
                    <tbody>
                      {divisions.map((division) => (
                        <tr key={division.id}>
                          <td>{division.code}</td>
                          <td>{division.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="management-card">
                  <h2>Add Office</h2>
                  <form onSubmit={addOffice} className="simple-form">
                    <select
                      value={officeForm.divisionId}
                      onChange={(event) =>
                        setOfficeForm({ ...officeForm, divisionId: event.target.value })
                      }
                      required
                    >
                      <option value="">Select division</option>
                      {divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Office code"
                      value={officeForm.code}
                      onChange={(event) =>
                        setOfficeForm({ ...officeForm, code: event.target.value })
                      }
                      required
                    />
                    <input
                      placeholder="Office name"
                      value={officeForm.name}
                      onChange={(event) =>
                        setOfficeForm({ ...officeForm, name: event.target.value })
                      }
                      required
                    />
                    <button type="submit">Add Office</button>
                  </form>

                  <h2>Offices</h2>
                  <table>
                    <thead>
                      <tr><th>Code</th><th>Name</th><th>Division</th></tr>
                    </thead>
                    <tbody>
                      {offices.map((office) => (
                        <tr key={office.id}>
                          <td>{office.code}</td>
                          <td>{office.name}</td>
                          <td>{divisions.find((division) => division.id === office.divisionId)?.name || office.divisionId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        ) : activePage === "Indicators" ? (
          <section className="dashboard">
            <h1>Indicators</h1>
            <p>Define the performance indicators used by PostPilot.</p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {loading ? (
              <p>Loading indicators...</p>
            ) : (
              <div className="management-grid">
                <div className="management-card">
                  <h2>Add Indicator</h2>
                  <form onSubmit={addIndicator} className="simple-form">
                    <input
                      placeholder="Indicator code"
                      value={indicatorForm.code}
                      onChange={(event) =>
                        setIndicatorForm({ ...indicatorForm, code: event.target.value })
                      }
                      required
                    />
                    <input
                      placeholder="Indicator name"
                      value={indicatorForm.name}
                      onChange={(event) =>
                        setIndicatorForm({ ...indicatorForm, name: event.target.value })
                      }
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={indicatorForm.description}
                      onChange={(event) =>
                        setIndicatorForm({ ...indicatorForm, description: event.target.value })
                      }
                      required
                    />
                    <input
                      placeholder="Unit"
                      value={indicatorForm.unit}
                      onChange={(event) =>
                        setIndicatorForm({ ...indicatorForm, unit: event.target.value })
                      }
                      required
                    />
                    <select
                      value={indicatorForm.valueType}
                      onChange={(event) =>
                        setIndicatorForm({ ...indicatorForm, valueType: event.target.value })
                      }
                    >
                      <option value="COUNT">COUNT</option>
                      <option value="DECIMAL">DECIMAL</option>
                      <option value="PERCENTAGE">PERCENTAGE</option>
                    </select>
                    <button type="submit">Add Indicator</button>
                  </form>
                </div>

                <div className="management-card">
                  <h2>Indicator List</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Value Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicators.map((indicator) => (
                        <tr key={indicator.id}>
                          <td>{indicator.code}</td>
                          <td>{indicator.name}</td>
                          <td>{indicator.description}</td>
                          <td>{indicator.unit}</td>
                          <td>{indicator.valueType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        ) : activePage === "Measurements" ? (
          <section className="dashboard">
            <h1>Measurements</h1>
            <p>Record and update operational performance measurements.</p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {loading ? (
              <p>Loading measurements...</p>
            ) : (
              <>
                <div className="management-card">
                  <h2>Add Measurement</h2>
                  <form onSubmit={addMeasurement} className="simple-form">
                    <select
                      value={measurementForm.officeId}
                      onChange={(event) =>
                        setMeasurementForm({ ...measurementForm, officeId: event.target.value })
                      }
                      required
                    >
                      <option value="">Select office</option>
                      {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={measurementForm.indicatorId}
                      onChange={(event) =>
                        setMeasurementForm({ ...measurementForm, indicatorId: event.target.value })
                      }
                      required
                    >
                      <option value="">Select indicator</option>
                      {indicators.map((indicator) => (
                        <option key={indicator.id} value={indicator.id}>
                          {indicator.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={measurementForm.periodStart}
                      onChange={(event) =>
                        setMeasurementForm({ ...measurementForm, periodStart: event.target.value })
                      }
                      required
                    />
                    <input
                      type="date"
                      value={measurementForm.periodEnd}
                      onChange={(event) =>
                        setMeasurementForm({ ...measurementForm, periodEnd: event.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Value"
                      value={measurementForm.value}
                      onChange={(event) =>
                        setMeasurementForm({ ...measurementForm, value: event.target.value })
                      }
                      required
                    />
                    <button type="submit">Add Measurement</button>
                  </form>
                </div>

                <div className="management-card">
                  <h2>Measurement List</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Office</th>
                        <th>Indicator</th>
                        <th>Period Start</th>
                        <th>Period End</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((measurement) => (
                        <tr key={measurement.id}>
                          <td>{measurement.office?.name || measurement.officeId}</td>
                          <td>{measurement.indicator?.name || measurement.indicatorId}</td>
                          <td>{measurement.periodStart.slice(0, 10)}</td>
                          <td>{measurement.periodEnd.slice(0, 10)}</td>
                          <td>
                            {editingMeasurementId === measurement.id ? (
                              <input
                                type="number"
                                step="any"
                                value={editingValue}
                                onChange={(event) => setEditingValue(event.target.value)}
                              />
                            ) : (
                              measurement.value
                            )}
                          </td>
                          <td>
                            {editingMeasurementId === measurement.id ? (
                              <button type="button" onClick={() => updateMeasurement(measurement)}>
                                Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMeasurementId(measurement.id);
                                  setEditingValue(measurement.value);
                                }}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        ) : (
          <section className="dashboard">
            <h1>{activePage}</h1>
            <p>This section will be implemented next.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
