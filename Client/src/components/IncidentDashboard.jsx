import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const IncidentDashboard = ({ incidents }) => {
  const [chartData, setChartData] = useState(null);

  // Process data for the pie chart
  const processData = (data) => {
    const statusCounts = data.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts), // Status labels (open, resolved, etc.)
      datasets: [
        {
          label: "Incident Status Distribution",
          data: Object.values(statusCounts), // Count of each status
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  // Update the chart data when incidents change
  useEffect(() => {
    if (incidents && incidents.length > 0) {
      const data = processData(incidents);
      setChartData(data);
    }
  }, [incidents]);

  return (
    <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
      <h2>Incident Dashboard</h2>
      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
};

export default IncidentDashboard;
