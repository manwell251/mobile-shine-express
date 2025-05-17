
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type DashboardStats = {
  bookingsToday: number;
  pendingJobs: number;
  revenueMonth: string;
  totalCustomers: number;
};

export type UpcomingBooking = {
  id: string;
  customerName: string;
  service: string;
  time: string;
  status: string;
};

async function mapBookingForDashboard(booking: any) {
  try {
    const { data: serviceData } = await supabase
      .from('booking_services')
      .select('*, services(name)')
      .eq('booking_id', booking.id);
    
    const service = serviceData && serviceData.length > 0 ? 
      serviceData[0].services?.name || '' : '';
    
    return {
      id: booking.id,
      customerName: booking.customer_name || booking.customers?.name || 'Unknown',
      service: service,
      time: booking.time,
      status: booking.status,
    };
  } catch (error) {
    console.error("Error mapping booking:", error);
    return null;
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const today = new Date().toISOString().slice(0, 10);
      
      // Fetch total bookings for today
      const { count: bookingsToday, error: bookingsTodayError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      if (bookingsTodayError) {
        console.error("Error fetching bookings for today:", bookingsTodayError);
        throw bookingsTodayError;
      }

      // Fetch total pending jobs
      const { count: pendingJobs, error: pendingJobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Scheduled');

      if (pendingJobsError) {
        console.error("Error fetching pending jobs:", pendingJobsError);
        throw pendingJobsError;
      }

      // Calculate total revenue for the current month from InProgress and Completed jobs
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const startOfMonthISO = startOfMonth.toISOString().slice(0, 10);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      const endOfMonthISO = endOfMonth.toISOString().slice(0, 10);

      // Get jobs with InProgress or Completed status
      const { data: monthlyRevenueData, error: monthlyRevenueError } = await supabase
        .from('jobs')
        .select(`
          id, 
          booking_id,
          bookings (
            total_amount
          )
        `)
        .gte('date', startOfMonthISO)
        .lte('date', endOfMonthISO)
        .in('status', ['InProgress', 'Completed']);
      
      if (monthlyRevenueError) {
        console.error("Error fetching monthly revenue:", monthlyRevenueError);
        throw monthlyRevenueError;
      }

      let totalRevenue = 0;
      if (monthlyRevenueData && monthlyRevenueData.length > 0) {
        totalRevenue = monthlyRevenueData.reduce((sum, job) => {
          // Fixed TypeScript error by properly checking and accessing the total_amount property
          if (job.bookings && typeof job.bookings.total_amount === 'number') {
            return sum + job.bookings.total_amount;
          }
          return sum;
        }, 0);
      }

      const revenueMonth = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
      }).format(totalRevenue);

      // Fetch total customers
      const { count: totalCustomers, error: totalCustomersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (totalCustomersError) {
        console.error("Error fetching total customers:", totalCustomersError);
        throw totalCustomersError;
      }

      return {
        bookingsToday: bookingsToday || 0,
        pendingJobs: pendingJobs || 0,
        revenueMonth,
        totalCustomers: totalCustomers || 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  async getUpcomingBookings(): Promise<UpcomingBooking[]> {
    try {
      const today = new Date().toISOString().slice(0, 10);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          time,
          status,
          customers (
            name
          )
        `)
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) {
        console.error("Error fetching upcoming bookings:", error);
        throw error;
      }

      if (!bookings || bookings.length === 0) {
        return [];
      }

      // Map bookings to the desired format
      const upcomingBookings = [];
      for (const booking of bookings) {
        // Fixed TypeScript error by properly checking the customers property
        const customerName = booking.customers ? booking.customers.name : 'Unknown';

        // Get services for this booking
        const { data: serviceData } = await supabase
          .from('booking_services')
          .select('*, services(name)')
          .eq('booking_id', booking.id)
          .limit(1);
          
        const service = serviceData && serviceData.length > 0 && serviceData[0].services ? 
          serviceData[0].services.name || 'No service' : 'No service';
        
        upcomingBookings.push({
          id: booking.id,
          customerName,
          service,
          time: booking.time,
          status: booking.status,
        });
      }

      return upcomingBookings;
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      return [];
    }
  },
};
