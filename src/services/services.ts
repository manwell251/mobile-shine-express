
import { supabase } from '@/lib/supabase';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const servicesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*');
      
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data as Service[];
  },
  
  async getActive() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true);
      
    if (error) {
      console.error('Error fetching active services:', error);
      throw error;
    }
    
    return data as Service[];
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching service with id ${id}:`, error);
      throw error;
    }
    
    return data as Service;
  },
  
  async create(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    return data;
  },
  
  async update(id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating service with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting service with id ${id}:`, error);
      throw error;
    }
  },
  
  async toggleActive(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('services')
      .update({ active: isActive })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error toggling active state for service with id ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};
