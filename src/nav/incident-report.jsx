import React, { useState, useEffect, useRef } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ClockIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ShieldCheckIcon,
  TruckIcon,
  CalendarIcon
} from '@heroicons/react/24/solid';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom incident marker icon
const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map click events
function MapClickHandler({ onClick }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

// Component to reset map center
function ResetCenterView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
}

const IncidentMonitoring = () => {
  const [incidents, setIncidents] = useState([
    {
      reportId: 'INC-2023-0001',
      dateTime: '2023-05-23T14:30:00',
      status: 'Verified',
      type: 'Dog Bite',
      severity: 'Moderate',
      reporter: {
        fullName: 'Juan Dela Cruz',
        contact: '09123456789',
        email: 'juan@example.com',
        address: '123 Main St, Naga City',
        userType: 'Resident'
      },
      location: {
        address: 'Naga City Hall',
        coordinates: [13.6192, 123.1814]
      },
      description: 'Bitten while jogging by a brown medium-sized Aspin',
      media: ['bite_photo.jpg'],
      verification: {
        verifiedBy: 'Admin User',
        verifiedDate: '2023-05-23T15:45:00',
        notes: 'Verified with photo evidence'
      },
      response: {
        assignedTeam: 'Patrol Team A',
        scheduledDate: '2023-05-24T09:00:00',
        status: 'Completed'
      }
    },
    {
      reportId: 'INC-2023-0002',
      dateTime: '2023-05-25T10:15:00',
      status: 'Pending',
      type: 'Stray Animal Sighting',
      severity: 'Low',
      reporter: {
        fullName: 'Maria Santos',
        contact: '09119874563',
        email: 'maria@example.com',
        address: '456 Oak St, Naga City',
        userType: 'Pet Owner'
      },
      location: {
        address: 'Naga City Public Market',
        coordinates: [13.6250, 123.1750]
      },
      description: 'Aggressive black large dog seen near market entrance',
      media: [],
      verification: {
        verifiedBy: '',
        verifiedDate: '',
        notes: ''
      },
      response: {
        assignedTeam: '',
        scheduledDate: '',
        status: ''
      }
    }
  ].sort((a, b) => b.reportId.localeCompare(a.reportId)));

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [incidentToVerify, setIncidentToVerify] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Dog Bite',
    dateTime: new Date().toISOString().slice(0, 16),
    status: 'Pending',
    severity: 'Low',
    reporter: {
      fullName: '',
      contact: '',
      email: '',
      address: '',
      userType: 'Resident'
    },
    location: {
      address: '',
      coordinates: [13.6192, 123.1814]
    },
    description: '',
    media: [],
    verification: {
      verifiedBy: '',
      verifiedDate: '',
      notes: ''
    },
    response: {
      assignedTeam: '',
      scheduledDate: '',
      status: ''
    }
  });
  const [mapCenter, setMapCenter] = useState([13.6192, 123.1814]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const mapRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'Dog Bite',
      dateTime: new Date().toISOString().slice(0, 16),
      status: 'Pending',
      severity: 'Low',
      reporter: {
        fullName: '',
        contact: '',
        email: '',
        address: '',
        userType: 'Resident'
      },
      location: {
        address: '',
        coordinates: [13.6192, 123.1814]
      },
      description: '',
      media: [],
      verification: {
        verifiedBy: '',
        verifiedDate: '',
        notes: ''
      },
      response: {
        assignedTeam: '',
        scheduledDate: '',
        status: ''
      }
    });
    setCurrentIncident(null);
    setMapCenter([13.6192, 123.1814]);
    setActiveTab('details');
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setIsLoadingAddress(true);
    
    try {
      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || 'Location not specified';
      
      setFormData(prev => ({
        ...prev,
        location: {
          address: address,
          coordinates: [lat, lng]
        }
      }));
      setMapCenter([lat, lng]);
    } catch (error) {
      console.error('Error getting address:', error);
      setFormData(prev => ({
        ...prev,
        location: {
          address: 'Location not specified',
          coordinates: [lat, lng]
        }
      }));
      setMapCenter([lat, lng]);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(4, '0')}`;
    const incidentToAdd = { 
      reportId: currentIncident?.reportId || newId,
      type: formData.type,
      dateTime: formData.dateTime,
      status: currentIncident ? currentIncident.status : 'Pending',
      severity: formData.severity,
      reporter: { ...formData.reporter },
      location: { ...formData.location },
      description: formData.description,
      media: formData.media,
      verification: currentIncident ? currentIncident.verification : formData.verification,
      response: currentIncident ? currentIncident.response : formData.response
    };
    
    const updatedIncidents = currentIncident
      ? incidents.map((i) => (i.reportId === currentIncident.reportId ? incidentToAdd : i))
      : [...incidents, incidentToAdd];
      
    setIncidents(updatedIncidents.sort((a, b) => b.reportId.localeCompare(a.reportId)));
    setIsModalOpen(false);
    resetForm();
  };

  const handleViewDetails = (incident) => {
    setCurrentIncident(incident);
    setFormData({ ...incident });
    setMapCenter(incident.location.coordinates);
    setIsModalOpen(true);
  };

  const promptVerify = (incident) => {
    setIncidentToVerify(incident);
    setShowVerifyConfirm(true);
  };

  const handleVerify = () => {
    const now = new Date().toISOString();
    setIncidents(incidents.map(incident => {
      if (incident.reportId === incidentToVerify.reportId) {
        return {
          ...incident,
          status: 'Verified',
          verification: {
            verifiedBy: 'Admin User', // Replace with actual user from auth context
            verifiedDate: now,
            notes: 'Report verified by administrator'
          }
        };
      }
      return incident;
    }).sort((a, b) => b.reportId.localeCompare(a.reportId)));
    setShowVerifyConfirm(false);
    setIncidentToVerify(null);
  };

  const handleAssignPatrol = (incidentId, team, date, status) => {
    setIncidents(incidents.map(incident => {
      if (incident.reportId === incidentId) {
        return {
          ...incident,
          response: {
            assignedTeam: team,
            scheduledDate: date,
            status: status
          }
        };
      }
      return incident;
    }));
  };

  const filteredIncidents = incidents.filter((i) =>
    Object.values(i).some((field) =>
      typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    i.reporter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckBadgeIcon className="h-4 w-4 mr-1" />
          Verified
        </span>
      );
    } else if (status === 'Scheduled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Scheduled
        </span>
      );
    } else if (status === 'Resolved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <ShieldCheckIcon className="h-4 w-4 mr-1" />
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <ClockIcon className="h-4 w-4 mr-1" />
        Pending
      </span>
    );
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#FD7E14]">Incident Reports</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FD7E14]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm();
            }}
            className="flex items-center px-4 py-2 bg-[#FD7E14] text-white rounded-md hover:bg-[#E67300] shadow"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> New Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Report ID',
                  'Date/Time',
                  'Type',
                  'Severity',
                  'Reporter',
                  'Location',
                  'Status',
                  'Actions'
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.reportId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{incident.reportId}</td>
                    <td className="px-6 py-4">{formatDateTime(incident.dateTime)}</td>
                    <td className="px-6 py-4">{incident.type}</td>
                    <td className="px-6 py-4 capitalize">{incident.severity.toLowerCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-500 mr-1" />
                        {incident.reporter.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-[#FD7E14] mr-1" />
                        <span className="truncate max-w-xs">{incident.location.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(incident.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(incident)} 
                          className="flex items-center px-3 py-1 bg-[#FD7E14] text-white rounded-md hover:bg-[#E67300]"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {incident.status !== 'Verified' && (
                          <button 
                            onClick={() => promptVerify(incident)} 
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            Verify
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentIncident ? `Incident Report: ${currentIncident.reportId}` : 'New Incident Report'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-[#FD7E14] text-[#FD7E14]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <DocumentTextIcon className="h-5 w-5 inline mr-1" />
                  Incident Details
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'verification' ? 'border-[#FD7E14] text-[#FD7E14]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <ShieldCheckIcon className="h-5 w-5 inline mr-1" />
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab('response')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'response' ? 'border-[#FD7E14] text-[#FD7E14]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <TruckIcon className="h-5 w-5 inline mr-1" />
                  Response
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Report ID</label>
                    <input
                      type="text"
                      value={currentIncident ? currentIncident.reportId : `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(4, '0')}`}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Incident Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      required
                    >
                      <option value="Dog Bite">Dog Bite</option>
                      <option value="Stray Animal Sighting">Stray Animal Sighting</option>
                      <option value="Animal Cruelty">Animal Cruelty</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Severity Level</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-3 mt-4">Reporter Details</h3>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Full Name</label>
                    <input
                      type="text"
                      name="reporter.fullName"
                      value={formData.reporter.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Contact Number</label>
                    <div className="relative">
                      <PhoneIcon className="absolute h-5 w-5 text-gray-400 left-3 top-2.5" />
                      <input
                        type="tel"
                        name="reporter.contact"
                        value={formData.reporter.contact}
                        onChange={handleInputChange}
                        className="pl-10 w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">Email</label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute h-5 w-5 text-gray-400 left-3 top-2.5" />
                      <input
                        type="email"
                        name="reporter.email"
                        value={formData.reporter.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-sm mb-1">User Type</label>
                    <select
                      name="reporter.userType"
                      value={formData.reporter.userType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                    >
                      <option value="Resident">Resident</option>
                      <option value="Pet Owner">Pet Owner</option>
                      <option value="Visitor">Visitor</option>
                      <option value="Official">Official</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block font-medium text-sm mb-1">Address</label>
                    <div className="relative">
                      <HomeIcon className="absolute h-5 w-5 text-gray-400 left-3 top-2.5" />
                      <input
                        type="text"
                        name="reporter.address"
                        value={formData.reporter.address}
                        onChange={handleInputChange}
                        className="pl-10 w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-3 mt-4">Incident Location</h3>
                    <div className="h-64 w-full rounded-md overflow-hidden border border-gray-300 relative">
                      <MapContainer 
                        center={mapCenter} 
                        zoom={15} 
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={(map) => { mapRef.current = map }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={formData.location.coordinates} icon={incidentIcon}>
                          <Popup>Incident Location</Popup>
                        </Marker>
                        <ResetCenterView center={mapCenter} />
                        <MapClickHandler onClick={handleMapClick} />
                      </MapContainer>
                      <div className="absolute top-2 right-2 bg-white p-1 rounded shadow z-[1000]">
                        <MapPinIcon className="h-5 w-5 text-[#FD7E14]" />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block font-medium text-sm mb-1">Coordinates</label>
                        <input
                          type="text"
                          value={`${formData.location.coordinates[0].toFixed(6)}, ${formData.location.coordinates[1].toFixed(6)}`}
                          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-sm mb-1">Address/Landmark</label>
                        <input
                          type="text"
                          name="location.address"
                          value={formData.location.address}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Click on the map to pin the incident location
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-3 mt-4">Incident Description</h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                      rows={4}
                      placeholder="Describe what happened, the animal involved, and any other relevant details..."
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block font-medium text-sm mb-1">Attachments</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">Upload photos or videos (if available)</p>
                      <button
                        type="button"
                        className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
                      >
                        Select Files
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'verification' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Verification Status</h3>
                    <div className="flex items-center">
                      {formData.status === 'Verified' ? (
                        <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="font-medium">{formData.status}</span>
                    </div>
                    
                    {formData.status === 'Verified' && (
                      <div className="mt-3 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Verified By</label>
                          <input
                            type="text"
                            name="verification.verifiedBy"
                            value={formData.verification.verifiedBy}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Verification Date</label>
                          <input
                            type="datetime-local"
                            name="verification.verifiedDate"
                            value={formData.verification.verifiedDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                          <textarea
                            name="verification.notes"
                            value={formData.verification.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                            placeholder="Add verification comments or reason for rejection..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {formData.status !== 'Verified' && (
                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                      <h3 className="text-lg font-medium mb-2">Pending Verification</h3>
                      <p className="text-sm text-yellow-700 mb-3">This report has not been verified yet. Please review the details before verification.</p>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date().toISOString();
                          setFormData({
                            ...formData,
                            status: 'Verified',
                            verification: {
                              verifiedBy: 'Admin User',
                              verifiedDate: now,
                              notes: 'Report verified by administrator'
                            }
                          });
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <CheckBadgeIcon className="h-5 w-5 inline mr-1" />
                        Verify Report
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'response' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-medium mb-3">Response Assignment</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Patrol Team</label>
                        <select
                          name="response.assignedTeam"
                          value={formData.response.assignedTeam}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                        >
                          <option value="">Select team...</option>
                          <option value="Patrol Team A">Patrol Team A</option>
                          <option value="Patrol Team B">Patrol Team B</option>
                          <option value="Patrol Team C">Patrol Team C</option>
                          <option value="Special Response">Special Response</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Schedule Patrol</label>
                        <input
                          type="datetime-local"
                          name="response.scheduledDate"
                          value={formData.response.scheduledDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Response Status</label>
                      <select
                        name="response.status"
                        value={formData.response.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FD7E14] focus:border-[#FD7E14] sm:text-sm"
                      >
                        <option value="">Select status...</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <h3 className="text-lg font-medium mb-2">Response Tracking</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Team Assigned:</span>
                        <span>{formData.response.assignedTeam || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Scheduled Date:</span>
                        <span>{formData.response.scheduledDate ? formatDateTime(formData.response.scheduledDate) : 'Not scheduled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Current Status:</span>
                        <span>{formData.response.status || 'No status'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FD7E14] text-white rounded-md hover:bg-[#E67300]"
                >
                  {currentIncident ? 'Update Report' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Confirmation Modal */}
      {showVerifyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Verify Incident Report</h2>
              <button onClick={() => setShowVerifyConfirm(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to verify report <strong>{incidentToVerify?.reportId}</strong>?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVerifyConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <CheckBadgeIcon className="h-5 w-5 inline mr-1" />
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentMonitoring;