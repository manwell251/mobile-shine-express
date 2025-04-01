
import React from 'react';
import { CalendarCheck, Car, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <CalendarCheck size={36} className="text-white" />,
    title: 'Book Your Appointment',
    description: 'Select your service and schedule your wash at a time that suits you.'
  },
  {
    icon: <Car size={36} className="text-white" />,
    title: 'We Arrive at Your Location',
    description: 'Our team comes to you wherever you are with all the equipment needed.'
  },
  {
    icon: <CheckCircle size={36} className="text-white" />,
    title: 'Enjoy Your Sparkling Clean Car',
    description: 'Drive away in a spotless vehicle with no time wasted!'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Getting your car cleaned has never been easier. Our simple 3-step process brings the car wash to you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-brand-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Step {index + 1}: {step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block h-0.5 bg-gray-200 w-full absolute left-0 right-0" style={{ top: '8rem' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
