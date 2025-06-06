import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
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
                <span className="text-xl font-semibold text-indigo-600">
                  Dashboard
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
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Calendar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Documents
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                >
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            isDrawerOpen ? "ml-64" : "ml-0"
          } transition-all duration-300`}
        >
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
              <h1 className="text-2xl font-bold text-indigo-600 mb-4">
                Welcome to your Dashboard!
              </h1>
              <p className="text-gray-600">You've successfully logged in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
