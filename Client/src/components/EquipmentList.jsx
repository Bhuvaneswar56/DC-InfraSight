import React, { useState } from 'react';
import { Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Server, Plus, Search } from 'lucide-react';
import EquipmentAdd from './EquipmentAdd';


const EquipmentList = ({ equipmentList }) => {

    if (!equipmentList || equipmentList.length === 0) {
        return <h1 className="text-2xl font-bold">No equipment details available.</h1>;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEquipment = (formData) => {
        console.log("New Equipment Added: ", formData);
        // Perform API call or state update here
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex gap-4 mb-6 ml-2">
                <p className="px-4 py-2 rounded-lg bg-blue-500 text-white">
                    Equipment List
                </p>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Equipment Management</h1>
                    <p className="text-gray-500">All Data Center Equipment</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                        onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Equipment
                    </button>
                    <EquipmentAdd
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleAddEquipment}
                    />
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
                {Array.isArray(equipmentList) && equipmentList.map((ele) => (
                    <Card key={ele._id} className="p-4 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <Server className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-semibold">{ele.name}</h3>
                                <p className="text-sm text-gray-500">{ele.serialNumber}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">
                                    <span className={`inline-block w-2 h-2 rounded-full
                                        ${ele.status === "operational" ? 'bg-green-500' : 'bg-red-500'} mr-2`}>
                                    </span>
                                    {ele.status === "operational" ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Power Rating</p>
                                <p className="font-medium">{ele.specifications.powerRating}%</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Cooling Capacity</p>
                                <p className="font-medium">{ele.specifications.coolingCapacity}°C</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500">Power</p>
                                <p className="font-medium">{ele.specifications.voltage}W</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 text-blue-500 border border-blue-500 rounded-lg block">
                            <Link to={`/equipment/${ele._id}`}
                                className="w-full h-full block text-center"
                                state={{ equipmentData: ele }}>
                                View Details
                            </Link>
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};


export default EquipmentList