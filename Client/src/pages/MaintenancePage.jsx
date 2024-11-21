import * as React from 'react';
import { useState } from 'react';
import { Card } from '@material-tailwind/react';
import { Calendar, Plus, Settings, Clock, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { Search, ChevronRight, ChevronLeft, Server } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockMaintenanceData = [
  { name: 'Jan', completed: 25, scheduled: 30 },
  { name: 'Feb', completed: 28, scheduled: 32 },
  { name: 'Mar', completed: 22, scheduled: 25 },
  { name: 'Apr', completed: 30, scheduled: 35 },
  { name: 'May', completed: 26, scheduled: 28 }
];

const MaintenancePage = () => {
  const [activeView, setActiveView] = useState('details'); // Set to 'details' to show details view by default

  const MaintenanceSchedule = () => {
    const [viewMode, setViewMode] = useState('month');

    return (
      <div className="p-6 space-y-6">
        {/* Schedule view implementation */}
        <h1>Schedule View</h1>
      </div>
    );
  };

  const MaintenanceDetails = () => {
    const [selectedTab, setSelectedTab] = useState('details');

    return (
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <button className="text-blue-500 hover:text-blue-600">← Back</button>
              <div>
                <h1 className="text-2xl font-bold">Server Maintenance - Rack A1</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500 text-sm">Scheduled for Nov 15, 2024</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50">
              Reschedule
            </button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
              Mark as Complete
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Status', icon: Activity, value: 'Scheduled', subtext: '2 days until maintenance', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
            { title: 'Duration', icon: Clock, value: '2 hours', subtext: '10:00 AM - 12:00 PM', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
            { title: 'Priority', icon: AlertTriangle, value: 'High', subtext: 'Critical system', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
            { title: 'Type', icon: Settings, value: 'Preventive', subtext: 'Regular maintenance', bgColor: 'bg-green-100', textColor: 'text-green-600' }
          ].map((item, i) => (
            <Card key={i} className="p-4 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className={`p-2 ${item.bgColor} rounded-lg`}>
                  <item.icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                <span className="text-sm text-gray-500">#{i + 1001}</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">{item.title}</p>
              <p className="text-lg font-semibold">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist and Details */}
          <Card className="p-4 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Maintenance Checklist</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">4/6 completed</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { task: 'Inspect server hardware', status: 'completed', time: '9:30 AM' },
                { task: 'Clean cooling fans', status: 'completed', time: '9:45 AM' },
                { task: 'Check power supply', status: 'in_progress', time: '10:00 AM' },
                { task: 'Test backup systems', status: 'pending', time: '10:15 AM' },
                { task: 'Update firmware', status: 'completed', time: '10:30 AM' },
                { task: 'Verify network connectivity', status: 'completed', time: '10:45 AM' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={item.status === 'completed' ? 'line-through text-gray-500' : 'font-medium'}>
                        {item.task}
                      </span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    {item.status === 'in_progress' && (
                      <span className="text-xs text-blue-500">In progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </Card>

          {/* Equipment Details */}
          <div className="space-y-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Equipment Details</h2>
              <div className="space-y-4">
                {[
                  { label: 'Equipment ID', value: 'SRV-001' },
                  { label: 'Manufacturer', value: 'Dell' },
                  { label: 'Model', value: 'PowerEdge R740' },
                  { label: 'Serial Number', value: 'DELL4827JK' },
                  { label: 'Location', value: 'Rack A1, Unit 5' },
                  { label: 'Last Maintenance', value: 'Oct 15, 2024' },
                  { label: 'Status', value: 'Operating normally' }
                ].map((detail, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Maintenance History</h2>
              <div className="space-y-4">
                {[
                  { date: 'Oct 15, 2024', type: 'Routine', status: 'Completed' },
                  { date: 'Sep 15, 2024', type: 'Emergency', status: 'Completed' },
                  { date: 'Aug 15, 2024', type: 'Routine', status: 'Completed' }
                ].map((history, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{history.date}</p>
                      <p className="text-sm text-gray-500">{history.type}</p>
                    </div>
                    <span className="text-green-500 text-sm">{history.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Notes and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Maintenance Notes</h2>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                Save Notes
              </button>
            </div>
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add maintenance notes..."
            ></textarea>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">Previous Note</span>
                  <span className="text-xs text-gray-500">Oct 15, 2024</span>
                </div>
                <p className="text-sm text-gray-600">
                  Regular maintenance completed. All systems operating within normal parameters.
                  Replaced cooling fan #3 as preventive measure.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
            <div className="space-y-4">
              {[
                { action: 'Maintenance Scheduled', user: 'John Doe', time: '2 days ago', icon: Calendar },
                { action: 'Updated Checklist', user: 'Jane Smith', time: '1 day ago', icon: CheckCircle },
                { action: 'Added Notes', user: 'Mike Johnson', time: '5 hours ago', icon: Settings }
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <activity.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <p className="font-medium">{activity.action}</p>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-500">by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {activeView === 'schedule' && <MaintenanceSchedule />}
      {activeView === 'details' && <MaintenanceDetails />}
    </div>
  );
};


export default MaintenancePage;
