
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export interface CustomerWithStats extends Customer {
  bookings: number;
  totalSpent: string;
  lastBooking: string;
}

export const customersService = {
  async getAll(): Promise<CustomerWithStats[]> {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*');

    if (error) throw error;

    // Get booking stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        // Get count of bookings
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('customer_id', customer.id);

        if (bookingsError) throw bookingsError;

        // Get sum of booking amounts
        const { data: bookings, error: amountError } = await supabase
          .from('bookings')
          .select('total_amount, date')
          .eq('customer_id', customer.id)
          .order('date', { ascending: false });

        if (amountError) throw amountError;

        const totalSpent = bookings.reduce((sum, booking) => sum + booking.total_amount, 0);
        const lastBooking = bookings.length > 0 ? bookings[0].date : null;

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
      })
    );

    return customersWithStats;
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
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
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);

    if (error) throw error;

    // Get booking stats for each customer (same as in getAll)
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
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
      })
    );

    return customersWithStats;
  }
};
