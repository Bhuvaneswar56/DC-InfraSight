import React from "react";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const EquipmentFilter = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
}) => {
  const [isMobileFilter, setIsMobileFilter] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search equipment..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters Container */}
      <div className="relative shrink-0">
        {/* Mobile Filter Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg md:hidden"
          onClick={() => setIsMobileFilter(!isMobileFilter)}
        >
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>

        <div
          className={`${isMobileFilter ? "flex" : "hidden"} 
          md:flex
          gap-2
          absolute md:relative 
          top-full md:top-auto 
          right-0 md:right-auto
          mt-2 md:mt-0
          bg-white md:bg-transparent
          p-2 md:p-0
          rounded-lg
          shadow-lg md:shadow-none
          z-10 md:z-auto
          flex-col md:flex-row
          min-w-[200px] md:min-w-0
        `}
        >
          <select
            className="border rounded-lg px-4 py-2 w-full md:w-auto whitespace-nowrap"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All Types">All Types</option>
            <option value="SERVER">SERVER</option>
            <option value="CRAH">CRAH</option>
            <option value="UPS">UPS</option>
            <option value="PDU">PDU</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2 w-full md:w-auto whitespace-nowrap"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="operational">operational</option>
            <option value="warning">warning</option>
            <option value="critical">critical</option>
            <option value="maintenance">maintenance</option>
            <option value="offline">offline</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFilter;
