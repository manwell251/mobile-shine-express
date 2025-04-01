
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ServiceOption = {
  id: string;
  name: string;
  price: string;
};

const services: ServiceOption[] = [
  { id: "basic", name: "Basic Wash Package", price: "UGX 25,000" },
  { id: "full", name: "Full-Service Wash Package", price: "UGX 35,000" },
  { id: "premium", name: "Premium Detail Package", price: "UGX 50,000" },
  { id: "headlight", name: "Headlight Restoration", price: "UGX 20,000" },
  { id: "complete", name: "Complete Detailing Package", price: "UGX 150,000" }
];

const vehicleTypes = [
  "Sedan", "SUV", "Truck", "Van", "Motorcycle", "Other"
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const Booking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Booking Submitted",
      description: "Your car wash has been booked! We'll confirm your appointment soon.",
    });
    
    // Reset form
    e.currentTarget.reset();
    setSelectedDate("");
    setSelectedService("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-brand-darkBlue text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Service</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Schedule your mobile car wash at a time and location that's convenient for you.
          </p>
        </div>
      </div>

      {/* Booking Form Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Request a Service</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="Your Phone Number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Vehicle Information */}
              <div>
                <h3 className="text-xl font-bold mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vehicle-make" className="block text-gray-700 mb-2">Vehicle Make</label>
                    <input 
                      type="text" 
                      id="vehicle-make" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="e.g. Toyota"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicle-model" className="block text-gray-700 mb-2">Vehicle Model</label>
                    <input 
                      type="text" 
                      id="vehicle-model" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="e.g. Corolla"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicle-year" className="block text-gray-700 mb-2">Vehicle Year</label>
                    <input 
                      type="number" 
                      id="vehicle-year" 
                      required 
                      min="1900" 
                      max={new Date().getFullYear()} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="e.g. 2020"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicle-type" className="block text-gray-700 mb-2">Vehicle Type</label>
                    <select 
                      id="vehicle-type" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map((type, index) => (
                        <option key={index} value={type.toLowerCase()}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Service Selection */}
              <div>
                <h3 className="text-xl font-bold mb-4">Select Service</h3>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center">
                      <input 
                        type="radio" 
                        id={service.id} 
                        name="service"
                        value={service.id}
                        required
                        checked={selectedService === service.id}
                        onChange={() => setSelectedService(service.id)}
                        className="mr-3 h-5 w-5 text-brand-blue focus:ring-brand-blue" 
                      />
                      <label htmlFor={service.id} className="flex flex-col md:flex-row md:items-center w-full justify-between">
                        <span>{service.name}</span>
                        <span className="font-bold text-brand-blue">{service.price}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location & Scheduling */}
              <div>
                <h3 className="text-xl font-bold mb-4">Location & Scheduling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-gray-700 mb-2">
                      <MapPin className="inline-block mr-1" size={16} />
                      Service Location
                    </label>
                    <input 
                      type="text" 
                      id="address" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-gray-700 mb-2">
                      <CalendarIcon className="inline-block mr-1" size={16} />
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      id="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-gray-700 mb-2">
                      <Clock className="inline-block mr-1" size={16} />
                      Preferred Time
                    </label>
                    <select 
                      id="time" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="">Select Time Slot</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Special Requests */}
              <div>
                <label htmlFor="notes" className="block text-gray-700 mb-2">Special Requests or Notes</label>
                <textarea 
                  id="notes" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  placeholder="Any additional information or requests you'd like us to know"
                ></textarea>
              </div>
              
              {/* Terms & Submit */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="mr-3 mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue" 
                  />
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the <a href="#" className="text-brand-blue underline">Terms and Conditions</a> and understand that my personal information will be processed in accordance with the <a href="#" className="text-brand-blue underline">Privacy Policy</a>.
                  </label>
                </div>
                
                <Button type="submit" className="btn-primary w-full py-3 text-lg">
                  Book Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How Booking Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-blue rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-2">Fill Out the Form</h3>
              <p className="text-gray-600">Provide your details, vehicle information, preferred service, and schedule.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-blue rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-2">Confirmation Call</h3>
              <p className="text-gray-600">We'll call to confirm your booking and discuss any special requirements.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-blue rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-2">We Come to You</h3>
              <p className="text-gray-600">Our team arrives at your location on the scheduled date and time.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Booking;
