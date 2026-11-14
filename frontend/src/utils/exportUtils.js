/**
 * Export utilities for reports and data tables
 */

export function exportToCSV(data, filename = "postpilot-export.csv") {
  if (!data || !data.length) {
    alert("No data available to export.");
    return false;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","));

  // Value rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function triggerPrint() {
  window.print();
}
