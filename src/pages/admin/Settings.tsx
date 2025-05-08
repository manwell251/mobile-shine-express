
import React, { useState, useEffect } from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { servicesService, Service, ServiceInsert, ServiceUpdate } from '@/services/services';
import { settingsService, BusinessInfo, BookingSettings, TimeSlots } from '@/services/settings';

interface ServiceSettings {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Services state
  const [services, setServices] = useState<ServiceSettings[]>([]);
  const [newService, setNewService] = useState<Partial<ServiceSettings>>({
    name: '',
    price: 0,
    description: '',
    active: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Business info state
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Booking settings state
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    allowSameDayBookings: true,
    requirePhoneVerification: false,
    sendSmsReminders: false
  });

  // Time slots state
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({
    startTime: '08:00',
    endTime: '18:00',
    slotDuration: 60
  });

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setIsLoading(true);

      // Fetch services
      const servicesData = await servicesService.getAll();
      setServices(servicesData.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        description: service.description || '',
        active: service.active
      })));

      // Fetch business info
      const businessInfoData = await settingsService.getBusinessInfo();
      setBusinessInfo(businessInfoData);

      // Fetch booking settings
      const bookingSettingsData = await settingsService.getBookingSettings();
      setBookingSettings(bookingSettingsData);

      // Fetch time slots
      const timeSlotsData = await settingsService.getTimeSlots();
      setTimeSlots(timeSlotsData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceChange = (id: string, field: keyof ServiceSettings, value: any) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const handleNewServiceChange = (field: keyof ServiceSettings, value: any) => {
    setNewService(prev => ({ ...prev, [field]: value }));
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and price for the new service.",
        variant: "destructive"
      });
      return;
    }

    try {
      const serviceData: ServiceInsert = {
        name: newService.name,
        price: Number(newService.price),
        description: newService.description || null,
        active: newService.active || true
      };

      const createdService = await servicesService.create(serviceData);
      
      setServices(prev => [...prev, { 
        id: createdService.id,
        name: createdService.name,
        price: createdService.price,
        description: createdService.description || '',
        active: createdService.active
      }]);
      
      setNewService({
        name: '',
        price: 0,
        description: '',
        active: true
      });

      toast({
        title: "Service Added",
        description: "The new service has been added successfully."
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add the service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await servicesService.delete(id);
      setServices(prev => prev.filter(service => service.id !== id));
      
      toast({
        title: "Service Deleted",
        description: "The service has been removed from the system."
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete the service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveServiceSettings = async () => {
    try {
      // Update each service
      for (const service of services) {
        const serviceData: ServiceUpdate = {
          name: service.name,
          price: Number(service.price),
          description: service.description || null,
          active: service.active
        };
        
        await servicesService.update(service.id, serviceData);
      }
      
      toast({
        title: "Settings Saved",
        description: "Your service settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving services settings:', error);
      toast({
        title: "Error",
        description: "Failed to save service settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveBusinessInfo = async () => {
    try {
      await settingsService.updateBusinessInfo(businessInfo);
      
      toast({
        title: "Business Info Saved",
        description: "Your business information has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving business info:', error);
      toast({
        title: "Error",
        description: "Failed to save business information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      await settingsService.updateBookingSettings(bookingSettings);
      await settingsService.updateTimeSlots(timeSlots);
      
      toast({
        title: "System Settings Saved",
        description: "Your system settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast({
        title: "Error",
        description: "Failed to save system settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="services">
        <TabsList className="mb-6">
          <TabsTrigger value="services">Services & Pricing</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Services & Pricing</CardTitle>
                <Button onClick={handleSaveServiceSettings} disabled={isLoading}>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Services</h3>
                    {Array(5).fill(0).map((_, index) => (
                      <div key={`service-loading-${index}`} className="grid grid-cols-12 gap-4 items-center border-b pb-4 mb-4">
                        <div className="col-span-4 md:col-span-3">
                          <div className="h-4 bg-gray-200 w-24 animate-pulse rounded mb-1"></div>
                          <div className="h-9 bg-gray-200 w-full animate-pulse rounded"></div>
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <div className="h-4 bg-gray-200 w-16 animate-pulse rounded mb-1"></div>
                          <div className="h-9 bg-gray-200 w-full animate-pulse rounded"></div>
                        </div>
                        <div className="col-span-4 md:col-span-5">
                          <div className="h-4 bg-gray-200 w-20 animate-pulse rounded mb-1"></div>
                          <div className="h-9 bg-gray-200 w-full animate-pulse rounded"></div>
                        </div>
                        <div className="col-span-1 flex items-end justify-center">
                          <div className="h-6 bg-gray-200 w-10 animate-pulse rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Services */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Services</h3>
                    
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div 
                          key={service.id}
                          className="grid grid-cols-12 gap-4 items-center border-b pb-4"
                        >
                          <div className="col-span-4 md:col-span-3">
                            <Label htmlFor={`name-${service.id}`}>Service Name</Label>
                            <Input
                              id={`name-${service.id}`}
                              value={service.name}
                              onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                            />
                          </div>
                          
                          <div className="col-span-3 md:col-span-2">
                            <Label htmlFor={`price-${service.id}`}>Price (UGX)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                              <Input
                                id={`price-${service.id}`}
                                type="number"
                                value={service.price}
                                className="pl-9"
                                onChange={(e) => handleServiceChange(service.id, 'price', Number(e.target.value))}
                              />
                            </div>
                          </div>
                          
                          <div className="col-span-4 md:col-span-5">
                            <Label htmlFor={`desc-${service.id}`}>Description</Label>
                            <Input
                              id={`desc-${service.id}`}
                              value={service.description}
                              onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                            />
                          </div>
                          
                          <div className="col-span-1 flex items-end justify-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id={`active-${service.id}`}
                                checked={service.active}
                                onCheckedChange={(checked) => handleServiceChange(service.id, 'active', checked)}
                              />
                              <Label htmlFor={`active-${service.id}`} className="text-sm">
                                {service.active ? 'Active' : 'Inactive'}
                              </Label>
                            </div>
                          </div>
                          
                          <div className="col-span-12 md:col-span-1 flex items-end justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add New Service */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Add New Service</h3>
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4 md:col-span-3">
                        <Label htmlFor="new-name">Service Name</Label>
                        <Input
                          id="new-name"
                          value={newService.name}
                          onChange={(e) => handleNewServiceChange('name', e.target.value)}
                          placeholder="e.g. Interior Deep Clean"
                        />
                      </div>
                      
                      <div className="col-span-3 md:col-span-2">
                        <Label htmlFor="new-price">Price (UGX)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                          <Input
                            id="new-price"
                            type="number"
                            value={newService.price || ''}
                            className="pl-9"
                            onChange={(e) => handleNewServiceChange('price', Number(e.target.value))}
                            placeholder="e.g. 45000"
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-4 md:col-span-5">
                        <Label htmlFor="new-desc">Description</Label>
                        <Input
                          id="new-desc"
                          value={newService.description}
                          onChange={(e) => handleNewServiceChange('description', e.target.value)}
                          placeholder="Brief description of the service"
                        />
                      </div>
                      
                      <div className="col-span-12 md:col-span-2 flex justify-end">
                        <Button onClick={handleAddService}>
                          <Plus size={18} className="mr-2" />
                          Add Service
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Service Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Services Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading skeleton for preview
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={`preview-loading-${index}`} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="h-5 bg-gray-200 w-32 animate-pulse rounded mb-1"></div>
                        <div className="h-4 bg-gray-200 w-48 animate-pulse rounded"></div>
                      </div>
                      <div className="h-6 bg-gray-200 w-20 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {services
                    .filter(service => service.active)
                    .map((service) => (
                      <div key={`preview-${service.id}`} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className="font-bold">{formatCurrency(service.price)}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Update your business details here. This information will appear on invoices and customer communications.
              </p>
              
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, index) => (
                      <div key={`business-loading-${index}`} className="space-y-2">
                        <div className="h-4 bg-gray-200 w-24 animate-pulse rounded"></div>
                        <div className="h-9 bg-gray-200 w-full animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input 
                        id="business-name" 
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Business Email</Label>
                      <Input 
                        id="business-email" 
                        type="email" 
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Business Phone</Label>
                      <Input 
                        id="business-phone" 
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="business-address">Business Address</Label>
                      <Input 
                        id="business-address" 
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveBusinessInfo}>Save Business Information</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure system-wide settings for your booking management system.
              </p>
              
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-200 w-32 animate-pulse rounded mb-4"></div>
                    
                    {Array(3).fill(0).map((_, index) => (
                      <div key={`setting-loading-${index}`} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="h-5 bg-gray-200 w-40 animate-pulse rounded mb-1"></div>
                          <div className="h-4 bg-gray-200 w-64 animate-pulse rounded"></div>
                        </div>
                        <div className="h-6 bg-gray-200 w-10 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Booking Settings</h3>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Allow Same-Day Bookings</h4>
                        <p className="text-sm text-gray-500">Enable customers to book services for the same day</p>
                      </div>
                      <Switch 
                        checked={bookingSettings.allowSameDayBookings}
                        onCheckedChange={(checked) => setBookingSettings({...bookingSettings, allowSameDayBookings: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Require Phone Verification</h4>
                        <p className="text-sm text-gray-500">Verify customer phone numbers before confirming bookings</p>
                      </div>
                      <Switch 
                        checked={bookingSettings.requirePhoneVerification}
                        onCheckedChange={(checked) => setBookingSettings({...bookingSettings, requirePhoneVerification: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <h4 className="font-medium">Send SMS Reminders</h4>
                        <p className="text-sm text-gray-500">Send SMS reminders to customers before their appointments</p>
                      </div>
                      <Switch 
                        checked={bookingSettings.sendSmsReminders}
                        onCheckedChange={(checked) => setBookingSettings({...bookingSettings, sendSmsReminders: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Service Time Slots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Daily Start Time</Label>
                        <Input 
                          id="start-time" 
                          type="time" 
                          value={timeSlots.startTime}
                          onChange={(e) => setTimeSlots({...timeSlots, startTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">Daily End Time</Label>
                        <Input 
                          id="end-time" 
                          type="time" 
                          value={timeSlots.endTime}
                          onChange={(e) => setTimeSlots({...timeSlots, endTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slot-duration">Time Slot Duration</Label>
                        <select 
                          id="slot-duration" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={timeSlots.slotDuration}
                          onChange={(e) => setTimeSlots({...timeSlots, slotDuration: parseInt(e.target.value)})}
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="90">1.5 hours</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveSystemSettings}>Save System Settings</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
