import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full py-6 px-6 lg:px-12 flex justify-between items-center bg-transparent z-50 relative">
      <Logo />
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Home</a>
        <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Components</a>
        <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Links</a>
        <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Blog</a>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
          Explore Now
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden border-t border-gray-100">
           <a href="#" className="text-gray-600 font-medium">Home</a>
           <a href="#" className="text-gray-600 font-medium">Components</a>
           <a href="#" className="text-gray-600 font-medium">Links</a>
           <a href="#" className="text-gray-600 font-medium">Blog</a>
           <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold w-full">
            Explore Now
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;