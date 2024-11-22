import React from 'react';
import { Card } from "@material-tailwind/react";
import { Power, ThermometerSun, HardDrive, Activity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';


const EquipmentDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const equipmentData = state?.equipmentData;

    if (!equipmentData) {
        return <div>Loading...</div>;
    }

    const handleGoBack = () => {
        navigate("/equipments");
    };


    const performanceData = [
        { time: '12:00', cpu: 65, memory: 72, network: 45 },
        { time: '13:00', cpu: 70, memory: 68, network: 52 },
        { time: '14:00', cpu: 58, memory: 75, network: 48 },
        { time: '15:00', cpu: 75, memory: 70, network: 55 }
    ];

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <button className="text-blue-500" onClick={handleGoBack}>← Back</button>
                        <h1 className="text-2xl font-bold">{equipmentData.name} Details</h1>
                    </div>
                    <p className="text-gray-500">{equipmentData.serialNumber}</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg">
                        Edit Details
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Schedule Maintenance
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Power className="w-6 h-6 text-green-500" />
                        <div>
                            <p className="text-gray-500">Status</p>
                            <p className="text-lg font-semibold">{equipmentData.status}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <ThermometerSun className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className="text-gray-500">Temperature</p>
                            <p className="text-lg font-semibold">{equipmentData.metrics.temperature}°C</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <HardDrive className="w-6 h-6 text-blue-500" />
                        <div>
                            <p className="text-gray-500">Storage</p>
                            <p className="text-lg font-semibold">{equipmentData.metrics.memoryUsage}% Used</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-purple-500" />
                        <div>
                            <p className="text-gray-500">CPU Load</p>
                            <p className="text-lg font-semibold">{equipmentData.metrics.cpuLoad}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Performance Chart */}
                <Card className="p-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500">Performance Chart Placeholder</p>
                        </div>
                    </div>
                </Card>

                {/* Specifications */}
                <Card className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Specifications</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Cooling Capacity', value: equipmentData.specifications.coolingCapacity },
                            { label: 'Current', value: equipmentData.specifications.current },
                            { label: 'Power Rating', value: equipmentData.specifications.powerRating },
                            { label: 'Voltage', value: equipmentData.specifications.voltage },
                        ].map((spec, i) => (
                            <div key={i} className="flex justify-between">
                                <span className="text-gray-500">{spec.label}</span>
                                <span className="font-medium">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Maintenance History */}
            <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Maintenance History</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Routine Maintenance</p>
                                <p className="text-sm text-gray-500">Performed by John Doe</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">Oct {15 - i}, 2023</p>
                                <p className="text-sm text-gray-500">Duration: 2h 30m</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};


export default EquipmentDetails