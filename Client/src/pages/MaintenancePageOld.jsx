import React, { useState } from 'react';
import { Card } from '@material-tailwind/react';
import { Calendar, Search, Plus, Settings, Clock, ChevronRight } from 'lucide-react';
import { ChevronLeft, Server, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockMaintenanceData = [
    { name: 'Jan', completed: 25, scheduled: 30 },
    { name: 'Feb', completed: 28, scheduled: 32 },
    { name: 'Mar', completed: 22, scheduled: 25 },
    { name: 'Apr', completed: 30, scheduled: 35 },
    { name: 'May', completed: 26, scheduled: 28 }
];

// Main component with all sub-components defined within

const MaintenancePage1 = () => {

    const [activeView, setActiveView] = useState('schedule');

    // Schedule View Component

    const MaintenanceSchedule = () => {

        const [viewMode, setViewMode] = useState('month');

        return (
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
                        <p className="text-gray-500">Plan and Track Maintenance Activities</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                        onClick={() => setActiveView('new')}
                    >
                        <Plus className="w-4 h-4" /> Schedule Maintenance
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            placeholder="Search maintenance tasks..." />
                    </div>
                    <div className="flex gap-2">
                        <select className="border rounded-lg px-4 py-2">
                            <option>All Status</option>
                            <option>Scheduled</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                        {/* <button
                            className={`px-4 py-2 rounded-lg ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'border'}`}
                            onClick={() => setViewMode('month')}>
                            Month
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'border'}`}
                            onClick={() => setViewMode('list')}>
                            List
                        </button> */}
                    </div>
                </div>

                {/* Calendar View */}

                {/* {viewMode === 'month' && (
                    <Card className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">November 2024</h2>
                            <div className="flex gap-2">
                                <button className="p-2 border rounded-lg">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="p-2 border rounded-lg">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className="aspect-square border rounded-lg p-2 hover:bg-gray-50">
                                    <div className="text-sm">{i + 1}</div>
                                    {i % 7 === 3 && (
                                        <div className="mt-1 text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5">
                                            2 tasks
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )} */}

                {/* List View */}

                {/* {viewMode === 'list' && ( */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Settings className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Server Maintenance - Rack A{i}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Nov {10 + i}, 2024
                                            <Clock className="w-4 h-4 ml-2" /> 10:00 AM
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">Duration</p>
                                        <p className="text-sm text-gray-500">2 hours</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">Status</p>
                                        <p className="text-sm text-blue-500">Scheduled</p>
                                    </div>
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setActiveView('details')}
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* )} */}

                {/* Analytics */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Maintenance Trends</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockMaintenanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
                                    <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" name="Scheduled" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Upcoming Maintenance</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Server className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">Server Maintenance</h3>
                                        <p className="text-sm text-gray-500">Rack B{i} - Nov {20 + i}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">10:00 AM</p>
                                        <p className="text-sm text-gray-500">2 hours</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div> */}
            </div>
        );
    };

    // Details View Component

    const MaintenanceDetails = () => {
        // ... (MaintenanceDetails component code remains the same)
    };

    // Navigation Header

    const renderHeader = () => (
        <div className="border-b mb-6">
            <div className="flex gap-4 p-4">
                <button
                    onClick={() => setActiveView('schedule')}
                    className={`px-4 py-2 rounded-lg ${activeView === 'schedule' ? 'bg-blue-500 text-white' : 'border'}`}
                >
                    Schedule
                </button>
                <button
                    onClick={() => setActiveView('details')}
                    className={`px-4 py-2 rounded-lg ${activeView === 'details' ? 'bg-blue-500 text-white' : 'border'}`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveView('new')}
                    className={`px-4 py-2 rounded-lg ${activeView === 'new' ? 'bg-blue-500 text-white' : 'border'}`}
                >
                    New Maintenance
                </button>
            </div>
        </div>
    );

    // Main Render

    return (
        <div className="min-h-screen bg-gray-50">
            <MaintenanceSchedule />
            {/* {renderHeader()}
            {activeView === 'schedule' && <MaintenanceSchedule />}
            {activeView === 'details' && <MaintenanceDetails />} */}
        </div>
    );

};

export default MaintenancePage1;
