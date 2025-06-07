import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  EyeIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const HistoryManagement = () => {
  // Sample incident data
  const [incidents, setIncidents] = useState([
    {
      id: "INC-2023-001",
      type: "Security Breach",
      status: "Resolved",
      location: "Building A, Floor 3",
      reportedBy: "John Doe",
      reportedAt: "2023-05-15T10:30:00",
      resolvedAt: "2023-05-15T11:45:00",
      description: "Unauthorized access to server room",
      actionTaken: "Security personnel dispatched, intruder apprehended",
    },
    {
      id: "INC-2023-002",
      type: "Medical Emergency",
      status: "Resolved",
      location: "Main Lobby",
      reportedBy: "Jane Smith",
      reportedAt: "2023-05-14T14:15:00",
      resolvedAt: "2023-05-14T14:45:00",
      description: "Employee fainted due to heat exhaustion",
      actionTaken: "First aid administered, ambulance called",
    },
    {
      id: "INC-2023-003",
      type: "Fire Alarm",
      status: "Pending Review",
      location: "Building B, Floor 1",
      reportedBy: "Mike Johnson",
      reportedAt: "2023-05-16T09:05:00",
      resolvedAt: null,
      description: "False alarm triggered in east wing",
      actionTaken: "Area evacuated, alarm reset",
    },
  ]);

  const [filteredIncidents, setFilteredIncidents] = useState(incidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Filter incidents based on filter criteria
  useEffect(() => {
    let results = incidents;

    if (filters.search) {
      results = results.filter(
        (incident) =>
          incident.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          incident.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          incident.reportedBy.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      results = results.filter((incident) => incident.status === filters.status);
    }

    if (filters.type !== "all") {
      results = results.filter((incident) => incident.type === filters.type);
    }

    if (filters.dateFrom) {
      results = results.filter(
        (incident) => new Date(incident.reportedAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      results = results.filter(
        (incident) => new Date(incident.reportedAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredIncidents(results);
  }, [filters, incidents]);

  // Sort incidents by date (newest first)
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    return new Date(b.reportedAt) - new Date(a.reportedAt);
  });

  // Get unique incident types for filter dropdown
  const incidentTypes = [...new Set(incidents.map((incident) => incident.type))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#FA8630] mb-6">Incident Report History</h1>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search incidents..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Status Filter */}
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Statuses</option>
            <option value="Resolved">Resolved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="In Progress">In Progress</option>
          </select>

          {/* Type Filter */}
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  status: "all",
                  type: "all",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedIncidents.length > 0 ? (
                sortedIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {incident.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : incident.status === "Pending Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.reportedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(incident.reportedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="text-[#FA8630] hover:text-[#E67300] mr-3"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <ArchiveBoxIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No incidents found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-[#FA8630] mb-4">
                  Incident Details: {selectedIncident.id}
                </h2>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedIncident.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedIncident.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.reportedBy}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported At</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedIncident.reportedAt).toLocaleString()}
                  </p>
                </div>
                {selectedIncident.resolvedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Resolved At</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedIncident.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Action Taken</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.actionTaken}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                {selectedIncident.status !== "Resolved" && (
                  <button className="px-4 py-2 bg-[#FA8630] text-white rounded-md hover:bg-[#E67300]">
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryManagement;