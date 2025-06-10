import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import NavHeader from '../component/NavHeader';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Search,
  Calendar,
  X,
  Eye,
  Check,
  CalendarClock,
  User
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// NavHeader Component

function Dashboard() {
  return (
    <>
      <NavHeader title="Dashboard" />
      <main className="p-4">
        {/* Your page content here */}
        <p>Welcome to the dashboard!</p>
      </main>
    </>
  );
}


// Custom marker icons with status-based colors
const statusIcons = {
  pending: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  verified: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  scheduled: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  resolved: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Sample incident data
const initialIncidents = [
  {
    id: 'IR-2025-1045',
    type: 'Dog Bite',
    location: [13.6192, 123.1814],
    address: '123 San Pedro St., Brgy. Sta. Lucia',
    reportedAt: 'June 7, 2025 - 8:45AM',
    reporter: 'Ana Dela Cruz',
    status: 'verified',
    description: 'Bitten while walking to school. Minor injury sustained.',
    photo: 'bite-incident.jpg',
    barangay: 'Sta. Lucia',
    urgency: 'medium'
  },
  {
    id: 'IR-2025-1046',
    type: 'Stray Dog',
    location: [13.6250, 123.1750],
    address: 'Near Naga City Cathedral',
    reportedAt: 'June 7, 2025 - 9:30AM',
    reporter: 'Juan Dela Cruz',
    status: 'pending',
    description: 'Aggressive stray dog roaming near the cathedral.',
    photo: 'stray-dog.jpg',
    barangay: 'Peñafrancia',
    urgency: 'high'
  },
  {
    id: 'IR-2025-1047',
    type: 'Lost Pet',
    location: [13.6150, 123.1850],
    address: 'SM City Naga parking lot',
    reportedAt: 'June 6, 2025 - 5:15PM',
    reporter: 'Maria Santos',
    status: 'scheduled',
    description: 'Golden retriever last seen near SM parking.',
    photo: 'lost-pet.jpg',
    barangay: 'Dinaga',
    urgency: 'low'
  },
  {
    id: 'IR-2025-1048',
    type: 'Dog Bite',
    location: [13.6220, 123.1700],
    address: '456 Rizal St., Brgy. Concepcion',
    reportedAt: 'June 6, 2025 - 3:00PM',
    reporter: 'Carlos Reyes',
    status: 'resolved',
    description: 'Child bitten by neighbor\'s dog. Medical attention provided.',
    photo: 'dog-bite-2.jpg',
    barangay: 'Concepcion',
    urgency: 'high'
  }
];

// Barangays in Naga City
const barangays = [
  'Abella', 'Bagumbayan Norte', 'Bagumbayan Sur', 'Balatas', 'Calauag',
  'Cararayan', 'Carolina', 'Concepcion', 'Dayangdang', 'Del Rosario',
  'Dinaga', 'Igualdad', 'Lerma', 'Liboton', 'Mabolo',
  'Pacol', 'Panicuason', 'Peñafrancia', 'Sabang', 'San Felipe',
  'San Francisco', 'San Isidro', 'Sta. Cruz', 'Sta. Lucia', 'Tabuco'
];

function ResetCenterView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const PetIncidentMap = () => {
  const [incidents] = useState(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [center, setCenter] = useState([13.6192, 123.1814]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: {
      pending: true,
      verified: true,
      scheduled: true,
      resolved: true
    },
    barangay: 'all',
    type: 'all',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchTerm === '' || 
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status[incident.status];
    const matchesBarangay = filters.barangay === 'all' || 
      incident.barangay.toLowerCase() === filters.barangay.toLowerCase();
    const matchesType = filters.type === 'all' || 
      incident.type.toLowerCase() === filters.type.toLowerCase();
    const reportedDate = new Date(incident.reportedAt);
    const matchesDateRange = (
      (!filters.dateRange.start || reportedDate >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end || reportedDate <= new Date(filters.dateRange.end))
    );
    
    return matchesSearch && matchesStatus && matchesBarangay && matchesType && matchesDateRange;
  });

  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [status]: !prev.status[status]
      }
    }));
  };

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
    setCenter(incident.location);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'verified': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, reporter, address..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FA8630]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="space-y-2">
                    {Object.entries(filters.status).map(([status, isActive]) => (
                      <div key={status} className="flex items-center">
                        <input
                          id={`filter-${status}`}
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleStatusFilter(status)}
                          className="h-4 w-4 border-gray-300 rounded text-[#FA8630] focus:ring-[#FA8630]"
                        />
                        <label htmlFor={`filter-${status}`} className="ml-2 text-sm text-gray-700 capitalize">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label htmlFor="barangay" className="block text-sm font-medium text-gray-700 mb-2">
                      Barangay
                    </label>
                    <select
                      id="barangay"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FA8630]"
                      value={filters.barangay}
                      onChange={(e) => setFilters({...filters, barangay: e.target.value})}
                    >
                      <option value="all">All Barangays</option>
                      {barangays.map(barangay => (
                        <option key={barangay} value={barangay}>{barangay}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Type
                    </label>
                    <select
                      id="type"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FA8630]"
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                      <option value="all">All Types</option>
                      <option value="Dog Bite">Dog Bite</option>
                      <option value="Stray Dog">Stray Dog</option>
                      <option value="Lost Pet">Lost Pet</option>
                      <option value="Animal Abuse">Animal Abuse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">
                        From
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="start-date"
                          className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FA8630]"
                          value={filters.dateRange.start}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: {...filters.dateRange, start: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">
                        To
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="end-date"
                          className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FA8630]"
                          value={filters.dateRange.end}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: {...filters.dateRange, end: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map and Incident List */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Incident List */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Incidents ({filteredIncidents.length})
              </h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredIncidents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No incidents match your filters
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredIncidents.map(incident => (
                    <li 
                      key={incident.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedIncident?.id === incident.id ? 'bg-[#FA8630]/10' : ''
                      }`}
                      onClick={() => handleIncidentSelect(incident)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{incident.type}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)} capitalize`}>
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{incident.id}</p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {incident.address}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {incident.reporter}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          {incident.reportedAt}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[600px] w-full relative">
              <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredIncidents.map(incident => (
                  <Marker 
                    key={incident.id} 
                    position={incident.location} 
                    icon={statusIcons[incident.status]}
                    eventHandlers={{
                      click: () => handleIncidentSelect(incident)
                    }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <h3 className="font-bold">{incident.type}</h3>
                        <p className="text-sm"><strong>ID:</strong> {incident.id}</p>
                        <p className="text-sm"><strong>Status:</strong> <span className="capitalize">{incident.status}</span></p>
                        <p className="text-sm"><strong>Location:</strong> {incident.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <ResetCenterView center={center} />
              </MapContainer>

              {selectedIncident && (
                <div className="absolute top-4 right-4 w-80 bg-white shadow-lg rounded-lg z-[1000]">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold">{selectedIncident.type}</h2>
                      <button 
                        onClick={() => setSelectedIncident(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedIncident.status)} capitalize`}>
                        {selectedIncident.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(selectedIncident.urgency)} capitalize`}>
                        {selectedIncident.urgency} urgency
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Incident ID</p>
                        <p className="text-sm text-gray-900">{selectedIncident.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedIncident.address}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reported</p>
                        <p className="text-sm text-gray-900">{selectedIncident.reportedAt}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reporter</p>
                        <p className="text-sm text-gray-900">{selectedIncident.reporter}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Description</p>
                        <p className="text-sm text-gray-900">{selectedIncident.description}</p>
                      </div>
                      
                      {selectedIncident.photo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Photo</p>
                          <div className="mt-1 bg-gray-100 rounded-md h-20 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Photo would appear here</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between space-x-2">
                      <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Report
                      </button>
                      {selectedIncident.status !== 'scheduled' && selectedIncident.status !== 'resolved' && (
                        <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FA8630] hover:bg-[#E67300]">
                          <CalendarClock className="h-4 w-4 mr-2" />
                          Schedule Patrol
                        </button>
                      )}
                      {selectedIncident.status === 'pending' && (
                        <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4 mr-2" />
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-sm z-[1000]">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-xs text-gray-700">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-xs text-gray-700">Verified</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs text-gray-700">Scheduled</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs text-gray-700">Resolved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetIncidentMap;