
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  ctaLink, 
  highlighted = false 
}) => {
  return (
    <div className={`rounded-2xl p-6 md:p-8 shadow-lg flex flex-col h-full ${highlighted ? 'bg-brand-darkBlue text-white relative border-4 border-brand-blue transform scale-105' : 'bg-white'}`}>
      {highlighted && (
        <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 text-center">
          <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
        </div>
      )}
      <h3 className={`text-2xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-brand-darkBlue'}`}>{title}</h3>
      <div className="mb-4">
        <span className={`text-3xl md:text-4xl font-bold ${highlighted ? 'text-white' : 'text-brand-blue'}`}>{price}</span>
        {period && <span className={`text-sm ${highlighted ? 'text-gray-200' : 'text-gray-500'}`}>/{period}</span>}
      </div>
      <p className={`mb-6 ${highlighted ? 'text-gray-200' : 'text-gray-600'}`}>{description}</p>
      <div className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            {feature.included ? (
              <Check className={`flex-shrink-0 mr-2 mt-1 ${highlighted ? 'text-brand-lightBlue' : 'text-brand-green'}`} size={18} />
            ) : (
              <X className="flex-shrink-0 mr-2 mt-1 text-gray-400" size={18} />
            )}
            <span className={feature.included ? '' : (highlighted ? 'text-gray-400' : 'text-gray-400')}>{feature.text}</span>
          </div>
        ))}
      </div>
      <Link to={ctaLink} className="mt-auto">
        <Button 
          className={`w-full ${highlighted ? 'bg-white text-brand-darkBlue hover:bg-gray-100' : 'btn-primary'}`}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
};

const Pricing = () => {
  const subscriptionPlans = [
    {
      title: "Basic Plan",
      price: "UGX 400,000",
      period: "month",
      description: "Perfect for regular car maintenance and keeping your vehicle clean.",
      features: [
        { text: "2 Basic Washes per month", included: true },
        { text: "Exterior Wash", included: true },
        { text: "Tire and Wheel Cleaning", included: true },
        { text: "Interior Vacuum", included: true },
        { text: "Dashboard Wipe Down", included: true },
        { text: "Window Cleaning", included: false },
        { text: "Full Interior Detailing", included: false },
        { text: "Hand Wax", included: false },
        { text: "Scheduled in advance", included: true },
      ],
      cta: "Subscribe Now",
      ctaLink: "/booking",
      highlighted: false
    },
    {
      title: "Full Detail Plan",
      price: "UGX 500,000",
      period: "month",
      description: "Comprehensive coverage for those who want their car to always look its best.",
      features: [
        { text: "1 Full Detail per month", included: true },
        { text: "Exterior Wash", included: true },
        { text: "Tire and Wheel Cleaning", included: true },
        { text: "Interior Vacuum", included: true },
        { text: "Dashboard Wipe Down", included: true },
        { text: "Window Cleaning", included: true },
        { text: "Full Interior Detailing", included: true },
        { text: "Hand Wax", included: true },
        { text: "Priority scheduling", included: true },
      ],
      cta: "Subscribe Now",
      ctaLink: "/booking",
      highlighted: true
    },
    {
      title: "Pay Per Service",
      price: "From UGX 25,000",
      period: "",
      description: "Choose the services you need, when you need them.",
      features: [
        { text: "Basic Wash (UGX 25,000)", included: true },
        { text: "Full-Service Wash (UGX 35,000)", included: true },
        { text: "Premium Detail (UGX 50,000)", included: true },
        { text: "Headlight Restoration (UGX 20,000)", included: true },
        { text: "Complete Detailing (UGX 150,000)", included: true },
        { text: "No commitment required", included: true },
        { text: "Book on-demand", included: true },
        { text: "All services available", included: true },
        { text: "Standard scheduling", included: true },
      ],
      cta: "Book Service",
      ctaLink: "/booking",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-brand-darkBlue text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Choose the perfect plan to keep your vehicle looking its best, with flexible options to fit your needs.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Subscription Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {subscriptionPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                cta={plan.cta}
                ctaLink={plan.ctaLink}
                highlighted={plan.highlighted}
              />
            ))}
          </div>

          <div className="mt-12 text-center bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Additional Information</h3>
            <ul className="space-y-2 text-left text-gray-700">
              <li className="flex items-start">
                <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Pricing may vary depending on the size and condition of the vehicle (e.g., larger vehicles like SUVs, trucks, and vans may incur an additional fee).</span>
              </li>
              <li className="flex items-start">
                <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Travel Fees: For locations outside 15 km from our base, a travel fee of UGX 20,000 may apply.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-brand-green mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Corporate and fleet discounts are available. Please <Link to="/contact" className="text-brand-blue underline">contact us</Link> for more information.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Convenience</h3>
              <p className="text-gray-600">We come to you, saving you time and hassle.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Team</h3>
              <p className="text-gray-600">Our team is trained, insured, and committed to quality.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">We use environmentally safe products and water-conserving methods.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable</h3>
              <p className="text-gray-600">Quality service that fits your budget with flexible pricing options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Service?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Choose the package that works for you and get started today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/booking">
              <Button className="bg-white text-brand-blue hover:bg-gray-100 text-lg px-8 py-3 rounded-full">
                Book Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
