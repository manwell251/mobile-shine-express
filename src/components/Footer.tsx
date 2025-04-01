
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">KLIN<span className="text-brand-green">RIDE</span></h3>
            <p className="mb-4 text-gray-300">A sparkling Ride Wherever You Are!</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-brand-blue">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-brand-blue">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-brand-blue">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white">Pricing</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-white">Book a Wash</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-300 hover:text-white">Basic Wash</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Full-Service Wash</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Premium Detail</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Headlight Restoration</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Fleet Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-brand-blue" />
                <div>
                  <p className="text-gray-300">+256 776 041 056</p>
                  <p className="text-gray-300">+256 704 818 826</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-brand-blue" />
                <p className="text-gray-300">klinride25@gmail.com</p>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-brand-blue" />
                <p className="text-gray-300">L2B Butenga Estate, Kira-Kasangati Rd</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Klin Ride Mobile Car Detailing Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
