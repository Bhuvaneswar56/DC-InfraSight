import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import EquipmentAdd from './EquipmentAdd';
import EquipmentFilter from './EquipmentFilter';
import EquipmentGrid from './EquipmentGrid';
import API_INSTANCE from '../services/auth.js';
import { toast } from 'react-toastify';

const EquipmentList = ({ equipmentList, setEquipmentList }) => {
    if (!equipmentList || equipmentList.length === 0) {
        return <h1 className="text-2xl font-bold">No equipment details available.</h1>;
    }

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");  // Set default value
    const [statusFilter, setStatusFilter] = useState("All Status");  // Set default value
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter function
    const filteredEquipment = equipmentList.filter(equipment => {
        const matchSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === "All Types" || equipment.type === typeFilter;
        const matchStatus = statusFilter === "All Status" || equipment.status === statusFilter;

        return matchSearch && matchType && matchStatus;
    });

    const handleAddEquipment = async (formData) => {
        const parsedData = {
            ...formData,
            specifications: {
                powerRating: Number(formData.specifications.powerRating),
                voltage: Number(formData.specifications.voltage),
                current: Number(formData.specifications.current),
                maxLoad: Number(formData.specifications.maxLoad),
                temperature: Number(formData.specifications.temperature),
            },
        };
        try {
            await API_INSTANCE.post('/equipment', parsedData);
            window.location.reload();
            toast.success("Equipment added successfully.");
        } catch (error) {
            console.error("Error adding equipment:", error.message);
            toast.info("Failed to add equipment");
        }
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
                    <EquipmentAdd isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEquipment} />
                </div>
            </div>

            <EquipmentFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <EquipmentGrid
                equipmentList={filteredEquipment}  // Pass filtered data instead of original
                setEquipmentList={setEquipmentList}
            />
        </div>
    );
};

export default EquipmentList;