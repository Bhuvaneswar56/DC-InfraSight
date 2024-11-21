import React from 'react';
import { Card } from "@material-tailwind/react";
import { Server, Power, ThermometerSun, HardDrive, Plus, Search, Activity } from 'lucide-react';


const PreviewTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-4 mb-6">
    <button onClick={() => setActiveTab('list')}
      className={`px-4 py-2 rounded-lg ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'border'}`}
    >
      Equipment List
    </button>
    <button onClick={() => setActiveTab('details')}
      className={`px-4 py-2 rounded-lg ${activeTab === 'details' ? 'bg-blue-500 text-white' : 'border'}`}
    >
      Equipment Details
    </button>
  </div>

);

const EquipmentListView = () => {

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

const EquipmentDetailsView = () => {

  const performanceData = [
    { time: '12:00', cpu: 65, memory: 72, network: 45 },
    { time: '13:00', cpu: 70, memory: 68, network: 52 },
    { time: '14:00', cpu: 58, memory: 75, network: 48 },
    { time: '15:00', cpu: 75, memory: 70, network: 55 }
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <button className="text-blue-500">← Back</button>
            <h1 className="text-2xl font-bold">Server-A1 Details</h1>
          </div>
          <p className="text-gray-500">Rack A1 - Unit 12</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg">
            Edit Details
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Power className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-gray-500">Status</p>
              <p className="text-lg font-semibold">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ThermometerSun className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-gray-500">Temperature</p>
              <p className="text-lg font-semibold">24°C</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-gray-500">Storage</p>
              <p className="text-lg font-semibold">82% Used</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-gray-500">CPU Load</p>
              <p className="text-lg font-semibold">65%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Performance Chart */}
        <Card className="p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Performance Chart Placeholder</p>
            </div>
          </div>
        </Card>

        {/* Specifications */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
          <div className="space-y-3">
            {[
              { label: 'Model', value: 'Dell PowerEdge R740' },
              { label: 'Serial Number', value: 'SN78392832' },
              { label: 'CPU', value: '2x Intel Xeon Gold 6230R' },
              { label: 'RAM', value: '384GB DDR4' },
              { label: 'Storage', value: '4x 1.92TB SSD' },
              { label: 'Network', value: '4x 10GbE' },
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Routine Maintenance</p>
                <p className="text-sm text-gray-500">Performed by John Doe</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Oct {15 - i}, 2023</p>
                <p className="text-sm text-gray-500">Duration: 2h 30m</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Main preview component with useState

const EquipmentPage = () => {

  const [activeTab, setActiveTab] = React.useState('list');

  return (
    <div className="min-h-screen bg-gray-50">
      <PreviewTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'list' ? <EquipmentListView /> : <EquipmentDetailsView />}
    </div>
  );

};

export default EquipmentPage;
