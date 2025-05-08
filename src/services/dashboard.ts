
import { supabase } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

export interface DashboardStats {
  bookingsToday: number;
  pendingJobs: number;
  revenueMonth: string;
  totalCustomers: number;
}

export interface UpcomingBooking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const endOfCurrentMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    // Get bookings today
    const { count: bookingsToday } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    // Get pending jobs
    const { count: pendingJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Scheduled', 'InProgress']);

    // Get monthly revenue
    const { data: monthlyBookings } = await supabase
      .from('bookings')
      .select('total_amount')
      .gte('date', startOfCurrentMonth)
      .lte('date', endOfCurrentMonth);

    const revenueMonth = monthlyBookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    const formattedRevenue = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(revenueMonth / 1000000) + 'M';

    return {
      bookingsToday: bookingsToday || 0,
      pendingJobs: pendingJobs || 0,
      revenueMonth: formattedRevenue,
      totalCustomers: totalCustomers || 0
    };
  },

  async getUpcomingBookings(): Promise<UpcomingBooking[]> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        date,
        time,
        status,
        customers (name)
      `)
      .in('date', [today, tomorrow])
      .order('date')
      .order('time');

    if (error) throw error;

    const upcomingWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const { data: bookingServices, error: servicesError } = await supabase
          .from('booking_services')
          .select(`
            services (
              name
            )
          `)
          .eq('booking_id', booking.id)
          .limit(1);

        if (servicesError) throw servicesError;

        const primaryService = bookingServices.length > 0 ? bookingServices[0].services?.name : 'No service';

        return {
          id: booking.booking_reference,
          customerName: booking.customers?.name || 'Unknown',
          service: primaryService || 'Unknown service',
          date: format(parseISO(booking.date), 'yyyy-MM-dd'),
          time: booking.time,
          status: booking.status
        };
      })
    );

    return upcomingWithServices;
  }
};
