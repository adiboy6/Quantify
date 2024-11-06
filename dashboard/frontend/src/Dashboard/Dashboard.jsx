import React from 'react';
import { Building, MapPin, BookmarkPlus } from 'lucide-react';

const Dashboard = () => {
  // Sample jobs data
  const jobs = [
    {
      id: 1,
      title: "Summer 2025 Supply Chain Intern-Master's Degree",
      company: "Applied Materials",
      location: "Austin, TX, USA",
      type: "Internship",
      logo: "/api/placeholder/80/80"
    }
  ];

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
            <nav className="space-y-2">
              <a href="#jobs" className="block text-gray-600 hover:text-blue-600">
                Jobs
              </a>
              <a href="#saved-jobs" className="block text-gray-600 hover:text-blue-600">
                Saved Jobs
              </a>
              <a href="#applications" className="block text-gray-600 hover:text-blue-600">
                Applications
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{jobs.length}</p>
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
            {/* Content will be rendered by the router */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;