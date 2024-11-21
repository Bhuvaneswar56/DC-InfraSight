import React from 'react';
import { Card } from "@material-tailwind/react";
import { Server, Plus, Search } from 'lucide-react';


const EquipmentList = () => {

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Equipment Management</h1>
                    <p className="text-gray-500">All Data Center Equipment</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Equipment
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <input type="text" placeholder="Search equipment..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <select className="border rounded-lg px-4 py-2">
                    <option>All Types</option>
                    <option>Servers</option>
                    <option>Network</option>
                    <option>Storage</option>
                </select>
                <select className="border rounded-lg px-4 py-2">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Offline</option>
                </select>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="p-4 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <Server className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-semibold">Server-A{i}</h3>
                                <p className="text-sm text-gray-500">Rack A{i} - Unit 12</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Active
                                </p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Uptime</p>
                                <p className="font-medium">99.9%</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Temperature</p>
                                <p className="font-medium">24°C</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Power</p>
                                <p className="font-medium">450W</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 text-blue-500 border border-blue-500 rounded-lg block">
                            View Details
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};


export default EquipmentList