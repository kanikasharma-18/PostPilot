
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
    "Dashboard",
    "Divisions & Offices",
    "Indicators",
    "Measurements"
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">PostPilot</h2>
        <p className="subtitle">POSTAL PERFORMANCE SYSTEM</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={activePage === item ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActivePage(item);
                if (item === "Divisions & Offices") {
                  loadDivisionsAndOffices();
                }
                if (item === "Indicators") {
                  loadIndicators();
                }
                if (item === "Measurements") {
                  loadMeasurements();
                }
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          Department of Posts
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h3>{activePage}</h3>
          <span>PostPilot Administration</span>
        </header>

        {activePage === "Dashboard" ? (
          <section className="dashboard">
            <h1>Dashboard Overview</h1>
            <p>Monitor postal performance across divisions and offices.</p>

            <div className="stats-grid">
              {Object.keys(counts).map((item) => (
                <div className="stat-card" key={item}>
                  <span>{item}</span>
                  <h2>{counts[item]}</h2>
                </div>
              ))}
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="welcome-card">
              <h2>Welcome to PostPilot</h2>
              <p>
                Your central platform for monitoring and managing
                postal performance data.
              </p>
            </div>
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
