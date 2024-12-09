import React, { useState, useEffect } from 'react';
import { Card } from '@material-tailwind/react';
import { Calendar, Search, Plus, Settings, Clock, ChevronRight } from 'lucide-react';
import API_INSTANCE from '../services/auth.js';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const MaintenancePage = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Add filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        equip_id: '',
        title: '',
        description: '',
        type: 'select',
        status: 'select',
        priority: 'select',
        scheduled: '',
        completed: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

    const getAllMaintenance = async () => {
        try {
            const response = await API_INSTANCE.get(`/maintenance/all`);
            setMaintenance(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMaintenance();
    }, []);


    // Add filter logic
    const filteredMaintenance = maintenance.filter(task => {
        const matchSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All Status" || task.status.toLowerCase() === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
                // equip_id: equipmentData?._id,
            };

            await API_INSTANCE.post('/maintenance/create', maintenanceData);
            toast.success("Maintenance created successfully!");
            setIsModalOpen(false);
            setFormData({
                equip_id: '',
                title: '',
                description: '',
                type: 'select',
                status: 'select',
                priority: 'select',
                scheduled: '',
                completed: '',
            });
        } catch (err) {
            console.error("Failed to create maintenance: ", err);
            toast.info("Error in scheduling maintenance!");
        }
    };
    if (!Array.isArray(maintenance) || maintenance.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No maintenance tasks available</p>
            </div>
        );
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
                        <p className="text-gray-500">Plan and Track Maintenance Activities</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                        onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Schedule Maintenance
                    </button>
                </div>

                {/* { Modal } */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg w-[600px]">
                            <h2 className="text-lg font-semibold mb-4 text-center">Create Maintenance</h2>
                            <form onSubmit={handleCreateMaintenance} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Equipment Id</label>
                                    <input
                                        type="text"
                                        name="equip_id"
                                        value={formData.equip_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Enter Equipment Id"
                                    />
                                </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
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
                                    <div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
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


                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg" 
                            placeholder="Search maintenance tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            className="border rounded-lg px-4 py-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All Status">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    {filteredMaintenance.map((ele) => {
                        const scheduledDate = new Date(ele.scheduled);
                        const completedDate = new Date(ele.completed);

                        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        });
                        const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        });

                        const durationMs = completedDate - scheduledDate;
                        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                        const durationDays = Math.floor(durationHours / 24);
                        const remainingHours = durationHours % 24;
                        const duration = `${durationDays > 0 ? `${durationDays} day(s) ` : ''}${remainingHours} hour(s)`;

                        return (
                            <Card key={ele._id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{ele.description}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> {formattedDate}
                                                <Clock className="w-4 h-4 ml-2" /> {formattedTime}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Duration</p>
                                            <p className="text-sm text-gray-500">{duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Status</p>
                                            <p className="text-sm text-blue-500">{ele.status}</p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">


                                            <Link to={`/maintenance/${ele._id}`}
                                                className="w-full h-full block text-center">
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;