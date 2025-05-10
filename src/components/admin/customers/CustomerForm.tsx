
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { customerService, CustomerInsert } from '@/services/customers';
import { useToast } from '@/hooks/use-toast';

interface CustomerFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  existingCustomer?: CustomerInsert;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  onCancel, 
  onSuccess,
  existingCustomer 
}) => {
  const [formData, setFormData] = useState<CustomerInsert>(existingCustomer || {
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Name and phone number are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (existingCustomer?.id) {
        await customerService.update(existingCustomer.id, formData);
        toast({
          title: "Success",
          description: "Customer updated successfully"
        });
      } else {
        await customerService.create(formData);
        toast({
          title: "Success",
          description: "New customer added successfully"
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onCancel();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save customer",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {existingCustomer ? 'Edit Customer' : 'Add New Customer'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input 
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : existingCustomer ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CustomerForm;
