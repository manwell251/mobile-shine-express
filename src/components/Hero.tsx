
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    "https://images.unsplash.com/photo-1520340356584-0248e45c7c98?auto=format&fit=crop&q=80&w=2069",
    "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?auto=format&fit=crop&q=80&w=2069",
    "https://images.unsplash.com/photo-1600706002115-514a88aab33f?auto=format&fit=crop&q=80&w=2069",
    "https://images.unsplash.com/photo-1607350412986-a40d93f2e448?auto=format&fit=crop&q=80&w=2069"
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, [backgroundImages.length]);

  return (
    <div className="relative">
      {/* Hero Images with Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-black/40 absolute inset-0 z-10"></div>
        {backgroundImages.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={`Car detailing image ${index + 1}`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-4000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 section-padding min-h-[85vh] flex items-center">
        <div className="container mx-auto">
          <div className="max-w-xl animate-slide-in">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              A Sparkling Ride Wherever You Are!
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Professional mobile car detailing services that come to you. Experience convenience and quality with Klin Ride.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/booking">
                <Button className="btn-primary text-lg w-full sm:w-auto">Book Now</Button>
              </Link>
              <a href="tel:+256776041056" className="flex justify-center items-center bg-white text-brand-blue rounded-full px-6 py-2 font-bold hover:bg-gray-100 transition-colors">
                <Phone size={20} className="mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
