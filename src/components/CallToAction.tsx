
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-brand-blue/70"></div>
      
      {/* Abstract shapes for background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready for a Sparkling Clean Car?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
          Book your mobile car wash today and experience the convenience of professional detailing at your location.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/booking">
            <Button className="bg-white hover:bg-white/90 text-brand-blue text-lg px-10 py-6 rounded-full transition-all transform hover:scale-105">
              Book Now
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/20 text-lg px-10 py-6 rounded-full transition-all transform hover:scale-105">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
