
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Sparkling Clean Car?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Book your mobile car wash today and experience the convenience of professional detailing at your location.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/booking">
            <Button variant="outline" className="border-white bg-white text-brand-blue hover:bg-brand-blue hover:text-white text-lg px-8 py-3 rounded-full">
              Book Now
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-brand-blue hover:bg-brand-blue hover:text-white text-lg px-8 py-3 rounded-full transition-colors">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
