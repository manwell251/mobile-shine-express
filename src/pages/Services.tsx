
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { Car, Droplets, SprayCan, Zap, Settings, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-brand-darkBlue text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Professional mobile car wash services designed to keep your vehicle looking pristine — wherever you are.
          </p>
        </div>
      </div>

      {/* Basic Wash Package */}
      <section id="basic" className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Car size={36} className="text-brand-blue mr-4" />
                <h2 className="text-3xl font-bold">Basic Wash Package</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Our Basic Wash Package is perfect for regular maintenance and keeping your vehicle looking clean. We'll remove dirt, dust, and grime from your car's exterior, giving it a sparkling finish.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Exterior Wash: We'll remove dirt, dust, and grime from your car's exterior.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Tire and Wheel Cleaning: We clean and shine your tires and wheels.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Hand Dry: Our team dries your car by hand to avoid water spots.</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-blue">UGX 25,000</p>
                  <p className="text-sm text-gray-500">Price may vary based on vehicle size</p>
                </div>
                <Link to="/booking">
                  <Button className="btn-primary">Book This Service</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&q=80&w=1000" 
                alt="Basic car wash" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full Service Wash */}
      <section id="full" className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1000" 
                alt="Full service car wash" 
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <Droplets size={36} className="text-brand-blue mr-4" />
                <h2 className="text-3xl font-bold">Full-Service Wash Package</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Our Full-Service Wash Package includes everything in the Basic Wash, plus interior cleaning to ensure your car looks great inside and out.
              </p>
              <div className="bg-white p-6 rounded-lg mb-6 shadow-sm">
                <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Everything in the Basic Wash Package</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Interior Cleaning: We vacuum and wipe down seats, carpets, and all interior surfaces.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Window Cleaning: We clean both interior and exterior windows for crystal-clear visibility.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Dashboard and Console Detailing: Wipe down and sanitize your dashboard, console, and door panels.</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-blue">UGX 35,000</p>
                  <p className="text-sm text-gray-500">Price may vary based on vehicle size</p>
                </div>
                <Link to="/booking">
                  <Button className="btn-primary">Book This Service</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Detail Package */}
      <section id="premium" className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <SprayCan size={36} className="text-brand-blue mr-4" />
                <h2 className="text-3xl font-bold">Premium Detail Package</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Our Premium Detail Package is our most comprehensive service, designed to restore your vehicle to like-new condition with deep cleaning and protective treatments.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Everything in the Full-Service Wash Package</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Clay Bar Treatment: We remove embedded contaminants from your paint.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Hand Wax: We apply a protective layer of wax to your car's exterior.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Seat and Carpet Shampooing: We deep clean the seats and carpets, removing stains and odors.</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-blue">UGX 50,000</p>
                  <p className="text-sm text-gray-500">Price may vary based on vehicle size</p>
                </div>
                <Link to="/booking">
                  <Button className="btn-primary">Book This Service</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1655634535290-6bab0013accc?auto=format&fit=crop&q=80&w=1000" 
                alt="Premium car detailing" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Headlight Restoration */}
      <section id="headlight" className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1643730947003-2191ad478de1?auto=format&fit=crop&q=80&w=1000" 
                alt="Headlight restoration" 
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <Zap size={36} className="text-brand-blue mr-4" />
                <h2 className="text-3xl font-bold">Headlight Restoration</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Over time, headlights can become cloudy and yellowed, reducing visibility and detracting from your car's appearance. Our Headlight Restoration service restores clarity and brightness to your headlights.
              </p>
              <div className="bg-white p-6 rounded-lg mb-6 shadow-sm">
                <h3 className="font-bold text-xl mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Cleaning and preparation of headlight surfaces</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Multi-step sanding process to remove oxidation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Polishing to restore clarity</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" />
                    <span>Application of UV protectant to prevent future yellowing</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-blue">UGX 20,000</p>
                  <p className="text-sm text-gray-500">Per pair of headlights</p>
                </div>
                <Link to="/booking">
                  <Button className="btn-primary">Book This Service</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Additional Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Complete Detailing Package */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Settings size={28} className="text-brand-blue mr-3" />
                <h3 className="text-2xl font-bold">Complete Detailing Package</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Our most comprehensive service for vehicles that need special attention. Includes full interior & exterior detail, headlight restoration, engine bay cleaning, and odor elimination treatment.
              </p>
              <div className="flex items-center justify-between mt-6">
                <p className="text-xl font-bold text-brand-blue">UGX 150,000</p>
                <Link to="/booking">
                  <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Fleet Services */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Users size={28} className="text-brand-blue mr-3" />
                <h3 className="text-2xl font-bold">Fleet Services</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Keep your business vehicles looking professional with our fleet cleaning services. Whether you have a few or many vehicles, we offer customizable packages to meet your needs.
              </p>
              <div className="flex items-center justify-between mt-6">
                <p className="text-gray-700 italic">Contact for custom pricing</p>
                <Link to="/contact">
                  <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default Services;
