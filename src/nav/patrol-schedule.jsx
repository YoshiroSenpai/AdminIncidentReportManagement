import React, { useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const patrolData = [
  {
    patrolId: 'P-001',
    incidentId: 'IR-2025-1234',
    assignedTeam: 'Team A - Alpha',
    dateTime: '2025-06-08T09:00',
    area: 'Brgy. 123 - Central Park',
    location: 'Central Park, Block A',
    status: 'Scheduled',
    notes: 'Be alert for a stray near fountain',
  },
  {
    patrolId: 'P-002',
    incidentId: 'IR-2025-1235',
    assignedTeam: 'Team B - Bravo',
    dateTime: '2025-06-08T14:00',
    area: 'Brgy. 456 - Riverside',
    location: 'Riverside Blvd.',
    status: 'Completed',
    notes: 'Resident reported stray with injury',
  },
  {
    patrolId: 'P-003',
    incidentId: 'IR-2025-1236',
    assignedTeam: 'Team C - Charlie',
    dateTime: '2025-06-09T09:00',
    area: 'Brgy. 789 - East Market',
    location: 'East Market Street',
    status: 'Pending',
    notes: 'Stray pack seen near garbage area',
  },
];

const teamOptions = [
  'Team A - Alpha',
  'Team B - Bravo',
  'Team C - Charlie',
  'Team D - Delta',
  'Dog Catcher Unit 1',
  'Dog Catcher Unit 2'
];

const statusOptions = [
  'Pending',
  'Scheduled',
  'En Route',
  'Completed',
  'Cancelled'
];

const PatrolSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPatrol, setSelectedPatrol] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patrolId: '',
    incidentId: '',
    assignedTeam: '',
    dateTime: '',
    area: '',
    location: '',
    status: 'Pending',
    notes: ''
  });

  const filteredPatrols = patrolData.filter((patrol) => {
    const matchesDate = selectedDate ? patrol.dateTime.includes(selectedDate) : true;
    const matchesStatus = selectedStatus ? patrol.status === selectedStatus : true;
    const matchesSearch = 
      patrol.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patrol.patrolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patrol.incidentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesStatus && matchesSearch;
  });

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenForm = (patrol = null) => {
    if (patrol) {
      setFormData(patrol);
      setIsEditing(true);
    } else {
      setFormData({
        patrolId: `P-${(patrolData.length + 1).toString().padStart(3, '0')}`,
        incidentId: '',
        assignedTeam: '',
        dateTime: '',
        area: '',
        location: '',
        status: 'Pending',
        notes: ''
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save to your backend here
    console.log('Form submitted:', formData);
    setIsFormOpen(false);
  };

  const updateStatus = (patrolId, newStatus) => {
    // In a real app, you would update the backend here
    console.log(`Updating patrol ${patrolId} to status ${newStatus}`);
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Patrol ID', 'Incident ID', 'Assigned Team', 'Date & Time', 'Area', 'Location', 'Status', 'Notes'],
      ...filteredPatrols.map((item) => [
        item.patrolId,
        item.incidentId,
        item.assignedTeam,
        formatDateTime(item.dateTime),
        item.area,
        item.location,
        item.status,
        item.notes,
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patrol_schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patrol Schedule Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Create Patrol
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Filter by Date:</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Filter by Status:</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Search:</label>
          <input
            type="text"
            placeholder="Search patrols..."
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrol ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatrols.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No patrols found matching your criteria
                </td>
              </tr>
            ) : (
              filteredPatrols.map((patrol) => (
                <tr key={patrol.patrolId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patrol.patrolId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrol.incidentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrol.assignedTeam}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(patrol.dateTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrol.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patrol.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      patrol.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      patrol.status === 'En Route' ? 'bg-yellow-100 text-yellow-800' :
                      patrol.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {patrol.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPatrol(patrol);
                          setIsFormOpen(false);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleOpenForm(patrol)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      {patrol.status !== 'Completed' && (
                        <button
                          onClick={() => updateStatus(patrol.patrolId, 'Completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Completed"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patrol Details Modal */}
      {selectedPatrol && !isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setSelectedPatrol(null)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Patrol Details - {selectedPatrol.patrolId}</h3>
              <button
                onClick={() => {
                  setSelectedPatrol(null);
                  handleOpenForm(selectedPatrol);
                }}
                className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium text-gray-700">Incident ID:</p>
                <p className="text-gray-900">{selectedPatrol.incidentId || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Assigned Team:</p>
                <p className="text-gray-900">{selectedPatrol.assignedTeam}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Date & Time:</p>
                <p className="text-gray-900">{formatDateTime(selectedPatrol.dateTime)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Status:</p>
                <p className="text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedPatrol.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    selectedPatrol.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    selectedPatrol.status === 'En Route' ? 'bg-yellow-100 text-yellow-800' :
                    selectedPatrol.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPatrol.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-700">Area:</p>
              <p className="text-gray-900">{selectedPatrol.area}</p>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-700">Location:</p>
              <p className="text-gray-900">{selectedPatrol.location}</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">Notes:</p>
              <p className="text-gray-900 whitespace-pre-line">{selectedPatrol.notes || 'No notes available'}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // In a real app, this would link to a map view
                  console.log('View on map:', selectedPatrol.location);
                }}
                className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <MapIcon className="h-4 w-4" />
                View on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patrol Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setIsFormOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {isEditing ? `Edit Patrol - ${formData.patrolId}` : 'Create New Patrol'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Incident ID/Reference</label>
                  <input
                    type="text"
                    name="incidentId"
                    value={formData.incidentId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter incident reference"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Assigned Team</label>
                  <select
                    name="assignedTeam"
                    value={formData.assignedTeam}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select a team</option>
                    {teamOptions.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter area/barangay"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter specific location"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium text-gray-700">Notes/Instructions</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder="Enter any additional notes or instructions"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Update Patrol' : 'Create Patrol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrolSchedule;