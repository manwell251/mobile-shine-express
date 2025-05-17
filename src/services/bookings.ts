import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { format } from 'date-fns';
import { BookingStatus, BookingInsert, BookingUpdate } from '@/types/booking';

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export interface BookingWithDetails {
  id: string;
  booking_reference: string;
  customerName: string;
  phone: string;
  services: string[];
  serviceIds?: string[];
  date: string;
  time: string;
  status: BookingStatus;
  totalAmount: string;
  location: string;
  notes?: string | null;
  customer_id?: string | null;
  vehicle?: {
    make: string;
    model: string;
    year: string;
  };
  email?: string;
}

function formatBookingData(booking: any, services: string[], serviceIds: string[] = []): BookingWithDetails {
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
    email: booking.customers?.email,
    services: services,
    serviceIds: serviceIds,
    date: format(new Date(booking.date), 'yyyy-MM-dd'),
    time: booking.time,
    status: booking.status as BookingStatus,
    totalAmount: formattedAmount,
    location: booking.location,
    notes: booking.notes || undefined,
    customer_id: booking.customer_id || undefined,
    vehicle: {
      make: "Not specified",
      model: "Not specified",
      year: "Not specified"
    }
  };
}

async function fetchBookingServices(bookingId: string): Promise<{ names: string[], ids: string[] }> {
  const { data: serviceData, error } = await supabase
    .from('booking_services')
    .select('*, services(id, name)')
    .eq('booking_id', bookingId);

  if (error) {
    console.error('Error fetching booking services:', error);
    return { names: [], ids: [] };
  }

  const names = serviceData?.map(item => item.services?.name || '') || [];
  const ids = serviceData?.map(item => item.services?.id || '') || [];

  return { names, ids };
}

