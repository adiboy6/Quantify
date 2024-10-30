// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Search, FileText, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </Link>
              <Link to="/database-search" className="text-gray-600 hover:text-blue-600 transition-colors">
                Search Jobs
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                <Search size={18} />
                <span>Job Search</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                <Briefcase size={18} />
                <span>Automate Application</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                <FileText size={18} />
                <span>Cover Letter</span>
              </a>
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Project</h3>
            <div className="text-gray-600 space-y-2">
              <p>CS5704 Capstone Project</p>
              <p>Developed by:</p>
              <p className="text-sm">
                Aditya Reddy, Khavin, Uma Sruthy Gajula, Vamsi, Vineela
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/virginiatech/" target="_blank" rel="noopener noreferrer" 
                 className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com/virginia_tech/" target="_blank" rel="noopener noreferrer"
                 className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://www.linkedin.com/school/virginia-tech/" target="_blank" rel="noopener noreferrer"
                 className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://www.instagram.com/virginia.tech/" target="_blank" rel="noopener noreferrer"
                 className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Powered by: 
            <a href="#" className="text-blue-600 hover:text-blue-800 ml-2">Job API</a>
            <span className="mx-2">|</span>
            <a href="#" className="text-blue-600 hover:text-blue-800">Dashboard API</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;