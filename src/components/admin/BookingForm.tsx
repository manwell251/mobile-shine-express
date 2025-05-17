
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Clock } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BookingWithDetails } from '@/services/bookings';
import { servicesService } from '@/services/services';
import { useToast } from '@/hooks/use-toast';
import { bookingsService } from '@/services/bookings';
import { CommandInput, CommandList, CommandItem, CommandGroup, Command } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/lib/supabase';
import { BookingStatus } from '@/types/booking';

interface BookingFormProps {
  onCancel: () => void;
  existingBooking?: BookingWithDetails;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onCancel, existingBooking, onSuccess }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(existingBooking?.serviceIds || []);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerName: existingBooking?.customerName || '',
    phone: existingBooking?.phone || '',
    email: existingBooking?.email || '',
    vehicleMake: existingBooking?.vehicle?.make || '',
    vehicleModel: existingBooking?.vehicle?.model || '',
    vehicleYear: existingBooking?.vehicle?.year || new Date().getFullYear().toString(),
    date: existingBooking?.date || new Date().toISOString().slice(0, 10),
    time: existingBooking?.time || '',
    status: existingBooking?.status || 'Draft' as BookingStatus,
    location: existingBooking?.location || '',
    notes: existingBooking?.notes || '',
    customerId: existingBooking?.customer_id || null,
  });
  const [openCustomerSearch, setOpenCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchServices();
    fetchCustomers();
  }, []);

  const fetchServices = async () => {
    try {
      const result = await servicesService.getActive();
      if (result) {
        setServices(result.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price
        })));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, status: status as BookingStatus }));
  };

  // Filter customers based on search query
  const filteredCustomers = customerSearchQuery
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(customerSearchQuery))
      )
    : customers;

  const selectCustomer = (customer: any) => {
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone || prev.phone,
      email: customer.email || prev.email,
      location: customer.location || prev.location
    }));
    setOpenCustomerSearch(false);
  };

  // Calculate total based on selected services
  const calculateTotal = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + (service.price || 0), 0)
      .toLocaleString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare customer data
      let customerId = formData.customerId;
      
      // If no existing customer id, create a new customer
      if (!customerId) {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: formData.customerName,
            phone: formData.phone,
            email: formData.email || null,
            location: formData.location
          })
          .select()
          .single();
          
        if (customerError) {
          throw customerError;
        }
        
        customerId = newCustomer.id;
      }
      
      // Calculate total amount
      const totalAmount = services
        .filter(service => selectedServices.includes(service.id))
        .reduce((total, service) => total + (service.price || 0), 0);
      
      // Prepare booking data
      const bookingData = {
        booking_reference: existingBooking?.booking_reference || `BK${new Date().getTime().toString().slice(-6)}`,
        customer_id: customerId,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        location: formData.location,
        notes: formData.notes || null,
        total_amount: totalAmount
      };
      
      let bookingResult;
      
      if (existingBooking) {
        // Update existing booking
        bookingResult = await bookingsService.update(existingBooking.id, bookingData, selectedServices);
      } else {
        // Create new booking
        bookingResult = await bookingsService.create(bookingData, selectedServices);
      }
      
      toast({
        title: "Success",
        description: existingBooking ? "Booking updated successfully" : "Booking created successfully"
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        onCancel();
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Error",
        description: "Failed to save booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ["Draft", "Scheduled", "InProgress", "Completed", "Cancelled"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Popover open={openCustomerSearch} onOpenChange={setOpenCustomerSearch}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input 
                    id="customerName" 
                    value={formData.customerName}
                    onChange={(e) => {
                      handleInputChange(e);
                      setCustomerSearchQuery(e.target.value);
                    }}
                    onClick={() => setOpenCustomerSearch(true)}
                    placeholder="Search or enter new customer name"
                    className="w-full"
                    required
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search customers..." 
                    value={customerSearchQuery}
                    onValueChange={setCustomerSearchQuery}
                  />
                  <CommandList>
                    <CommandGroup heading="Existing Customers">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            onSelect={() => selectCustomer(customer)}
                          >
                            <div className="flex flex-col">
                              <span>{customer.name}</span>
                              <span className="text-xs text-gray-500">{customer.phone}</span>
                            </div>
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem disabled>No customers found</CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleMake">Make</Label>
            <Input 
              id="vehicleMake" 
              value={formData.vehicleMake}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Model</Label>
            <Input 
              id="vehicleModel" 
              value={formData.vehicleModel}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleYear">Year</Label>
            <Input 
              id="vehicleYear" 
              type="number" 
              min="1900" 
              max="2030" 
              value={formData.vehicleYear}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
      </div>

      {/* Services Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Services</h3>
        {services.length > 0 ? (
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
                <div className="font-medium">UGX {service.price?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center border rounded-md">
            <p className="text-gray-500">Loading services...</p>
          </div>
        )}
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
                  value={formData.date}
                  onChange={handleInputChange}
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
                  value={formData.time}
                  onChange={handleInputChange}
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
            <Select 
              defaultValue={formData.status} 
              onValueChange={handleStatusChange}
            >
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
              value={formData.location}
              onChange={handleInputChange}
              required 
              placeholder="Customer's address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : existingBooking ? 'Update Booking' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
