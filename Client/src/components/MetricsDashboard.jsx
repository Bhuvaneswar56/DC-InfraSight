import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MetricsDashboard({ metricsData }) {
  // Display a loading animation while data is being fetched
  if (!metricsData || metricsData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className="loader"></div>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading data, please wait...</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: metricsData.map((item) => item._id?.type || 'Unknown'),
    datasets: [
      {
        label: 'Average Value',
        data: metricsData.map((item) => item.avgValue || 0),
        backgroundColor: 'rgba(255, 159, 64, 0.8)', // Orange gradient
        hoverBackgroundColor: 'rgba(255, 159, 64, 1)', // Brighter orange
      },
      {
        label: 'Maximum Value',
        data: metricsData.map((item) => item.maxValue || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue gradient
        hoverBackgroundColor: 'rgba(54, 162, 235, 1)', // Brighter blue
      },
      {
        label: 'Minimum Value',
        data: metricsData.map((item) => item.minValue || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.8)', // Green gradient
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Brighter green
      },
    ],
  };

  // Chart options for better user experience
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows flexible height
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: 'Metrics Data Visualization',
        color: '#222',
        font: {
          size: 20,
          family: "'Poppins', sans-serif",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)', // Dark background for tooltips
        titleFont: {
          size: 14,
          family: "'Poppins', sans-serif",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Machines',
          color: '#444',
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
          color: '#444',
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation for transitions
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Bar data={chartData} options={chartOptions} height={400} />
    </div>
  );
}

export default MetricsDashboard;
