
import React from 'react';
import { Car, Droplets, SprayCan, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: <Car size={48} className="text-brand-blue mb-4" />,
    title: 'Basic Wash Package',
    description: 'Exterior wash, tire and wheel cleaning, and hand dry for a sparkling finish.',
    price: 'UGX 25,000',
    link: '/services#basic'
  },
  {
    icon: <Droplets size={48} className="text-brand-blue mb-4" />,
    title: 'Full-Service Wash',
    description: 'Basic wash plus interior cleaning, window cleaning, and dashboard detailing.',
    price: 'UGX 35,000',
    link: '/services#full'
  },
  {
    icon: <SprayCan size={48} className="text-brand-blue mb-4" />,
    title: 'Premium Detail Package',
    description: 'Full-service plus clay bar treatment, hand wax, and seat/carpet shampooing.',
    price: 'UGX 50,000',
    link: '/services#premium'
  },
  {
    icon: <Zap size={48} className="text-brand-blue mb-4" />,
    title: 'Headlight Restoration',
    description: 'Restore dull, cloudy headlights for better appearance and safety.',
    price: 'UGX 20,000',
    link: '/services#headlight'
  }
];

const Services = () => {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Professional mobile car wash services designed to keep your vehicle looking pristine — wherever you are.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center card-hover">
              {service.icon}
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-brand-blue font-bold text-xl mb-4">{service.price}</p>
              <Link to={service.link} className="mt-auto">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button className="btn-primary">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
