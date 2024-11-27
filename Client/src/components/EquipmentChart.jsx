import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import API_INSTANCE from '../services/auth.js'

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function EquipmentChart({ equipmentId }) {

    const [equipData, setEqData] = useState([]);

    async function getEquipmentMetrics() {
        try {
            // console.log("equipment id : ", equipmentId);
            let res = await API_INSTANCE.get(`/websocket/${equipmentId}`);
            // console.log(res.data.data);
            setEqData(res.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getEquipmentMetrics();
    }, [equipmentId])

    // Display a loading animation while data is being fetched
    if (!equipData || !Array.isArray(equipData) || equipData.length === 0) {
        console.log("equipData is empty or undefined. Rendering loading screen.");
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <div className="loader"></div>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading data, please wait...</p>
            </div>
        );
    }
    
    console.log("equip data length : ", equipData.length);

    const chartData = {
        labels: equipData.length > 0 ? equipData.map((item) => item?.type || 'Unknown') : ['Type A', 'Type B', 'Type C'],
        datasets: [
            {
                label: 'Average Value',
                data: equipData.length > 0 ? equipData.map((item) => item.avgValue || 0) : [10, 20, 30],
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                hoverBackgroundColor: 'rgba(255, 159, 64, 1)',
            },
            {
                label: 'Maximum Value',
                data: equipData.length > 0 ? equipData.map((item) => item.maxValue || 0) : [30, 50, 60],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Minimum Value',
                data: equipData.length > 0 ? equipData.map((item) => item.minValue || 0) : [5, 15, 20],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                hoverBackgroundColor: 'rgba(75, 192, 192, 1)', 
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
                display: false,
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
        <>
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
            <div className="h-64 bg-gray-50 rounded-lg p-4">
                {/* <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Performance Chart Placeholder</p>
                </div> */}
                <div className="w-full max-w-3xl mx-auto px-5">
                    <Bar data={chartData} options={chartOptions} height={400} />
                </div>
            </div>
        </>
    );
}

export default EquipmentChart;
