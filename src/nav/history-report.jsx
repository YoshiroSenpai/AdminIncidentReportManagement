import { useState, useEffect } from "react";
import NavHeader from "../component/NavHeader";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  EyeIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const IncidentHistory = () => {
  // Sample incident data matching your suggested format
  const [incidents, setIncidents] = useState([
    {
      incidentId: "IR-1045",
      dateReported: "2025-06-03",
      reporter: "Ana Cruz",
      type: "Dog Bite",
      location: "Brgy. Sta. Lucia",
      status: "Resolved",
      resolvedDate: "2025-06-05",
      description: "Bitten by stray dog on way to school.",
      patrol: {
        assignedTo: "Team A",
        scheduledDate: "2025-06-04T10:00:00",
        outcome: "Dog captured and quarantined"
      },
      activityLog: [
        { date: "2025-06-03", action: "Report submitted" },
        { date: "2025-06-03", action: "Verified by City Vet" },
        { date: "2025-06-04", action: "Patrol assigned" },
        { date: "2025-06-05", action: "Marked as resolved" }
      ]
    },
    {
      incidentId: "IR-1041",
      dateReported: "2025-06-01",
      reporter: "Mark Dizon",
      type: "Stray",
      location: "Brgy. San Juan",
      status: "Cancelled",
      resolvedDate: null,
      description: "Report of stray dogs in the area, but already handled by another team.",
      patrol: null,
      activityLog: [
        { date: "2025-06-01", action: "Report submitted" },
        { date: "2025-06-01", action: "Verified as duplicate" },
        { date: "2025-06-01", action: "Marked as cancelled" }
      ]
    },
    {
      incidentId: "IR-1039",
      dateReported: "2025-05-30",
      reporter: "Lorna Dela Cruz",
      type: "Stray",
      location: "Brgy. San Isidro",
      status: "Expired",
      resolvedDate: null,
      description: "Stray dogs reported but no follow-up after 3 days.",
      patrol: {
        assignedTo: "Team B",
        scheduledDate: "2025-06-02T14:00:00",
        outcome: "Not conducted - expired"
      },
      activityLog: [
        { date: "2025-05-30", action: "Report submitted" },
        { date: "2025-05-31", action: "Verified by City Vet" },
        { date: "2025-06-03", action: "Marked as expired" }
      ]
    }
  ]);

  const [filteredIncidents, setFilteredIncidents] = useState(incidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "dateReported", direction: "desc" });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    location: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Get unique values for filters
  const statusOptions = ["Resolved", "Cancelled", "Expired", "Duplicate"];
  const typeOptions = [...new Set(incidents.map(incident => incident.type))];
  const locationOptions = [...new Set(incidents.map(incident => incident.location))];

  // Filter incidents based on filter criteria
  useEffect(() => {
    let results = incidents;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (incident) =>
          incident.incidentId.toLowerCase().includes(searchTerm) ||
          incident.reporter.toLowerCase().includes(searchTerm) ||
          incident.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status !== "all") {
      results = results.filter((incident) => incident.status === filters.status);
    }

    if (filters.type !== "all") {
      results = results.filter((incident) => incident.type === filters.type);
    }

    if (filters.location !== "all") {
      results = results.filter((incident) => incident.location === filters.location);
    }

    if (filters.dateFrom) {
      results = results.filter(
        (incident) => new Date(incident.dateReported) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      results = results.filter(
        (incident) => new Date(incident.dateReported) <= new Date(filters.dateTo)
      );
    }

    setFilteredIncidents(results);
  }, [filters, incidents]);

  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Incident ID", "Date Reported", "Reporter", "Type", "Location", "Status", "Resolved Date"];
    const csvContent = [
      headers.join(","),
      ...sortedIncidents.map(incident => 
        [
          incident.incidentId,
          formatDate(incident.dateReported),
          incident.reporter,
          incident.type,
          incident.location,
          incident.status,
          formatDate(incident.resolvedDate)
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `incidents_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status icon and color
  const getStatusIndicator = (status) => {
    switch (status) {
      case "Resolved":
        return { icon: <CheckCircleIcon className="h-4 w-4" />, color: "text-green-500" };
      case "Cancelled":
        return { icon: <XCircleIcon className="h-4 w-4" />, color: "text-red-500" };
      case "Expired":
        return { icon: <ClockIcon className="h-4 w-4" />, color: "text-yellow-500" };
      case "Duplicate":
        return { icon: <DocumentDuplicateIcon className="h-4 w-4" />, color: "text-blue-500" };
      default:
        return { icon: null, color: "text-gray-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the NavHeader component */}
      <NavHeader title="Incident History" />
      
      {/* Main content container */}
      <div className="p-4 md:p-6">
        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, reporter, or location..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA8630]"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export CSV
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA8630]">
                <PrinterIcon className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="all">All Locations</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="From"
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="To"
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-[#FA8630] focus:ring-[#FA8630]"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  status: "all",
                  type: "all",
                  location: "all",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Incident Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("incidentId")}
                  >
                    <div className="flex items-center">
                      Incident ID
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("dateReported")}
                  >
                    <div className="flex items-center">
                      Date Reported
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("reporter")}
                  >
                    <div className="flex items-center">
                      Reporter
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("type")}
                  >
                    <div className="flex items-center">
                      Type
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("location")}
                  >
                    <div className="flex items-center">
                      Location
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("resolvedDate")}
                  >
                    <div className="flex items-center">
                      Resolved Date
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedIncidents.length > 0 ? (
                  sortedIncidents.map((incident) => (
                    <tr key={incident.incidentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {incident.incidentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(incident.dateReported)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.reporter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {getStatusIndicator(incident.status).icon}
                          <span className="ml-1">{incident.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(incident.resolvedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedIncident(incident)}
                          className="text-[#FA8630] hover:text-[#E67300]"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Incident Details: {selectedIncident.incidentId}
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
                    <h3 className="text-sm font-medium text-gray-500">Reporter</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedIncident.reporter}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedIncident.dateReported)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Resolved Date</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedIncident.resolvedDate) || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Barangay</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedIncident.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      <div className="flex items-center">
                        {getStatusIndicator(selectedIncident.status).icon}
                        <span className="ml-1">{selectedIncident.status}</span>
                      </div>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900 italic">
                    {selectedIncident.description}
                  </p>
                </div>

                {selectedIncident.patrol && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500">Patrol</h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-900">
                      <div><span className="font-medium">Assigned to:</span> {selectedIncident.patrol.assignedTo}</div>
                      <div><span className="font-medium">Scheduled:</span> {formatDate(selectedIncident.patrol.scheduledDate)} at {new Date(selectedIncident.patrol.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div><span className="font-medium">Outcome:</span> {selectedIncident.patrol.outcome}</div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500">Activity Log</h3>
                  <div className="mt-2 space-y-2">
                    {selectedIncident.activityLog.map((log, index) => (
                      <div key={index} className="flex text-sm">
                        <span className="text-gray-500 w-24">{formatDate(log.date)}:</span>
                        <span className="text-gray-900">{log.action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentHistory;