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
  technician_id?: string;
  location: string;
  notes?: string;
  isFromBooking?: boolean;
}

export const jobsService = {
  async getAll(): Promise<JobWithDetails[]> {
    // First get actual jobs
    const { data: jobs, error: jobsError } = await supabase
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

    if (jobsError) throw jobsError;

    // Get InProgress and Completed bookings that don't have jobs yet
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name
        )
      `)
      .in('status', ['InProgress', 'Completed']);

    if (bookingsError) throw bookingsError;

    // Process actual jobs
    const processedJobs = await Promise.all(
      (jobs || []).map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference || 'No Reference',
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            technician_id: job.technician_id,
            location: 'Unknown',
            notes: job.notes || undefined,
            isFromBooking: false
          };
        }

        // Get services for this booking
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', job.booking_id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference || 'No Reference',
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          technician_id: job.technician_id,
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined,
          isFromBooking: false
        };
      })
    );

    // Process bookings as jobs (for InProgress and Completed bookings without actual jobs)
    const existingJobBookingIds = new Set((jobs || []).map(job => job.booking_id).filter(Boolean));
    const bookingsAsJobs = await Promise.all(
      (bookings || [])
        .filter(booking => !existingJobBookingIds.has(booking.id))
        .map(async (booking) => {
          // Get services for this booking
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
          }).format(booking.total_amount || 0);

          return {
            id: `booking-${booking.id}`,
            job_reference: booking.booking_reference,
            bookingId: booking.booking_reference,
            customerName: booking.customers?.name || 'Unknown',
            services: services,
            date: booking.date ? format(new Date(booking.date), 'yyyy-MM-dd') : 'No Date',
            status: booking.status as any,
            amount: formattedAmount,
            technician: 'Unassigned',
            technician_id: undefined,
            location: booking.location || 'Unknown',
            notes: booking.notes || undefined,
            isFromBooking: true
          };
        })
    );

    return [...processedJobs, ...bookingsAsJobs];
  },

  async getByStatus(status: string): Promise<JobWithDetails[]> {
    if (status === 'all') {
      return this.getAll();
    }

    // Get actual jobs with the status
    const { data: jobs, error: jobsError } = await supabase
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

    if (jobsError) throw jobsError;

    // Get bookings with the status if it's InProgress or Completed
    let bookings: any[] = [];
    if (status === 'InProgress' || status === 'Completed') {
      const { data: bookingData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            name
          )
        `)
        .eq('status', status);

      if (bookingsError) throw bookingsError;
      bookings = bookingData || [];
    }

    // Process actual jobs
    const processedJobs = await Promise.all(
      (jobs || []).map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference || 'No Reference',
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            technician_id: job.technician_id,
            location: 'Unknown',
            notes: job.notes || undefined,
            isFromBooking: false
          };
        }

        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', job.booking_id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference || 'No Reference',
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          technician_id: job.technician_id,
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined,
          isFromBooking: false
        };
      })
    );

    // Process bookings as jobs (for InProgress and Completed bookings without actual jobs)
    const existingJobBookingIds = new Set((jobs || []).map(job => job.booking_id).filter(Boolean));
    const bookingsAsJobs = await Promise.all(
      bookings
        .filter(booking => !existingJobBookingIds.has(booking.id))
        .map(async (booking) => {
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
          }).format(booking.total_amount || 0);

          return {
            id: `booking-${booking.id}`,
            job_reference: booking.booking_reference,
            bookingId: booking.booking_reference,
            customerName: booking.customers?.name || 'Unknown',
            services: services,
            date: booking.date ? format(new Date(booking.date), 'yyyy-MM-dd') : 'No Date',
            status: booking.status as any,
            amount: formattedAmount,
            technician: 'Unassigned',
            technician_id: undefined,
            location: booking.location || 'Unknown',
            notes: booking.notes || undefined,
            isFromBooking: true
          };
        })
    );

    return [...processedJobs, ...bookingsAsJobs];
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

    // Get services for this booking
    let serviceNames: string[] = [];
    if (job.booking_id) {
      const { data: serviceData } = await supabase
        .from('booking_services')
        .select('*, services(name)')
        .eq('booking_id', job.booking_id);

      serviceNames = serviceData?.map(item => item.services?.name || '') || [];
    }

    const formattedAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(job.bookings?.total_amount || 0);

    return {
      id: job.id,
      job_reference: job.job_reference || 'No Reference',
      bookingId: job.bookings?.booking_reference || 'No Booking',
      customerName: job.bookings?.customers?.name || 'Unknown',
      services: serviceNames,
      date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
      status: job.status as any,
      amount: formattedAmount,
      technician: job.technicians?.name || 'Unassigned',
      technician_id: job.technician_id,
      location: job.bookings?.location || 'Unknown',
      notes: job.notes || undefined,
      isFromBooking: false
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
        status: booking.status as any,
        notes: booking.notes || null,
        job_reference: `J${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` // Temporary reference
      };
      
      const { data: newJob, error: jobError } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
        
      if (jobError) throw jobError;
      if (!newJob) throw new Error('Failed to create job');
      
      return newJob;
    } catch (error) {
      console.error('Error creating job from booking:', error);
      throw error;
    }
  },
  
  async autoCreateJobsFromScheduledBookings(): Promise<number> {
    try {
      // Get InProgress and Completed bookings that don't have jobs
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, date')
        .in('status', ['InProgress', 'Completed'])
        .order('date', { ascending: true });
        
      if (bookingsError) throw bookingsError;
      
      if (!bookings || bookings.length === 0) return 0;
      
      // Check which bookings don't have jobs yet
      let jobsCreated = 0;
      
      for (const booking of bookings) {
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

  async updateBookingTechnician(bookingId: string, technicianId: string | null): Promise<void> {
    // For bookings shown as jobs, we need to update the booking's technician assignment
    // First check if a job exists for this booking
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existingJob) {
      // Update the existing job
      await this.update(existingJob.id, { technician_id: technicianId });
    } else {
      // Create a new job for this booking with the technician assigned
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (booking) {
        await this.createFromBooking(bookingId, technicianId || undefined);
      }
    }
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

    // Also search in bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (
          name
        )
      `)
      .in('status', ['InProgress', 'Completed'])
      .or(`
        booking_reference.ilike.%${searchTerm}%,
        customers.name.ilike.%${searchTerm}%
      `);

    if (bookingsError) throw bookingsError;

    // Process jobs and bookings the same way as in getAll
    const processedJobs = await Promise.all(
      (jobs || []).map(async (job) => {
        if (!job.booking_id) {
          return {
            id: job.id,
            job_reference: job.job_reference || 'No Reference',
            bookingId: 'No Booking',
            customerName: 'Unknown',
            services: [],
            date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
            status: job.status as any,
            amount: 'UGX 0',
            technician: job.technicians?.name || 'Unassigned',
            technician_id: job.technician_id,
            location: 'Unknown',
            notes: job.notes || undefined,
            isFromBooking: false
          };
        }

        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', job.booking_id);

        const services = serviceData?.map(item => item.services?.name || '') || [];

        const formattedAmount = new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(job.bookings?.total_amount || 0);

        return {
          id: job.id,
          job_reference: job.job_reference || 'No Reference',
          bookingId: job.bookings?.booking_reference || 'No Booking',
          customerName: job.bookings?.customers?.name || 'Unknown',
          services: services,
          date: job.date ? format(new Date(job.date), 'yyyy-MM-dd') : 'No Date',
          status: job.status as any,
          amount: formattedAmount,
          technician: job.technicians?.name || 'Unassigned',
          technician_id: job.technician_id,
          location: job.bookings?.location || 'Unknown',
          notes: job.notes || undefined,
          isFromBooking: false
        };
      })
    );

    // Process bookings as jobs
    const existingJobBookingIds = new Set((jobs || []).map(job => job.booking_id).filter(Boolean));
    const bookingsAsJobs = await Promise.all(
      (bookings || [])
        .filter(booking => !existingJobBookingIds.has(booking.id))
        .map(async (booking) => {
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
          }).format(booking.total_amount || 0);

          return {
            id: `booking-${booking.id}`,
            job_reference: booking.booking_reference,
            bookingId: booking.booking_reference,
            customerName: booking.customers?.name || 'Unknown',
            services: services,
            date: booking.date ? format(new Date(booking.date), 'yyyy-MM-dd') : 'No Date',
            status: booking.status as any,
            amount: formattedAmount,
            technician: 'Unassigned',
            technician_id: undefined,
            location: booking.location || 'Unknown',
            notes: booking.notes || undefined,
            isFromBooking: true
          };
        })
    );

    return [...processedJobs, ...bookingsAsJobs];
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
