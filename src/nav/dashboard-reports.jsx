import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  EyeIcon,
  ArchiveBoxIcon,
  MapPinIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FlagIcon,
  ClockIcon as ClockSolidIcon,
} from "@heroicons/react/24/outline";

const Landing = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const handleSignout = () => {
    navigate("/");
  };

  // Sample data
  const stats = [
    { icon: DocumentTextIcon, title: "New Incident Reports Today", value: 5, action: "View", color: "bg-blue-100 text-blue-800" },
    { icon: ExclamationTriangleIcon, title: "Pending Verifications", value: 3, action: "Review Now", color: "bg-red-100 text-red-800" },
    { icon: ClockSolidIcon, title: "Patrols Scheduled Today", value: 2, action: "View Schedule", color: "bg-purple-100 text-purple-800" },
    { icon: CheckCircleIcon, title: "Resolved Incidents This Week", value: 12, action: "View History", color: "bg-green-100 text-green-800" },
  ];

  const patrolSchedule = [
    { time: "9:00 AM", area: "Brgy. Mabini", assignedTo: "Team A", status: "Pending" },
    { time: "2:00 PM", area: "Brgy. Sta. Cruz", assignedTo: "Team B", status: "Completed ✅" },
  ];

  const notifications = [
    "3 reports awaiting verification",
    "Team A patrol marked late yesterday",
    "2 reports flagged for review (missing location info)"
  ];

  const quickActions = [
    { icon: MagnifyingGlassIcon, label: "Verify Incident Reports", path: "/incidentmonitoring" },
    { icon: MapPinIcon, label: "View Full Incident Map", path: "/incidentmonitoring" },
    { icon: PlusIcon, label: "Create Patrol Schedule", path: "/patrolschedule" },
    { icon: FlagIcon, label: "Incident History", path: "/historyreport" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Hamburger menu and brand */}
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
                {isDrawerOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              <div className="ml-4 flex items-center">
                <span className="text-xl font-semibold text-[#FA8630]">
                  City Vet Care
                </span>
              </div>
            </div>

            {/* Right side - Profile dropdown */}
            <div className="flex items-center relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <span className="text-sm font-medium text-gray-700">
                  John Doe
                </span>
                <UserCircleIcon className="h-8 w-8 text-gray-500" />
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-40 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Profile
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                        Settings
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div
                        className="flex items-center"
                        onClick={handleSignout}
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                        Sign out
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation Drawer */}
        <div
          className={`${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } fixed h-full w-64 bg-white shadow-md transition-transform duration-300 ease-in-out z-10`}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  onClick={() => navigate("/dashboardreport")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#FA8630]/10 hover:text-[#FA8630] rounded-md cursor-pointer"
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/incidentmonitoring")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#FA8630]/10 hover:text-[#FA8630] rounded-md cursor-pointer"
                >
                  <EyeIcon className="h-5 w-5 mr-3" />
                  Incident Monitoring
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/incidentreport")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#FA8630]/10 hover:text-[#FA8630] rounded-md cursor-pointer"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3" />
                  Incident report
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/patrolschedule")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#FA8630]/10 hover:text-[#FA8630] rounded-md cursor-pointer"
                >
                  <ClockIcon className="h-5 w-5 mr-3" />
                  Patrol Schedule
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/historyreport")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#FA8630]/10 hover:text-[#FA8630] rounded-md cursor-pointer"
                >
                  <ArchiveBoxIcon className="h-5 w-5 mr-3" />
                  History
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            isDrawerOpen ? "ml-64" : "ml-0"
          } transition-all duration-300 p-6`}
        >
          {/* Welcome Banner */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              👋 Welcome, Admin!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's a quick overview of today's incident activity. You have 5 new reports today, 3 require your attention.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className={`bg-white rounded-lg shadow p-6 ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium px-3 py-1 bg-white rounded-md shadow-sm hover:bg-gray-50">
                    {stat.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Map and Patrol Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Mini Map Placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Incident Map Overview
                </h2>
                <button 
                  onClick={() => navigate("/incidentmonitoring")}
                  className="text-sm font-medium px-3 py-1 bg-[#FA8630] text-white rounded-md shadow-sm hover:bg-[#E07528]"
                >
                  View Full Map
                </button>
              </div>
              <div className="bg-gray-200 rounded-md h-64 flex items-center justify-center">
                <p className="text-gray-500">Interactive map with incident pins will appear here</p>
              </div>
            </div>

            {/* Today's Patrol Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Today's Patrol Schedule
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patrolSchedule.map((patrol, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{patrol.time}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{patrol.area}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{patrol.assignedTo}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{patrol.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-[#FA8630]/10 hover:border-[#FA8630] transition-colors"
                  >
                    <action.icon className="h-8 w-8 mb-2 text-[#FA8630]" />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <BellAlertIcon className="h-5 w-5 mr-2" />
                Notifications
              </h2>
              <ul className="space-y-3">
                {notifications.map((notification, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-[#FA8630] mt-0.5 mr-2">•</div>
                    <p className="text-sm text-gray-700">{notification}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;