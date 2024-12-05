import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import IncidentForm from './IncidentForm';
import { Link } from 'react-router-dom';
import { CheckCheck, CheckCircle, Loader, ShieldCheck, Search, Filter } from 'lucide-react';

function Incidents() {
  const data = useSelector((state) => state.metrics.incidents);
  const[isForm, setIsForm]= useState(false)
  const [searchInc, setSearchInc] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');


  const handleSubmit =(e)=>{
    e.preventDefalut()
  }

  // Initialize counts for each status
  const statusCounts = {
    open: 0,
    closed: 0,
    resolved: 0,
    inProgress: 0,
  };

  // Calculate counts based on the `status` of each incident
  if (data && data.length > 0) {
    data.forEach((inc) => {
      if (statusCounts[inc.status] !== undefined) {
        statusCounts[inc.status] += 1;
      }
    });
  }

  // Function to get the status icon with tooltip
  const getStatusIcon = (status) => {
    const statusLabels = {
      open: 'Open',
      closed: 'Closed',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    };
    const statusIcons = {
      open: <ShieldCheck className="text-green-500 w-5 h-5" />,
      closed: <CheckCircle className="text-red-500 w-5 h-5" />,
      inProgress: <Loader className="text-yellow-500 w-5 h-5 animate-spin" />,
      resolved: <CheckCheck className="text-gray-700 w-5 h-5" />,
    };
    return (
      <div className="relative group">
        {statusIcons[status]}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-6 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {statusLabels[status]}
        </span>
      </div>
    );
  };
  const priorityBadges = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
    critical: 'bg-red-300 text-white'
  };

  const filteredIncident = data?.filter(inc => {
    const matchSearch = inc.title.toLowerCase().includes(searchInc.toLowerCase()) ||
      inc.incidentNumber.toLowerCase().includes(searchInc.toLowerCase());
    const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || inc.priority === priorityFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
          <button onClick={()=>setIsForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Incident
          </button>
          {isForm && (
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
    
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsForm(false)}
          ></div>
          
        
          <div className="relative min-h-screen w-full flex items-center justify-center p-4">
    
            <div className="relative bg-white rounded-lg shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
      
              <div className="sticky top-0 bg-white px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Create New Incident</h3>
                  <button
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setIsForm(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="px-20 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                <IncidentForm submit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Incident Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm text-gray-500">Open Tickets</h2>
                <p className="text-2xl font-semibold mt-1">{statusCounts.open}</p>
              </div>
              <div className="p-3 rounded-full text-green-500 bg-green-50">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm text-gray-500">Closed Tickets</h2>
                <p className="text-2xl font-semibold mt-1">{statusCounts.closed}</p>
              </div>
              <div className="p-3 rounded-full text-red-500 bg-red-50">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm text-gray-500">In Progress</h2>
                <p className="text-2xl font-semibold mt-1">{statusCounts.inProgress}</p>
              </div>
              <div className="p-3 rounded-full text-yellow-500 bg-yellow-50">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm text-gray-500">Resolved Tickets</h2>
                <p className="text-2xl font-semibold mt-1">{statusCounts.resolved}</p>
              </div>
              <div className="p-3 rounded-full text-gray-700 bg-gray-50">
                <CheckCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search incidents..."
                className="w-full pl-10  outline-none pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchInc}
                onChange={(e) => setSearchInc(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="border rounded-md px-3 py-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">All Incidents</h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50">
                <div className="flex justify-between p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Incident</div>
                  <div>Status</div>
                  <div>Priority</div>
                  <div>Assigned To</div>
                  <div>Created</div>
                </div>
              </div>

              {/* Incidents List */}
              <div className="bg-white shadow rounded-lg">
                <div className="border-t border-gray-200">
                  {filteredIncident && filteredIncident.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredIncident.map((inc) => (
                        <div
                          key={inc._id}
                          className="p-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="flex justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{inc.title}</h3>
                              <div className="mt-2 flex justify-between items-center gap-4 text-sm text-gray-500">
                                <Link to={`/incident/${inc._id}`}>#{inc.incidentNumber}</Link>
                                <div className="ml-4">{getStatusIcon(inc.status)}</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadges[inc.priority]}`}>
                                  {inc.priority}
                                </span>
                                <div className="text-sm text-gray-500">
                                  {inc.assignedTo || 'Awaiting'}
                                </div>
                                <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No incidents available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Incidents;