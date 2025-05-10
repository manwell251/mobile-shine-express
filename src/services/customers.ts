
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export interface CustomerWithStats extends Customer {
  bookings: number;
  totalSpent: string;
  lastBooking: string;
}

export const customerService = {
  async getAll(): Promise<CustomerWithStats[]> {
    try {
      const { data: customers, error } = await supabase
        .from('customers')
        .select('*');

      if (error) throw error;

      if (!customers || customers.length === 0) {
        return [];
      }

      // Get booking stats for each customer
      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          try {
            // Get count of bookings
            const { count: bookingsCount } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('customer_id', customer.id);

            // Get sum of booking amounts
            const { data: bookings } = await supabase
              .from('bookings')
              .select('total_amount, date')
              .eq('customer_id', customer.id)
              .order('date', { ascending: false });

            const totalSpent = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
            const lastBooking = bookings && bookings.length > 0 ? bookings[0].date : null;

            // Format total spent as UGX currency
            const formattedTotal = new Intl.NumberFormat('en-UG', {
              style: 'currency',
              currency: 'UGX',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(totalSpent);

            return {
              ...customer,
              bookings: bookingsCount ?? 0,
              totalSpent: formattedTotal,
              lastBooking: lastBooking || ''
            };
          } catch (error) {
            console.error(`Error processing stats for customer ${customer.id}:`, error);
            return {
              ...customer,
              bookings: 0,
              totalSpent: 'UGX 0',
              lastBooking: ''
            };
          }
        })
      );

      return customersWithStats;
    } catch (error) {
      console.error('Error in customerService.getAll:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in customerService.getById(${id}):`, error);
      return null;
    }
  },

  async create(customer: CustomerInsert): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, customer: CustomerUpdate): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(searchTerm: string): Promise<CustomerWithStats[]> {
    try {
      const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);

      if (error) throw error;

      if (!customers || customers.length === 0) {
        return [];
      }

      // Get booking stats for each customer (same as in getAll)
      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          try {
            const { count: bookingsCount } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('customer_id', customer.id);

            const { data: bookings } = await supabase
              .from('bookings')
              .select('total_amount, date')
              .eq('customer_id', customer.id)
              .order('date', { ascending: false });

            const totalSpent = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
            const lastBooking = bookings && bookings.length > 0 ? bookings[0].date : null;

            const formattedTotal = new Intl.NumberFormat('en-UG', {
              style: 'currency',
              currency: 'UGX',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(totalSpent);

            return {
              ...customer,
              bookings: bookingsCount ?? 0,
              totalSpent: formattedTotal,
              lastBooking: lastBooking || ''
            };
          } catch (error) {
            console.error(`Error processing stats for customer ${customer.id}:`, error);
            return {
              ...customer,
              bookings: 0,
              totalSpent: 'UGX 0',
              lastBooking: ''
            };
          }
        })
      );

      return customersWithStats;
    } catch (error) {
      console.error('Error in customerService.search:', error);
      return [];
    }
  }
};
