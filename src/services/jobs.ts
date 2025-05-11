import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { format } from 'date-fns';

export type JobRow = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export interface JobWithDetails {
  id: string;
  job_reference: string;
  bookingId: string;
  customerName: string;
  services: string[];
  date: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  amount: string;
  technician: string;
  location: string;
  notes?: string;
}

export const jobsService = {
  async getAll(): Promise<JobWithDetails[]> {
    // Fetch jobs with related booking, technician, and customer info
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bookings (
          booking_reference,
          customer_id,
          location,
          total_amount,
          customers (
            name
          )
        ),
        technicians (
          name
        )
      `);

    if (error) throw error;

    // For each job, fetch the associated services through booking_services
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference,
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: format(new Date(job.date), 'yyyy-MM-dd'),
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            location: 'Unknown',
            notes: job.notes || undefined
          };
        }

        const { data: serviceData } = await supabase
          .from('job_services')
          .select('*, services(name)')
          .eq('job_id', job.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference,
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: format(new Date(job.date), 'yyyy-MM-dd'),
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined
        };
      })
    );

    return jobsWithDetails;
  },

  async getByStatus(status: string): Promise<JobWithDetails[]> {
    // If status is 'all', fetch all jobs
    if (status === 'all') {
      return this.getAll();
    }

    // Otherwise, filter by status
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bookings (
          booking_reference,
          customer_id,
          location,
          total_amount,
          customers (
            name
          )
        ),
        technicians (
          name
        )
      `)
      .eq('status', status);

    if (error) throw error;

    // Process each job the same way as in getAll
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference,
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: format(new Date(job.date), 'yyyy-MM-dd'),
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            location: 'Unknown',
            notes: job.notes || undefined
          };
        }

        const { data: serviceData } = await supabase
          .from('job_services')
          .select('*, services(name)')
          .eq('job_id', job.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference,
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: format(new Date(job.date), 'yyyy-MM-dd'),
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined
        };
      })
    );

    return jobsWithDetails;
  },

  async getById(id: string): Promise<JobWithDetails | null> {
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bookings (
          booking_reference,
          customer_id,
          location,
          total_amount,
          customers (
            name
          )
        ),
        technicians (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!job) return null;

    // Fetch services for this job's booking
    let serviceNames: string[] = [];
    if (job.booking_id) {
      const { data: serviceData } = await supabase
        .from('job_services')
        .select('*, services(name)')
        .eq('job_id', job.id);

      const services = serviceData?.map(item => item.services?.name || '') || [];

      serviceNames = services;
    }

    const formattedAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(job.bookings?.total_amount || 0);

    return {
      id: job.id,
      job_reference: job.job_reference,
      bookingId: job.bookings?.booking_reference || 'No Booking',
      customerName: job.bookings?.customers?.name || 'Unknown',
      services: serviceNames,
      date: format(new Date(job.date), 'yyyy-MM-dd'),
      status: job.status as any,
      amount: formattedAmount,
      technician: job.technicians?.name || 'Unassigned',
      location: job.bookings?.location || 'Unknown',
      notes: job.notes || undefined
    };
  },

  async create(job: JobInsert): Promise<JobRow> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createFromBooking(bookingId: string, technicianId?: string): Promise<JobRow> {
    try {
      // First get the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();
        
      if (bookingError) throw bookingError;
      if (!booking) throw new Error('Booking not found');

      // Format the date string to a valid date format
      const jobDate = new Date(booking.date);
      
      // Create job
      const job: JobInsert = {
        booking_id: bookingId,
        date: format(jobDate, 'yyyy-MM-dd'),
        technician_id: technicianId || null,
        status: 'Scheduled',
        notes: booking.notes || null,
      };
      
      const { data: newJob, error: jobError } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
        
      if (jobError) throw jobError;
      if (!newJob) throw new Error('Failed to create job');
      
      // Add services to job_services
      const { data: bookingServices, error: servicesError } = await supabase
        .from('booking_services')
        .select('service_id, price_at_booking, quantity')
        .eq('booking_id', bookingId);
        
      if (servicesError) throw servicesError;
      
      if (bookingServices && bookingServices.length > 0) {
        const jobServices = bookingServices.map(service => ({
          job_id: newJob.id,
          service_id: service.service_id,
          price: service.price_at_booking,
          quantity: service.quantity || 1
        }));
        
        const { error: insertError } = await supabase
          .from('job_services')
          .insert(jobServices);
          
        if (insertError) throw insertError;
      }
      
      return newJob;
    } catch (error) {
      console.error('Error creating job from booking:', error);
      throw error;
    }
  },
  
  async autoCreateJobsFromScheduledBookings(): Promise<number> {
    try {
      // Get scheduled bookings that don't have jobs
      const { data: scheduledBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          date
        `)
        .eq('status', 'Scheduled')
        .order('date', { ascending: true });
        
      if (bookingsError) throw bookingsError;
      
      if (!scheduledBookings || scheduledBookings.length === 0) return 0;
      
      // Check which bookings don't have jobs yet
      let jobsCreated = 0;
      
      for (const booking of scheduledBookings) {
        // Check if job exists for this booking
        const { count, error: countError } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('booking_id', booking.id);
          
        if (countError) throw countError;
        
        // If no job exists, create one
        if (count === 0) {
          await this.createFromBooking(booking.id);
          jobsCreated++;
        }
      }
      
      return jobsCreated;
    } catch (error) {
      console.error('Error auto-creating jobs:', error);
      throw error;
    }
  },

  async update(id: string, job: JobUpdate): Promise<JobRow> {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string): Promise<JobRow> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(searchTerm: string): Promise<JobWithDetails[]> {
    // Search in jobs, bookings, and technicians
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bookings (
          booking_reference,
          customer_id,
          location,
          total_amount,
          customers (
            name
          )
        ),
        technicians (
          name
        )
      `)
      .or(`
        job_reference.ilike.%${searchTerm}%,
        bookings.booking_reference.ilike.%${searchTerm}%,
        bookings.customers.name.ilike.%${searchTerm}%,
        technicians.name.ilike.%${searchTerm}%
      `);

    if (error) throw error;

    // Process jobs the same way as in getAll
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference,
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: format(new Date(job.date), 'yyyy-MM-dd'),
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            location: 'Unknown',
            notes: job.notes || undefined
          };
        }

        const { data: serviceData } = await supabase
          .from('job_services')
          .select('*, services(name)')
          .eq('job_id', job.id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference,
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: format(new Date(job.date), 'yyyy-MM-dd'),
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined
        };
      })
    );

    return jobsWithDetails;
  },

  async generateInvoice(jobId: string): Promise<string> {
    // Get the job
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bookings (
          customer_id,
          total_amount
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    if (!job || !job.bookings) throw new Error('Job or booking not found');

    // Create invoice
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);  // Due in 1 week

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        job_id: jobId,
        customer_id: job.bookings.customer_id,
        issue_date: format(now, 'yyyy-MM-dd'),
        due_date: format(dueDate, 'yyyy-MM-dd'),
        amount: job.bookings.total_amount,
        tax_amount: 0,  // No tax for now
        total_amount: job.bookings.total_amount,
        payment_status: 'Pending'
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;
    return invoice.id;
  }
};
