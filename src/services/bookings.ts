import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { format } from 'date-fns';

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export interface BookingWithDetails {
  id: string;
  booking_reference: string;
  customerName: string;
  phone: string;
  services: string[];
  date: string;
  time: string;
  status: string;
  totalAmount: string;
  location: string;
  notes?: string;
  customer_id?: string;
}

export const bookingsService = {
  async getAll(): Promise<BookingWithDetails[]> {
    // Fetch bookings with customer details
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `);

    if (error) throw error;

    // For each booking, fetch the associated services
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];
        
        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(booking.total_amount);

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          phone: booking.customers?.phone || 'No phone',
          services: services,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status,
          totalAmount: formattedAmount,
          location: booking.location,
          notes: booking.notes || undefined,
          customer_id: booking.customer_id || undefined
        };
      })
    );

    return bookingsWithServices;
  },

  async getByStatus(status: string): Promise<BookingWithDetails[]> {
    // If status is 'all', fetch all bookings
    if (status === 'all') {
      return this.getAll();
    }

    // Otherwise, filter by status
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .eq('status', status);

    if (error) throw error;

    // For each booking, fetch the associated services
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];
        
        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(booking.total_amount);

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          phone: booking.customers?.phone || 'No phone',
          services: services,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status,
          totalAmount: formattedAmount,
          location: booking.location,
          notes: booking.notes || undefined,
          customer_id: booking.customer_id || undefined
        };
      })
    );

    return bookingsWithServices;
  },

  async getByDateRange(startDate: string, endDate: string): Promise<BookingWithDetails[]> {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    // Process bookings the same way as in getAll
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];
        
        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(booking.total_amount);

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          phone: booking.customers?.phone || 'No phone',
          services: services,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status,
          totalAmount: formattedAmount,
          location: booking.location,
          notes: booking.notes || undefined,
          customer_id: booking.customer_id || undefined
        };
      })
    );

    return bookingsWithServices;
  },

  async getById(id: string): Promise<BookingWithDetails | null> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!booking) return null;

    const { data: serviceData } = await supabase
      .from('booking_services')
      .select('*, services(name)')
      .eq('booking_id', booking.id);

    const services = serviceData?.map(item => item.services?.name || '') || [];
    
    const formattedAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(booking.total_amount);

    return {
      id: booking.id,
      booking_reference: booking.booking_reference,
      customerName: booking.customers?.name || 'Unknown',
      phone: booking.customers?.phone || 'No phone',
      services: services,
      date: format(new Date(booking.date), 'yyyy-MM-dd'),
      time: booking.time,
      status: booking.status,
      totalAmount: formattedAmount,
      location: booking.location,
      notes: booking.notes || undefined,
      customer_id: booking.customer_id || undefined
    };
  },

  async create(booking: BookingInsert, selectedServices: string[]): Promise<BookingRow> {
    // Start a transaction
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;

    // For each selected service, create a booking_services entry
    for (const serviceId of selectedServices) {
      // Get service price
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price')
        .eq('id', serviceId)
        .single();

      if (serviceError) throw serviceError;

      // Create booking_service entry
      const { error: bookingServiceError } = await supabase
        .from('booking_services')
        .insert({
          booking_id: data.id,
          service_id: serviceId,
          quantity: 1,  // Default quantity
          price_at_booking: service.price
        });

      if (bookingServiceError) throw bookingServiceError;
    }

    return data;
  },

  async update(id: string, booking: BookingUpdate, selectedServices?: string[]): Promise<BookingRow> {
    // Update the booking
    const { data, error } = await supabase
      .from('bookings')
      .update(booking)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // If services were provided, update the booking_services
    if (selectedServices) {
      // First delete all existing booking_services
      await supabase
        .from('booking_services')
        .delete()
        .eq('booking_id', id);

      // Then insert new ones
      for (const serviceId of selectedServices) {
        // Get service price
        const { data: service, error: serviceError } = await supabase
          .from('services')
          .select('price')
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;

        // Create booking_service entry
        const { error: bookingServiceError } = await supabase
          .from('booking_services')
          .insert({
            booking_id: id,
            service_id: serviceId,
            quantity: 1,  // Default quantity
            price_at_booking: service.price
          });

        if (bookingServiceError) throw bookingServiceError;
      }
    }

    return data;
  },

  async updateStatus(id: string, status: string): Promise<BookingRow> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    // Delete booking_services first (due to foreign key constraints)
    const { error: bookingServicesError } = await supabase
      .from('booking_services')
      .delete()
      .eq('booking_id', id);

    if (bookingServicesError) throw bookingServicesError;

    // Then delete the booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(searchTerm: string): Promise<BookingWithDetails[]> {
    // Search in bookings and related customer data
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .or(`booking_reference.ilike.%${searchTerm}%,customers.name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);

    if (error) throw error;

    // Process bookings the same way as in getAll
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];
        
        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(booking.total_amount);

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          phone: booking.customers?.phone || 'No phone',
          services: services,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status,
          totalAmount: formattedAmount,
          location: booking.location,
          notes: booking.notes || undefined,
          customer_id: booking.customer_id || undefined
        };
      })
    );

    return bookingsWithServices;
  },

  async getBookingsByDate(date: string): Promise<BookingWithDetails[]> {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .eq('date', date);

    if (error) throw error;

    // Process bookings the same way as in getAll
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];
        
        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(booking.total_amount);

        return {
          id: booking.id,
          booking_reference: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          phone: booking.customers?.phone || 'No phone',
          services: services,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status,
          totalAmount: formattedAmount,
          location: booking.location,
          notes: booking.notes || undefined,
          customer_id: booking.customer_id || undefined
        };
      })
    );

    return bookingsWithServices;
  }
};
