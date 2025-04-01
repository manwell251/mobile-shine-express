
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { Shield, Clock, Users, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Clock size={36} className="text-brand-blue" />,
      title: 'Convenience',
      description: 'We come to you, whether at home, work, or your favorite spot.'
    },
    {
      icon: <Shield size={36} className="text-brand-blue" />,
      title: 'Eco-Friendly',
      description: 'Our environmentally-conscious methods reduce water waste and use biodegradable products.'
    },
    {
      icon: <Users size={36} className="text-brand-blue" />,
      title: 'Quality',
      description: 'From the inside out, we treat your car with the care it deserves, using premium products and techniques.'
    },
    {
      icon: <Heart size={36} className="text-brand-blue" />,
      title: 'Reliability',
      description: "We're punctual, professional, and committed to getting the job done right the first time."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-brand-darkBlue text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Learn about our journey to becoming the premier mobile car detailing service.
          </p>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-700 mb-6">
              Welcome to Klin Ride, the premier mobile car wash service dedicated to providing top-notch vehicle cleaning with the utmost convenience. We are a locally-owned and operated business offering professional car washing, detailing, and eco-friendly solutions – all brought directly to your location.
            </p>
            <p className="text-gray-700 mb-6">
              Founded with the goal of making car maintenance easier and more accessible, we specialize in bringing a sparkling clean to your vehicle, whether you're at home, at the office, or anywhere you need us. Our team of skilled professionals uses high-quality products, cutting-edge equipment, and eco-conscious methods to deliver an exceptional service that exceeds expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              At Klin Ride, we aim to deliver the highest level of quality, convenience, and customer satisfaction. We believe every car deserves to shine, and our mission is to provide an efficient, reliable, and hassle-free car wash experience – one that fits seamlessly into your busy lifestyle.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Klin Ride Mobile Car Wash was born out of a desire to provide an easier, more convenient car washing solution for busy people. After noticing that many car owners were frustrated with the time and effort required to take their cars to traditional car wash locations, we decided to bring the car wash experience to them. What started as a small operation in Kira town has grown into a trusted and convenient service for car owners across the area.
            </p>
            <p className="text-gray-700 mb-6">
              Today, we are proud to be a trusted partner for hundreds of customers who rely on us to keep their vehicles looking pristine. Our dedication to quality and customer service has earned us a loyal following, and we are excited to continue expanding our reach and helping even more drivers keep their cars clean at all time with the utmost convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-gray-700 mb-6">
              Our team is made up of experienced car care professionals who share a passion for making your car look its best. We understand that your car is more than just a vehicle – it's an investment, and we treat it with the respect it deserves.
            </p>
            <p className="text-gray-700 mb-6">
              We take the time to thoroughly clean your vehicle, ensuring every corner is spotless and every surface is gleaming. Whether it's a simple exterior wash or a complete detailing job, we treat every vehicle like it's our own.
            </p>
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default About;
