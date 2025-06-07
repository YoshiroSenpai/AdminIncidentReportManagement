import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const incidentIcons = {
  bite: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  stray: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  lost: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Sample data with coordinates around Naga City, Bicol
const initialIncidents = [
  {
    id: '00001',
    type: 'bite',
    title: 'Dog Bite Incident',
    date: '04 Sep 2023',
    location: [13.6192, 123.1814], // Naga City coordinates
    color: 'Black',
    species: 'Pitbull',
    size: 'Large',
    contact: 'john.doe@example.com',
    description: 'Aggressive dog bite incident near Plaza Rizal',
    status: 'pending'
  },
  {
    id: '00002',
    type: 'stray',
    title: 'Stray Cat Found',
    date: '28 May 2023',
    location: [13.6250, 123.1750], // Near Naga City Cathedral
    color: 'Gray',
    species: 'Domestic Shorthair',
    size: 'Small',
    contact: '555-123-4567',
    description: 'Stray cat appears injured near the cathedral',
    status: 'in_progress'
  },
  {
    id: '00003',
    type: 'lost',
    title: 'Lost Golden Retriever',
    date: '23 Nov 2023',
    location: [13.6150, 123.1850], // Near SM City Naga
    color: 'Golden',
    species: 'Golden Retriever',
    size: 'Large',
    contact: 'jane.smith@example.com',
    description: 'Lost dog last seen near SM City Naga',
    status: 'resolved'
  },
  {
    id: '00004',
    type: 'bite',
    title: 'Cat Scratch Incident',
    date: '15 Jan 2023',
    location: [13.6220, 123.1700], // Near Naga City Hall
    color: 'White',
    species: 'Siamese',
    size: 'Medium',
    contact: '555-987-6543',
    description: 'Stray cat scratched a child near City Hall',
    status: 'resolved'
  },
  {
    id: '00005',
    type: 'stray',
    title: 'Abandoned Puppies',
    date: '02 Mar 2023',
    location: [13.6100, 123.1900], // Near Ateneo de Naga University
    color: 'Brown',
    species: 'Mixed Breed',
    size: 'Small',
    contact: 'mike.wilson@example.com',
    description: 'Three puppies found in a box near Ateneo',
    status: 'pending'
  }
];

function ResetCenterView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const MapAdminDashboard = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [center, setCenter] = useState([13.6192, 123.1814]); // Naga City coordinates
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bite',
    title: '',
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    location: [13.6192, 123.1814], // Naga City coordinates
    color: '',
    species: '',
    size: 'medium',
    contact: '',
    description: '',
    status: 'pending'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapClick = (e) => {
    setFormData(prev => ({
      ...prev,
      location: [e.latlng.lat, e.latlng.lng]
    }));
    setCenter([e.latlng.lat, e.latlng.lng]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `0000${incidents.length + 1}`.slice(-5);
    
    const newIncident = {
      id: newId,
      ...formData
    };
    
    setIncidents(prev => [...prev, newIncident]);
    setIsFormOpen(false);
    setFormData({
      type: 'bite',
      title: '',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      location: [13.6192, 123.1814], // Reset to Naga City coordinates
      color: '',
      species: '',
      size: 'medium',
      contact: '',
      description: '',
      status: 'pending'
    });
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchTerm === '' || 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.species.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || incident.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Naga City Pet Incident Map</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-4 py-2 bg-[#FD7E14] text-white rounded-md hover:bg-[#E67300]"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Incident
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 bg-white shadow rounded-lg p-4 h-fit">
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search incidents..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs ${
                    filter === 'all' ? 'bg-[#FD7E14] text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('bite')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center ${
                    filter === 'bite' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  Bite Incidents
                </button>
                <button
                  onClick={() => setFilter('stray')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center ${
                    filter === 'stray' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  Stray Animals
                </button>
                <button
                  onClick={() => setFilter('lost')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center ${
                    filter === 'lost' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  Lost Pets
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recent Reports</label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredIncidents.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No incidents found</p>
                ) : (
                  filteredIncidents.map(incident => (
                    <div 
                      key={incident.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedIncident?.id === incident.id ? 'bg-[#FD7E14]/10 border-[#FD7E14]' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedIncident(incident);
                        setCenter(incident.location);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{incident.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{incident.species} • {incident.size}</p>
                      <p className="text-xs text-gray-500 mt-1">{incident.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:w-3/4 bg-white shadow rounded-lg overflow-hidden">
            <div className="h-[600px] w-full relative">
              <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                onClick={handleMapClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredIncidents.map(incident => (
                  <Marker 
                    key={incident.id} 
                    position={incident.location} 
                    icon={incidentIcons[incident.type]}
                    eventHandlers={{
                      click: () => {
                        setSelectedIncident(incident);
                      }
                    }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <h3 className="font-bold">{incident.title}</h3>
                        <p><strong>Type:</strong> {incident.type}</p>
                        <p><strong>Species:</strong> {incident.species}</p>
                        <p><strong>Date:</strong> {incident.date}</p>
                        <p className="text-sm">{incident.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <ResetCenterView center={center} />
              </MapContainer>

              {/* Incident Details Panel */}
              {selectedIncident && (
                <div className="absolute bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 z-[1000]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{selectedIncident.title}</h2>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedIncident.status)} mr-2`}>
                          {selectedIncident.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedIncident.date} • {selectedIncident.type}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedIncident(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Incident Details</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Species:</strong> {selectedIncident.species}</p>
                        <p><strong>Color:</strong> {selectedIncident.color}</p>
                        <p><strong>Size:</strong> {selectedIncident.size}</p>
                        <p><strong>Contact:</strong> {selectedIncident.contact}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Description</h3>
                      <p className="mt-2 text-sm text-gray-600">{selectedIncident.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Incident Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Report New Incident</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Incident Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="bite">Bite Incident (Red Pin)</option>
                      <option value="stray">Stray Animal (Blue Pin)</option>
                      <option value="lost">Lost Pet (Orange Pin)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                      Species/Breed
                    </label>
                    <input
                      type="text"
                      id="species"
                      name="species"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.species}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                      Size
                    </label>
                    <select
                      id="size"
                      name="size"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Click on the map to set the location for this incident
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current location: {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD7E14]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FD7E14] hover:bg-[#E67300] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD7E14]"
                  >
                    Submit Incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapAdminDashboard;