
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingFormProps {
  onCancel: () => void;
  existingBooking?: any; // Type this properly in a real application
}

const BookingForm: React.FC<BookingFormProps> = ({ onCancel, existingBooking }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(existingBooking?.services || []);
  
  // Mock data - would be fetched from settings in a real app
  const services = [
    { id: "basic", name: "Basic Wash Package", price: "UGX 25,000" },
    { id: "full", name: "Full-Service Wash Package", price: "UGX 35,000" },
    { id: "premium", name: "Premium Detail Package", price: "UGX 50,000" },
    { id: "headlight", name: "Headlight Restoration", price: "UGX 20,000" },
    { id: "complete", name: "Complete Detailing Package", price: "UGX 150,000" }
  ];

  const statusOptions = ["Draft", "Scheduled", "InProgress", "Completed", "Cancelled"];

  // Calculate total based on selected services
  const calculateTotal = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + parseInt(service.price.replace(/\D/g, '')), 0)
      .toLocaleString();
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted with selected services:", selectedServices);
    onCancel(); // Close form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName" 
              defaultValue={existingBooking?.customerName || ""} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              defaultValue={existingBooking?.phone || ""} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email" 
              type="email" 
              defaultValue={existingBooking?.email || ""} 
            />
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input 
              id="make" 
              defaultValue={existingBooking?.vehicle?.make || ""} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input 
              id="model" 
              defaultValue={existingBooking?.vehicle?.model || ""} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input 
              id="year" 
              type="number" 
              min="1900" 
              max="2030" 
              defaultValue={existingBooking?.vehicle?.year || ""} 
              required 
            />
          </div>
        </div>
      </div>

      {/* Services Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Services</h3>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <Checkbox
                  id={`service-${service.id}`}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                  className="mr-3"
                />
                <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                  {service.name}
                </Label>
              </div>
              <div className="font-medium">{service.price}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-2">
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-gray-600">Total: </span>
            <span className="font-bold text-lg">UGX {calculateTotal()}</span>
          </div>
        </div>
      </div>

      {/* Schedule & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Schedule</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input 
                  id="date" 
                  type="date" 
                  required 
                  defaultValue={existingBooking?.date || ""}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Input 
                  id="time" 
                  type="time" 
                  required 
                  defaultValue={existingBooking?.time || ""}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Booking Details</h3>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={existingBooking?.status || "Draft"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Service Location</Label>
            <Input 
              id="location" 
              defaultValue={existingBooking?.location || ""} 
              required 
              placeholder="Customer's address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              defaultValue={existingBooking?.notes || ""} 
              placeholder="Additional information"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {existingBooking ? 'Update Booking' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
