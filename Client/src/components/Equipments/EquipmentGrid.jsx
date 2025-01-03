import React from 'react';
import { Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Server, Trash2 } from 'lucide-react';

import API_INSTANCE from '../../services/auth.js';

import { toast } from 'react-toastify';


function EquipmentGrid({ equipmentList, setEquipmentList }) {

    async function handleDelete(equipId) {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
            if (!confirmDelete) return;

            await API_INSTANCE.delete(`/equipment/${equipId}`);
            setEquipmentList((prevList) => prevList.filter((item) => item._id !== equipId));
            toast.success("Equipment deleted successfully.");
        } catch (error) {
            console.error("Failed to delete equipment:", error);
            toast.info("Failed to delete equipment");
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(equipmentList) && equipmentList.map((ele) => (
                <Card key={ele._id} className="p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Server className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-semibold">{ele.name}</h3>
                                <p className="text-sm text-gray-500">{ele.serialNumber}</p>
                            </div>
                        </div>
                        {/* Delete Button */}
                        <button className="text-gray-500 hover:text-red-500"
                            onClick={() => handleDelete(ele._id)} title="Delete Equipment">
                            <Trash2 className="w-5 h-5" />
                        </button>
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
                            <p className="font-medium">{ele.specifications.powerRating}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Temperature</p>
                            <p className="font-medium">{ele.specifications.temperature}°C</p>
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
    )
}

export default EquipmentGrid