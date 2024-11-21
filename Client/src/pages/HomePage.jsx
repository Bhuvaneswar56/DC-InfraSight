import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js/auto';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CPU Load',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Temperature',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Power Usage',
        data: [],
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'System Metrics',
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const timestamp = context[0].label;
            return new Date(timestamp).toLocaleTimeString();
          },
        },
      },
    },
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8800');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log('Received data:', newData);

        setMessages((prevMessages) => [...prevMessages, newData]);

        if (newData.type === 'metrics') {
          setChartData((prevChartData) => ({
            ...prevChartData,
            labels: [...prevChartData.labels, new Date(newData.data.lastUpdated).toLocaleString()],
            datasets: prevChartData.datasets.map((dataset) => {
              switch (dataset.label) {
                case 'CPU Load':
                  return { ...dataset, data: [...dataset.data, newData.data.cpuLoad] };
                case 'Temperature':
                  return { ...dataset, data: [...dataset.data, newData.data.temperature] };
                case 'Power Usage':
                  return { ...dataset, data: [...dataset.data, newData.data.powerUsage] };
                default:
                  return dataset;
              }
            }),
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default HomePage;