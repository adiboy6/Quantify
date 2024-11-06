import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <Link
              to="/dashboard/saved-jobs"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                location.pathname.includes('/saved-jobs')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Saved Jobs
            </Link>
            {/* Add other dashboard navigation items here */}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;