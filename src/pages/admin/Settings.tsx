
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsService, ServiceItem } from '@/services/settings';

const Settings = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    price: 0,
    description: '',
    active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const fetchedServices = await settingsService.getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || newService.price <= 0) {
      toast({
        title: "Error",
        description: "Service name and a positive price are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await settingsService.addService(newService);
      setNewService({
        name: '',
        price: 0,
        description: '',
        active: true
      });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Service added successfully."
      });
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      setIsLoading(true);
      await settingsService.updateService(editingService.id, editingService);
      setEditingService(null);
      toast({
        title: "Success",
        description: "Service updated successfully."
      });
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      setIsLoading(true);
      await settingsService.deleteService(id);
      toast({
        title: "Success",
        description: "Service deleted successfully."
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      setIsLoading(true);
      await settingsService.toggleServiceActive(id, active);
      toast({
        title: "Success",
        description: `Service ${active ? 'activated' : 'deactivated'} successfully.`
      });
      fetchServices();
    } catch (error) {
      console.error('Error toggling service active status:', error);
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Services Management</h2>
              <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                <Plus size={16} className="mr-2" /> Add Service
              </Button>
            </div>

            {showAddForm && (
              <Card className="p-4 border border-dashed mb-4">
                <h3 className="font-medium mb-2">Add New Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Service Name</Label>
                    <Input 
                      id="new-name" 
                      value={newService.name}
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                      placeholder="e.g. Basic Wash Package"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Price (UGX)</Label>
                    <Input 
                      id="new-price" 
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="new-description">Description</Label>
                    <Textarea 
                      id="new-description" 
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                      placeholder="Describe the service package..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="new-active"
                      checked={newService.active}
                      onCheckedChange={(checked) => setNewService({...newService, active: checked})}
                    />
                    <Label htmlFor="new-active">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddService} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Service'}
                  </Button>
                </div>
              </Card>
            )}

            {isLoading && !editingService && !showAddForm ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No services found. Add your first service package.
              </div>
            ) : (
              <div className="space-y-4">
                {services.map(service => (
                  <Card key={service.id} className={`p-4 ${!service.active && 'bg-gray-50'}`}>
                    {editingService?.id === service.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${service.id}`}>Service Name</Label>
                            <Input 
                              id={`edit-name-${service.id}`}
                              value={editingService.name}
                              onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-price-${service.id}`}>Price (UGX)</Label>
                            <Input 
                              id={`edit-price-${service.id}`}
                              type="number"
                              value={editingService.price}
                              onChange={(e) => setEditingService({...editingService, price: parseFloat(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label htmlFor={`edit-description-${service.id}`}>Description</Label>
                            <Textarea 
                              id={`edit-description-${service.id}`}
                              value={editingService.description || ''}
                              onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`edit-active-${service.id}`}
                              checked={editingService.active}
                              onCheckedChange={(checked) => setEditingService({...editingService, active: checked})}
                            />
                            <Label htmlFor={`edit-active-${service.id}`}>Active</Label>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setEditingService(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateService} disabled={isLoading}>
                              <Save size={16} className="mr-2" /> Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{service.name}</h3>
                            {!service.active && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description || 'No description'}</p>
                          <p className="font-medium mt-2">{formatPrice(service.price)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(service.id, !service.active)}
                          >
                            {service.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit size={16} className="mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} className="mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Company Information</h2>
            <p className="text-gray-500">Company settings coming soon.</p>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-500">System settings coming soon.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
