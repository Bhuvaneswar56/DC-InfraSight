import React, { useState, useEffect } from 'react';
import { Card } from '@material-tailwind/react';
import { Calendar, Search, Plus, Settings, Clock, ChevronRight } from 'lucide-react';
import { ChevronLeft, Server, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API_INSTANCE from '../services/auth.js';
import { Link } from "react-router-dom";


const MaintenancePage = () => {

    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
                        <p className="text-gray-500">Plan and Track Maintenance Activities</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Schedule Maintenance
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="Search maintenance tasks..." />
                    </div>
                    <div className="flex gap-2">
                        <select className="border rounded-lg px-4 py-2">
                            <option>All Status</option>
                            <option>Scheduled</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    {maintenance.map((ele) => {
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
                                                className="w-full h-full block text-center"
                                                state={{ maintenanceData: ele }}>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};


export default MaintenancePage;