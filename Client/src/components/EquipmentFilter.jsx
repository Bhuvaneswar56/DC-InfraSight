import React from "react";
import { Search } from "react-icons";


const EquipmentFilter = ({
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    fetchFilteredData,
}) => {
    return (
        <div className="flex gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search equipment..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Type Filter Dropdown */}
            <select
                className="border rounded-lg px-4 py-2"
                value={typeFilter}
                onChange={(e) => {
                    setTypeFilter(e.target.value);
                    fetchFilteredData(searchTerm, e.target.value, statusFilter);
                }}
            >
                <option value="All Types">All Types</option>
                <option value="SERVER">SERVER</option>
                <option value="CRAH">CRAH</option>
                <option value="UPS">UPS</option>
                <option value="PDU">PDU</option>
            </select>

            {/* Status Filter Dropdown */}
            <select
                className="border rounded-lg px-4 py-2"
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchFilteredData(searchTerm, typeFilter, e.target.value);
                }}
            >
                <option value="All Status">All Status</option>
                <option value="operational">operational</option>
                <option value="warning">warning</option>
                <option value="critical">critical</option>
                <option value="maintenance">maintenance</option>
                <option value="offline">offline</option>
            </select>
        </div>
    );
};


export default EquipmentFilter
