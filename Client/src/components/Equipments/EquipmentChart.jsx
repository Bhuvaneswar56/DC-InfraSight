import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { useState, useEffect } from 'react';
import API_INSTANCE from '../../services/auth.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend
);

const getColorForMetric = (metricType) => {
    const colors = {
        temperature: 'rgb(255, 99, 132)',
        cpuLoad: 'rgb(54, 162, 235)',
        powerUsage: 'rgb(75, 192, 192)',
        airflow: 'rgb(153, 102, 255)',
        batteryLevel: 'rgb(255, 159, 64)',
        inputVoltage: 'rgb(201, 203, 207)',
        outputVoltage: 'rgb(255, 205, 86)',
        memoryUsage: 'rgb(59, 130, 246)'
    };
    return colors[metricType] || 'rgb(0, 0, 0)';
};

function EquipmentChart({ equipmentId }) {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getEquipmentMetrics() {
        try {
            setLoading(true);
            const response = await API_INSTANCE.get(`/websocket/${equipmentId}`);
            const metricsData = response.data.data;
            
            // Group metrics by type
            const groupedMetrics = {};
            metricsData.forEach(metric => {
                if (!groupedMetrics[metric.type]) {
                    groupedMetrics[metric.type] = {
                        values: [],
                        timestamps: []
                    };
                }
                groupedMetrics[metric.type].values.push(metric.value);
                groupedMetrics[metric.type].timestamps.push(new Date(metric.timestamp));
            });

            // Calculate min, max, avg for each metric type
            const processedMetrics = Object.keys(groupedMetrics).map(type => ({
                type: type,
                avgValue: groupedMetrics[type].values.reduce((a, b) => a + b, 0) / groupedMetrics[type].values.length,
                maxValue: Math.max(...groupedMetrics[type].values),
                minValue: Math.min(...groupedMetrics[type].values),
                timestamps: groupedMetrics[type].timestamps,
                values: groupedMetrics[type].values
            }));

            setMetrics(processedMetrics);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEquipmentMetrics();
        const interval = setInterval(getEquipmentMetrics, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, [equipmentId]);

    const barChartData = {
        labels: metrics.map(m => m.type),
        datasets: [
            {
                label: 'Average Value',
                data: metrics.map(m => m.avgValue),
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                hoverBackgroundColor: 'rgba(255, 159, 64, 1)',
            },
            {
                label: 'Maximum Value',
                data: metrics.map(m => m.maxValue),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Minimum Value',
                data: metrics.map(m => m.minValue),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                hoverBackgroundColor: 'rgba(75, 192, 192, 1)', 
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Metrics Summary',
                color: '#333',
                font: { size: 14 }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Metric Type'
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    };

    const lineChartData = {
        labels: metrics[0]?.timestamps.map(t => new Date(t).toLocaleTimeString()) || [],
        datasets: metrics.map(metric => ({
            label: metric.type,
            data: metric.values,
            borderColor: getColorForMetric(metric.type),
            tension: 0.1,
            fill: false
        }))
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Real-time Performance (Last 24 Hours)',
                color: '#333',
                font: { size: 14 }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <div className="loader"></div>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading metrics data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
            
            <div className="bg-white rounded-lg shadow p-4">
                <div className="h-[300px]">
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="h-[300px]">
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
            </div>
        </div>
    );
}

export default EquipmentChart;