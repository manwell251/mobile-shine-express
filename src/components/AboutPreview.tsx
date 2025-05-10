
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const features = [
  'Convenience - We come to you',
  'Eco-Friendly cleaning solutions',
  'Professional & trained technicians',
  'High-quality, premium products',
  'Flexible packages for every need',
  'Satisfaction guaranteed'
];

const AboutPreview = () => {
  return (
    <section id="about-preview" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-6">
              Welcome to Klin Ride, the premier mobile car wash service dedicated to providing top-notch vehicle cleaning with the utmost convenience. We are a locally-owned and operated business offering professional car washing, detailing, and eco-friendly solutions – all brought directly to your location.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link to="/about">
              <Button className="btn-primary">Learn More About Us</Button>
            </Link>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="home.png" 
                alt="Car detailing professional" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-blue text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-bold text-xl">5+ Years</p>
              <p>Of Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
