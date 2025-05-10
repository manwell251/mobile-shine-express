
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

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
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    year: '',
    address: '',
    notes: '',
    agreeToTerms: false
  });

  // Fetch services from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, price')
          .eq('active', true);
          
        if (error) {
          console.error("Error fetching services:", error);
          toast({
            title: "Error",
            description: "Failed to load services. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchServices();
  }, [toast]);
  
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  const formattedTotal = () => {
    const total = calculateTotal();
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(total);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast({
        title: "Please select services",
        description: "You must select at least one service to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms agreement",
        description: "You must agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the customer first
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          location: formData.address || null
        })
        .select()
        .single();
      
      if (customerError) throw customerError;
      if (!customer) throw new Error("Failed to create customer record");
      
      // Create the booking
      const bookingReference = `BK${format(new Date(), 'yyMMdd')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const totalAmount = calculateTotal();
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_reference: bookingReference,
          customer_id: customer.id,
          date: selectedDate,
          time: selectedTime,
          location: formData.address,
          notes: `Vehicle: ${formData.make} ${formData.model} ${formData.year} (${selectedVehicleType}). ${formData.notes}`,
          status: 'Scheduled',
          total_amount: totalAmount
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      if (!booking) throw new Error("Failed to create booking record");
      
      // Add booking services
      for (const serviceId of selectedServices) {
        const service = services.find(s => s.id === serviceId);
        if (!service) continue;
        
        const { error: serviceError } = await supabase
          .from('booking_services')
          .insert({
            booking_id: booking.id,
            service_id: serviceId,
            quantity: 1,
            price_at_booking: service.price
          });
          
        if (serviceError) {
          console.error("Error adding service to booking:", serviceError);
          // Continue with other services even if one fails
        }
      }
      
      // Success!
      toast({
        title: "Booking Submitted",
        description: `Your car wash has been booked! Reference: ${bookingReference}. We'll confirm your appointment soon.`,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        make: '',
        model: '',
        year: '',
        address: '',
        notes: '',
        agreeToTerms: false
      });
      setSelectedDate("");
      setSelectedTime("");
      setSelectedVehicleType("");
      setSelectedServices([]);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was a problem submitting your booking. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
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
                    <label htmlFor="make" className="block text-gray-700 mb-2">Vehicle Make</label>
                    <input 
                      type="text" 
                      id="make" 
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="e.g. Toyota"
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-gray-700 mb-2">Vehicle Model</label>
                    <input 
                      type="text" 
                      id="model" 
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                      placeholder="e.g. Corolla"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-gray-700 mb-2">Vehicle Year</label>
                    <input 
                      type="number" 
                      id="year" 
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
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
                      value={selectedVehicleType}
                      onChange={(e) => setSelectedVehicleType(e.target.value)}
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
                <h3 className="text-xl font-bold mb-4">Select Services</h3>
                <p className="text-gray-600 mb-4">Choose one or more services for your vehicle:</p>
                <div className="grid grid-cols-1 gap-4">
                  {services.length === 0 ? (
                    <div className="text-center p-4">Loading services...</div>
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Checkbox 
                            id={service.id} 
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                            className="mr-3 h-5 w-5" 
                          />
                          <label htmlFor={service.id}>{service.name}</label>
                        </div>
                        <span className="font-bold text-brand-blue">
                          {new Intl.NumberFormat('en-UG', {
                            style: 'currency',
                            currency: 'UGX',
                            minimumFractionDigits: 0
                          }).format(service.price)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                {selectedServices.length > 0 && (
                  <div className="bg-gray-50 mt-4 p-4 rounded-md flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg text-brand-blue">{formattedTotal()}</span>
                  </div>
                )}
                {selectedServices.length === 0 && (
                  <p className="text-amber-600 mt-2">Please select at least one service</p>
                )}
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
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
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
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
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
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
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
                    id="agreeToTerms" 
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="mr-3 mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue" 
                  />
                  <label htmlFor="agreeToTerms" className="text-gray-700">
                    I agree to the <a href="#" className="text-brand-blue underline">Terms and Conditions</a> and understand that my personal information will be processed in accordance with the <a href="#" className="text-brand-blue underline">Privacy Policy</a>.
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="btn-primary w-full py-3 text-lg"
                  disabled={selectedServices.length === 0 || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Book Now'}
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
