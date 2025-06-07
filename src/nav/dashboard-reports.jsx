import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  User,
  FileText,
  Search,
  MapPin
} from 'lucide-react'; // Corrected icon imports

const PetIncidentDashboard = () => {
  // State for incidents and metrics
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    avgResponse: '0 min',
    activeCases: 0
  });

  // Fetch data from your backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API calls
        const incidentsResponse = await fetch('/api/pet-incidents');
        const statsResponse = await fetch('/api/pet-incidents/stats');
        
        const incidentsData = await incidentsResponse.json();
        const statsData = await statsResponse.json();
        
        setIncidents(incidentsData.slice(0, 5)); // Show only recent 5
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dashboard metrics specific to pet incidents
  const metrics = [
    { 
      name: 'Total Incidents', 
      value: stats.total, 
      icon: AlertCircle,
      description: 'Pet incidents reported'
    },
    { 
      name: 'Resolved', 
      value: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%`, 
      icon: CheckCircle2,
      description: 'Cases successfully resolved'
    },
    { 
      name: 'Avg Response', 
      value: stats.avgResponse, 
      icon: Clock,
      description: 'Time to first response'
    },
    { 
      name: 'Active Cases', 
      value: stats.activeCases, 
      icon: PawPrint,
      description: 'Currently being handled'
    },
  ];

  // Quick actions for pet incidents
  const quickActions = [
    { 
      name: 'Report Incident', 
      icon: FileText, 
      action: () => window.location.href = '/pet-incidents/new'
    },
    { 
      name: 'Search Cases', 
      icon: Search, 
      action: () => window.location.href = '/pet-incidents/search'
    },
    { 
      name: 'Manage Volunteers', 
      icon: User, 
      action: () => window.location.href = '/volunteers'
    },
    { 
      name: 'View Map', 
      icon: MapPin, 
      action: () => window.location.href = '/incidents-map'
    },
  ];

  // Pet incident types
  const incidentTypes = [
    { type: 'Lost Pet', count: 42, color: 'bg-blue-500' },
    { type: 'Injury', count: 28, color: 'bg-red-500' },
    { type: 'Abuse Report', count: 22, color: 'bg-amber-500' },
    { type: 'Found Pet', count: 18, color: 'bg-green-500' },
    { type: 'Other', count: 14, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FA8630]">Pet Incident Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of all pet-related incidents</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 bg-[#FA8630] text-white rounded-lg hover:bg-[#E67300] transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-[#FA8630]/10 text-[#FA8630]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Pet Incidents</h2>
            <a 
              href="/pet-incidents" 
              className="text-sm text-[#FA8630] hover:text-[#E67300] hover:underline"
            >
              View All
            </a>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FA8630]"></div>
            </div>
          ) : incidents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        PET-{incident.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {incident.petType || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.status === "Resolved" ? "bg-green-100 text-green-800" :
                          incident.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {incident.location || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.urgency === "Critical" ? "bg-red-100 text-red-800" :
                          incident.urgency === "High" ? "bg-orange-100 text-orange-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {incident.urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent pet incidents found
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#FA8630] hover:text-[#FA8630] transition-colors"
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs text-center">{action.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Incident Types */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Incident Types</h2>
            <div className="space-y-3">
              {incidentTypes.map((type, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{type.type}</span>
                    <span>{type.count} cases</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${type.color} h-2 rounded-full`}
                      style={{ width: `${(type.count / 124) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { action: 'New lost pet report', time: '15 min ago', user: 'Volunteer' },
                { action: 'Injury case resolved', time: '1 hour ago', user: 'Admin' },
                { action: 'New volunteer assigned', time: '2 hours ago', user: 'System' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-[#FA8630]"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time} • {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetIncidentDashboard;