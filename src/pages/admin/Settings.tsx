
import React, { useState } from 'react';
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

interface ServiceSettings {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Mock initial services data
  const initialServices: ServiceSettings[] = [
    { id: 'basic', name: 'Basic Wash Package', price: 25000, description: 'Exterior wash with tire and wheel cleaning', active: true },
    { id: 'full', name: 'Full-Service Wash Package', price: 35000, description: 'Basic wash plus interior cleaning', active: true },
    { id: 'premium', name: 'Premium Detail Package', price: 50000, description: 'Full-service wash with wax application', active: true },
    { id: 'headlight', name: 'Headlight Restoration', price: 20000, description: 'Restore and polish cloudy headlights', active: true },
    { id: 'complete', name: 'Complete Detailing Package', price: 150000, description: 'Full interior & exterior detail with engine bay cleaning', active: true }
  ];

  const [services, setServices] = useState<ServiceSettings[]>(initialServices);
  const [newService, setNewService] = useState<Partial<ServiceSettings>>({
    name: '',
    price: 0,
    description: '',
    active: true
  });

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

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and price for the new service.",
        variant: "destructive"
      });
      return;
    }

    const id = newService.name.toLowerCase().replace(/\s+/g, '-');
    
    setServices(prev => [...prev, { 
      ...newService as ServiceSettings, 
      id 
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
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    
    toast({
      title: "Service Deleted",
      description: "The service has been removed from the system."
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    console.log("Saving services settings:", services);
    
    toast({
      title: "Settings Saved",
      description: "Your service settings have been updated successfully."
    });
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
                <Button onClick={handleSaveSettings}>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
          {/* Service Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Services Preview</CardTitle>
            </CardHeader>
            <CardContent>
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
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" defaultValue="Klin Ride Mobile Car Detailing" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-email">Business Email</Label>
                    <Input id="business-email" type="email" defaultValue="klinride25@gmail.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Business Phone</Label>
                    <Input id="business-phone" defaultValue="+256 776 041 056" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Business Address</Label>
                    <Input id="business-address" defaultValue="L2B Butenga Estate, Kira-Kasangati Rd" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Business Information</Button>
                </div>
              </div>
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
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Booking Settings</h3>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h4 className="font-medium">Allow Same-Day Bookings</h4>
                      <p className="text-sm text-gray-500">Enable customers to book services for the same day</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h4 className="font-medium">Require Phone Verification</h4>
                      <p className="text-sm text-gray-500">Verify customer phone numbers before confirming bookings</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h4 className="font-medium">Send SMS Reminders</h4>
                      <p className="text-sm text-gray-500">Send SMS reminders to customers before their appointments</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Time Slots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Daily Start Time</Label>
                      <Input id="start-time" type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Daily End Time</Label>
                      <Input id="end-time" type="time" defaultValue="18:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slot-duration">Time Slot Duration</Label>
                      <select id="slot-duration" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="30">30 minutes</option>
                        <option value="60" selected>1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save System Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
