
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl text-brand-blue">KLIN<span className="text-brand-green">RIDE</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-brand-blue font-medium">Home</Link>
          <Link to="/services" className="text-gray-700 hover:text-brand-blue font-medium">Services</Link>
          <Link to="/pricing" className="text-gray-700 hover:text-brand-blue font-medium">Pricing</Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-blue font-medium">About Us</Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-blue font-medium">Contact</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <a href="tel:+256776041056" className="flex items-center text-brand-blue">
            <Phone size={18} className="mr-2" />
            <span>+256 776 041 056</span>
          </a>
          <Link to="/booking">
            <Button className="btn-primary">Book Now</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg absolute top-16 left-0 w-full z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-brand-blue font-medium py-2" onClick={toggleMenu}>Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-brand-blue font-medium py-2" onClick={toggleMenu}>Services</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-brand-blue font-medium py-2" onClick={toggleMenu}>Pricing</Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-blue font-medium py-2" onClick={toggleMenu}>About Us</Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-blue font-medium py-2" onClick={toggleMenu}>Contact</Link>
            <div className="pt-4 border-t border-gray-200">
              <a href="tel:+256776041056" className="flex items-center text-brand-blue py-2">
                <Phone size={18} className="mr-2" />
                <span>+256 776 041 056</span>
              </a>
              <Link to="/booking" onClick={toggleMenu}>
                <Button className="btn-primary w-full mt-4">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
