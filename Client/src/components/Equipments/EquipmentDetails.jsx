import React, { useEffect, useState } from 'react';
import { Card } from "@material-tailwind/react";
import { Power, ThermometerSun, Activity, Zap, TableRowsSplit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_INSTANCE from '../../services/auth.js';
import moment from 'moment';
import { toast } from 'react-toastify';
import EquipmentChart from './EquipmentChart.jsx';


const EquipmentDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const equipmentData = state?.equipmentData;

    const [maintenanceHistory, setMaintenanceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'select',
        priority: 'select',
        status: 'select',
        scheduled: '',
        completed: '',
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

    const handleCreateMaintenance = async (e) => {
        e.preventDefault();
        try {
            const { scheduled, completed } = formData;
            // Convert the scheduled and completed dates to ISO format
            const isoScheduled = new Date(scheduled).toISOString();
            const isoCompleted = new Date(completed).toISOString();

            const maintenanceData = {
                ...formData,
                scheduled: isoScheduled, // Add ISO formatted scheduled date
                completed: isoCompleted, // Add ISO formatted completed date
                equip_id: equipmentData?._id,
            };

            await API_INSTANCE.post('/maintenance/create', maintenanceData);
            toast.success("Maintenance created successfully!");
            setIsModalOpen(false);
            setFormData({
                title: '',
                description: '',
                type: 'select',
                priority: 'select',
                status: 'select',
                scheduled: '',
                completed: '',
            });
            getMaintenanceByEquipId(); // Refresh the maintenance history
        } catch (err) {
            console.error("Failed to create maintenance: ", err);
            toast.info("Error in scheduling maintenance!");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
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
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Schedule Maintenance
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4 text-center">Create Maintenance</h2>
                        <form onSubmit={handleCreateMaintenance} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Enter description"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <label className="block text-gray-700">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="select" disabled>Select type</option>
                                        <option value="preventive">Preventive</option>
                                        <option value="corrective">Corrective</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="select" disabled>Select priority</option>
                                        <option value="critical">Critical</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="select" disabled>Select status</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700">Scheduled Start Date</label>
                                <input
                                    type="datetime-local"
                                    name="scheduled"
                                    value={formData.scheduled}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Scheduled End Date</label>
                                <input
                                    type="datetime-local"
                                    name="completed"
                                    value={formData.completed}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 text-white bg-blue-500 rounded-lg ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!isFormValid} // Disable button if form is incomplete
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                    <EquipmentChart equipmentId={equipmentData._id} />
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