export const bookingsService = {
  async getAvailableServices() {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, description')
      .eq('active', true);
      
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return { data };
  },
  
  async getAll(): Promise<BookingWithDetails[]> {
    try {
      // Fetch bookings with customer details
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          )
        `);

      if (error) throw error;

      if (!bookings || bookings.length === 0) {
        return [];
      }

      // For each booking, fetch the associated services
      const bookingsWithServices = await Promise.all(
        bookings.map(async (booking) => {
          const { names, ids } = await fetchBookingServices(booking.id);
          return formatBookingData(booking, names, ids);
        })
      );

      return bookingsWithServices;
    } catch (error) {
      console.error('Error in bookingsService.getAll:', error);
      return [];
    }
  },

  async getByStatus(status: string): Promise<BookingWithDetails[]> {
    try {
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
            phone,
            email
          )
        `)
        .eq('status', status);

      if (error) throw error;

      if (!bookings || bookings.length === 0) {
        return [];
      }

      // For each booking, fetch the associated services
      const bookingsWithServices = await Promise.all(
        bookings.map(async (booking) => {
          const { names, ids } = await fetchBookingServices(booking.id);
          return formatBookingData(booking, names, ids);
        })
      );

      return bookingsWithServices;
    } catch (error) {
      console.error('Error in bookingsService.getByStatus:', error);
      return [];
    }
  },

  async getByDateRange(startDate: string, endDate: string): Promise<BookingWithDetails[]> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          )
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      // Process bookings the same way as in getAll
      const bookingsWithServices = await Promise.all(
        bookings.map(async (booking) => {
          const { names, ids } = await fetchBookingServices(booking.id);
          return formatBookingData(booking, names, ids);
        })
      );

      return bookingsWithServices;
    } catch (error) {
      console.error('Error in bookingsService.getByDateRange:', error);
      return [];
    }
  },

  async getById(id: string): Promise<BookingWithDetails | null> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!booking) return null;

      const { names, ids } = await fetchBookingServices(booking.id);
      return formatBookingData(booking, names, ids);
    } catch (error) {
      console.error('Error in bookingsService.getById:', error);
      return null;
    }
  },

  async create(booking: BookingInsert, selectedServices: string[]): Promise<BookingRow> {
    try {
      // Ensure booking reference is set
      if (!booking.booking_reference) {
        const timestamp = new Date().getTime().toString().slice(-6);
        booking.booking_reference = `BK${timestamp}`;
      }

      // Insert the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Failed to create booking");

      // For each selected service, create a booking_services entry
      for (const serviceId of selectedServices) {
        // Get service price
        const { data: service, error: serviceError } = await supabase
          .from('services')
          .select('price')
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;
        if (!service) throw new Error(`Service with id ${serviceId} not found`);

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

      // If booking status is Scheduled, auto-create a job
      if (booking.status === 'Scheduled') {
        try {
          const { jobsService } = await import('@/services/jobs');
          await jobsService.createFromBooking(data.id);
        } catch (jobError) {
          console.error('Error creating job for booking:', jobError);
          // We don't want to fail the booking creation if job creation fails
        }
      }

      return data;
    } catch (error) {
      console.error('Error in bookingsService.create:', error);
      throw error;
    }
  },

  async update(id: string, booking: BookingUpdate, selectedServices?: string[]): Promise<BookingRow> {
    try {
      // Update the booking
      const { data, error } = await supabase
        .from('bookings')
        .update(booking)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Failed to update booking");

      // If services were provided, update the booking_services
      if (selectedServices) {
        // First delete all existing booking_services
        const { error: deleteError } = await supabase
          .from('booking_services')
          .delete()
          .eq('booking_id', id);

        if (deleteError) throw deleteError;

        // Then insert new ones
        for (const serviceId of selectedServices) {
          // Get service price
          const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('price')
            .eq('id', serviceId)
            .single();

          if (serviceError) throw serviceError;
          if (!service) throw new Error(`Service with id ${serviceId} not found`);

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

        // Update total amount
        const totalAmount = selectedServices.reduce(async (promisedSum, serviceId) => {
          const sum = await promisedSum;
          const { data: service } = await supabase
            .from('services')
            .select('price')
            .eq('id', serviceId)
            .single();

          return sum + (service?.price || 0);
        }, Promise.resolve(0));

        await supabase
          .from('bookings')
          .update({ total_amount: await totalAmount })
          .eq('id', id);
      }

      // If booking status is Scheduled and there's no job for it, auto-create one
      if (booking.status === 'Scheduled') {
        try {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('booking_id', id);
            
          if (count === 0) {
            const { jobsService } = await import('@/services/jobs');
            await jobsService.createFromBooking(id);
          }
        } catch (jobError) {
          console.error('Error checking/creating job for booking:', jobError);
          // We don't want to fail the booking update if job creation fails
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in bookingsService.update:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: BookingStatus): Promise<BookingRow> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Failed to update booking status");
      
      // If status is changed to Scheduled, make sure there's a job
      if (status === 'Scheduled') {
        try {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('booking_id', id);
            
          if (count === 0) {
            const { jobsService } = await import('@/services/jobs');
            await jobsService.createFromBooking(id);
          }
        } catch (jobError) {
          console.error('Error checking/creating job after status change:', jobError);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in bookingsService.updateStatus:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      // Check if there are related jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('booking_id', id);
        
      // Delete any related jobs first
      if (jobs && jobs.length > 0) {
        for (const job of jobs) {
          // Delete related job services
          await supabase
            .from('job_services')
            .delete()
            .eq('job_id', job.id);
            
          // Delete the job
          await supabase
            .from('jobs')
            .delete()
            .eq('id', job.id);
        }
      }
    
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
    } catch (error) {
      console.error('Error in bookingsService.delete:', error);
      throw error;
    }
  },

  async search(searchTerm: string): Promise<BookingWithDetails[]> {
    try {
      // Search in bookings and related customer data
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          )
        `)
        .or(`booking_reference.ilike.%${searchTerm}%,customers.name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,customers.phone.ilike.%${searchTerm}%`);

      if (error) throw error;

      if (!bookings || bookings.length === 0) {
        return [];
      }

      // Process bookings the same way as in getAll
      const bookingsWithServices = await Promise.all(
        bookings.map(async (booking) => {
          const { names, ids } = await fetchBookingServices(booking.id);
          return formatBookingData(booking, names, ids);
        })
      );

      return bookingsWithServices;
    } catch (error) {
      console.error('Error in bookingsService.search:', error);
      return [];
    }
  },

  async getBookingsByDate(date: string): Promise<BookingWithDetails[]> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          )
        `)
        .eq('date', date);

      if (error) throw error;

      // Process bookings the same way as in getAll
      const bookingsWithServices = await Promise.all(
        bookings.map(async (booking) => {
          const { names, ids } = await fetchBookingServices(booking.id);
          return formatBookingData(booking, names, ids);
        })
      );

      return bookingsWithServices;
    } catch (error) {
      console.error('Error in bookingsService.getBookingsByDate:', error);
      return [];
    }
  }
};
