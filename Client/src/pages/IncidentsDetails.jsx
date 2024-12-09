import React from 'react';
import API_INSTANCE from '../services/auth'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function IncidentsDetails() {

  const [inc, setInc] = useState({});
  const { id } = useParams();
  console.log(id)
  const [status, setStatus] = useState(inc?.status || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  
  async function fetchIncidentData() {
      try {
        const res = await API_INSTANCE.get(`/incident/${id}`);
        console.log(res)
        setInc(res.data.data);
        setStatus(res.data.status);
      } catch (err) {
        setError('Failed to load incident details');
        console.error('Error:', err);
      }
    }

  useEffect(()=>{
    fetchIncidentData();
  },[id])
    
    console.log(inc)

  const updateInc = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const res = await API_INSTANCE.put(`/incident/${id}`, {
        status: status,
      });

      if (res.status === 200 || res.status === 201) {
        alert('Incident status updated successfully!');
      } else {
        setError('Failed to update incident status');
      }
    } catch (error) {
      setError('Error updating incident status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-yellow-500',
      'in-Progress': 'bg-blue-500',
      'closed': 'bg-green-500',

    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      { inc?.length>0 && inc.map((data)=>(
      <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Incident Details</h1>
              <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(data.status)}`}>
                {data.status}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Title</h3>
                  <p className="mt-1">{data.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Priority</h3>
                  <p className="mt-1">{data.priority}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                
                <div className="space-y-3 bg-gray-700/50 p-4 rounded-lg">
                  <p><span className="text-gray-400">Action:</span> {data.timeline.action}</p>
                  <p><span className="text-gray-400">Performed By:</span> {data.timeline.username}</p>
                  <p><span className="text-gray-400">Timestamp:</span> {new Date(data.timeline.timestamp).toLocaleString()}</p>
                  <p><span className="text-gray-400">Notes:</span> {data.timeline.notes}</p>
                </div>
                
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                {data ? data.comments.map((ele)=>(
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              
                      </div>
                      <p className="font-medium">{ele.username}</p>
                    </div>
                    <p className="mt-3">{ele.message}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(ele.timestamp).toLocaleString()}
                    </p>
                  </div>
                )) 
                : (
                  <p className="text-gray-400">No comments available.</p>
                )
                }
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold flex">Update Status</h2>
                <div className="flex items-center gap-4">
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>

                  </select>
                  <button
                    onClick={updateInc}
                    disabled={isLoading}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update'}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
            </div>
          </div>
      
        {/* // : (
        //   <div className="flex items-center justify-center h-64">
        //     <div className="text-gray-400">Loading incident details...</div>
        //   </div>
        // ) */}
       
      </div>
      ))}
    </div>
  )
}

export default IncidentsDetails;