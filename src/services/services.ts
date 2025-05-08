
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export const servicesService = {
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getActive(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true);

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(service: ServiceInsert): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, service: ServiceUpdate): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleActive(id: string, active: boolean): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
