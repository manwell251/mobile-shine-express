
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Technician = Database['public']['Tables']['technicians']['Row'];
export type TechnicianInsert = Database['public']['Tables']['technicians']['Insert'];
export type TechnicianUpdate = Database['public']['Tables']['technicians']['Update'];

export const techniciansService = {
  async getAll(): Promise<Technician[]> {
    const { data, error } = await supabase
      .from('technicians')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getActive(): Promise<Technician[]> {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('active', true);

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Technician | null> {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(technician: TechnicianInsert): Promise<Technician> {
    const { data, error } = await supabase
      .from('technicians')
      .insert(technician)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, technician: TechnicianUpdate): Promise<Technician> {
    const { data, error } = await supabase
      .from('technicians')
      .update(technician)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('technicians')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
