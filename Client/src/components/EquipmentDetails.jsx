import React, { useEffect, useState } from 'react';
import { Card } from "@material-tailwind/react";
import { Power, ThermometerSun, Activity, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_INSTANCE from '../services/auth.js';
import moment from 'moment';


const EquipmentDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const equipmentData = state?.equipmentData;

    const [maintenanceHistory, setMaintenanceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!equipmentData) {
        return <div>Loading...</div>;
    }

    const handleGoBack = () => {
        navigate("/equipments");
    };

    async function getMaintenanceByEquipId() {
        try {
            setLoading(true);
            setError(null);
            const res = await API_INSTANCE.get(`/maintenance/equipmentId/${equipmentData?._id}`);
            setMaintenanceHistory(res.data.data);
        } catch (err) {
            console.error("Failed to fetch maintenance history: ", err);
            setError("Unable to fetch maintenance history.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMaintenanceByEquipId();
    }, [equipmentData?._id]);

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
                            <p className="text-lg font-semibold">{equipmentData.specifications.temperature}°C</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-blue-500" />
                        <div>
                            <p className="text-gray-500">Current</p>
                            <p className="text-lg font-semibold">{equipmentData.specifications.current}A</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-purple-500" />
                        <div>
                            <p className="text-gray-500">Max Load</p>
                            <p className="text-lg font-semibold">{equipmentData.specifications.maxLoad}</p>
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
                            { label: 'Manufacturer', value: equipmentData.manufacturer },
                            { label: 'Model', value: equipmentData.model },
                            { label: 'Temperature', value: equipmentData.specifications.temperature },
                            { label: 'Current', value: equipmentData.specifications.current },
                            { label: 'Power Rating', value: equipmentData.specifications.powerRating },
                            { label: 'Voltage', value: equipmentData.specifications.voltage },
                            { label: 'Max Load', value: equipmentData.specifications.maxLoad },
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
                    {maintenanceHistory.length > 0 ? (
                        maintenanceHistory.map((mH) => (
                            <div key={mH._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Routine Maintenance</p>
                                    <p className="text-sm text-gray-500">Performed by {mH.user_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{moment(mH.createdAt).format('MMMM Do YYYY, h:mm A')}</p>
                                    <p className="text-sm text-gray-500">Duration: 2h 30m</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">No maintenance history available.</div>
                    )}
                </div>
            </Card>
        </div>
    );
};


export default EquipmentDetails