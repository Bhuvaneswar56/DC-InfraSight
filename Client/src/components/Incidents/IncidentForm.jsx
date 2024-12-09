import React from 'react'
import API_INSTANCE from '../../services/auth'

function IncidentForm() {

const createInc = async(e)=>{
e.preventDefault()
try{

  const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries()); // Convert to plain object

      data.timeline = {
        action: formData.get('timelineAction'),
        performedBy: formData.get('performedBy'),
        timestamp: formData.get('timestamp'),
      };
  
      data.comments = {
        user: formData.get('commentUser'),
        message: formData.get('commentMessage'),
        timestamp: formData.get('commentTimestamp'),
      };

      const response = await API_INSTANCE.post('/incident', data);

      if (response.status === 200 || response.status === 201) {
        alert('Incident created successfully!');
        e.target.reset(); // Reset the form
      } else {
        alert('Failed to create the incident');
      }
}
catch(error){
  console.log(error)
}

}


  return (
    <div>
      <div class="bg-white p-2 lg:p-8 rounded-lg shadow-md max-w-2xl w-full">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Incident Form</h1>
    <form onSubmit={createInc} id="incidentForm" class="space-y-4"> 
      <div class="form-group">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter incident title"
        />
      </div>

      
      <div class="form-group">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter description"
        ></textarea>
      </div>

     
      <div class="form-group">
        <label for="relatedAlert" class="block text-sm font-medium text-gray-700">Related Alert</label>
        <input
          type="text"
          id="relatedAlert"
          name="relatedAlert"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter related alert ID"
        />
      </div>

      
      <div class="form-group">
        <label for="equipment" class="block text-sm font-medium text-gray-700">Equipment</label>
        <input
          type="text"
          id="equipment"
          name="equipment"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter equipment ID"
        />
      </div>

     
      <div class="form-group">
        <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      
      <div class="form-group">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="open">Open</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Timeline</label>
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
          <div>
            <label for="timelineAction" class="text-sm font-medium text-gray-600">Action</label>
            <input
              type="text"
              id="timelineAction"
              name="timelineAction"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter timeline action"
            />
          </div>
          <div class="mt-4">
            <label for="performedBy" class="text-sm font-medium text-gray-600">Performed By</label>
            <input
              type="text"
              id="performedBy"
              name="performedBy"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user ID"
            />
          </div>
          <div class="mt-4">
            <label for="timestamp" class="text-sm font-medium text-gray-600">Timestamp</label>
            <input
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

    
      <div>
        <label class="block text-sm font-medium text-gray-700">Comments</label>
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
          <div>
            <label for="commentUser" class="text-sm font-medium text-gray-600">User</label>
            <input
              type="text"
              id="commentUser"
              name="commentUser"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user ID"
            />
          </div>
          <div class="mt-4">
            <label for="commentMessage" class="text-sm font-medium text-gray-600">Message</label>
            <textarea
              id="commentMessage"
              name="commentMessage"
              rows="2"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter comment message"
            ></textarea>
          </div>
          <div class="mt-4">
            <label for="commentTimestamp" class="text-sm font-medium text-gray-600">Timestamp</label>
            <input
              type="datetime-local"
              id="commentTimestamp"
              name="commentTimestamp"
              class="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div class="pt-4">
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit Incident
        </button>
      </div>
    </form>
  </div>
    </div>
  )
}

export default IncidentForm
