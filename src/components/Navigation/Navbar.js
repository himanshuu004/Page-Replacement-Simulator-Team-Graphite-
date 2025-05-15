import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-green-600 hover:border-green-600 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-lg font-semibold">
              Page Replacement Algorithms
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/home"
              className="text-white text-md font-medium border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-green-600 hover:border-green-600 transition duration-300 transform hover:scale-105"
            >
              Simulator
            </Link>
          </div>

          {/* Mobile Drawer (optional placeholder) */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
