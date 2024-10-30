// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LogoImg from '../images/F_image_2.jpeg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={LogoImg}
              alt="Quantify Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-blue-600">Quantify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
              Profile
            </Link>
            <Link to="/database-search" className="text-gray-600 hover:text-blue-600 transition-colors">
              Search Jobs
            </Link>
            <Link to="/cocktail/list" className="text-gray-600 hover:text-blue-600 transition-colors">
              Job List
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/database-search" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Search Jobs
              </Link>
              <Link 
                to="/cocktail/list" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Job List
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;