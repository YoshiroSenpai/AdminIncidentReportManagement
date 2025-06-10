// components/NavHeader.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const NavHeader = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button if we're already on the landing page
  const showBackButton = location.pathname !== "/landing";

  return (
    <div className="flex items-center justify-between bg-white shadow-sm px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center">
        {/* Back Button (conditionally rendered) */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)} // Go back in history
            className="mr-4 p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="./src/assets/Logo.png" 
            className="h-8 w-auto mr-3"
          />
          <span className="text-xl font-semibold text-[#FA8630] hidden sm:inline-block">
            City Vet Care
          </span>
        </div>

        {/* Page Title */}
        {title && (
          <div className="ml-6 pl-6 border-l border-gray-200">
            <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          </div>
        )}
      </div>

      {/* You can add additional header content here if needed */}
      <div></div>
    </div>
  );
};

export default NavHeader;