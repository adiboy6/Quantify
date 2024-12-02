import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Welcome to the Dashboard!
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Track your saved jobs and applications in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
            <nav className="space-y-2">
              <Link
                to="/dashboard/saved-jobs"
                className={`block text-gray-600 hover:text-blue-600 ${
                  location.pathname.includes('/saved-jobs') ? 'text-blue-600' : ''
                }`}
              >
                Saved Jobs
              </Link>
              <Link
                to="/dashboard/jobs" // Update to use Link component
                className={`block text-gray-600 hover:text-blue-600 ${
                  location.pathname.includes('/jobs') ? 'text-blue-600' : ''
                }`}
              >
                Jobs
              </Link>
              <Link
                to="#applications"
                className="block text-gray-600 hover:text-blue-600"
              >
                Applications
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Saved Jobs</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Applications</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            </div>
          </div>

          {/* Main Content Section */}
          <section id="main-content" className="bg-white rounded-lg shadow-sm">
            <Outlet /> {/* This will render the nested routes */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;