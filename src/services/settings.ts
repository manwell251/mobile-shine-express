
import { supabase } from '@/lib/supabase';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  active: boolean;
}

export const settingsService = {
  async getServices(): Promise<ServiceItem[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },
  
  async addService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: service.name,
          price: service.price,
          description: service.description || '',
          active: service.active
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },
  
  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          name: service.name,
          price: service.price,
          description: service.description,
          active: service.active
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },
  
  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },
  
  async toggleServiceActive(id: string, active: boolean): Promise<ServiceItem> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ active })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error toggling service active status:', error);
      throw error;
    }
  },
};
