import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: string;
  confirmedRevenue: string;
  projectedRevenue: string;
  outstandingRevenue: string;
  bookingsToday: number;
  pendingJobs: number;
  revenueMonth: string;
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      // Get booking stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('status, total_amount, date, created_at');

      if (bookingsError) throw bookingsError;

      // Get customer stats
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, created_at');

      if (customersError) throw customersError;

      // Get job stats
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('status, date');

      if (jobsError) throw jobsError;

      // Get invoice stats for confirmed revenue
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('payment_status, total_amount');

      if (invoicesError) throw invoicesError;

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const todayStr = today.toISOString().split('T')[0];

      // Calculate booking stats
      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'Completed').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'Cancelled').length || 0;
      const bookingsToday = bookings?.filter(b => b.date === todayStr).length || 0;

      // Calculate customer stats
      const totalCustomers = customers?.length || 0;
      const recentCustomers = customers?.filter(c => {
        const createdDate = new Date(c.created_at);
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - 3);
        return createdDate >= monthsAgo;
      }).length || 0;

      // Calculate job stats
      const pendingJobs = jobs?.filter(j => j.status === 'Scheduled' || j.status === 'InProgress').length || 0;

      // Calculate revenue metrics
      const confirmedRevenue = invoices?.filter(i => i.payment_status === 'Paid')
        .reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;

      const outstandingRevenue = invoices?.filter(i => i.payment_status === 'Pending' || i.payment_status === 'Overdue')
        .reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;

      // Projected revenue from all bookings (including those without invoices yet)
      const totalBookingRevenue = bookings?.filter(b => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      const projectedRevenue = totalBookingRevenue - confirmedRevenue;

      // Monthly revenue (current month completed bookings)
      const monthlyRevenue = bookings?.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               b.status === 'Completed';
      }).reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Format currency
      const formatCurrency = (amount: number) => new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);

      return {
        totalBookings,
        completedBookings,
        cancelledBookings,
        totalCustomers,
        activeCustomers: recentCustomers,
        monthlyRevenue: formatCurrency(monthlyRevenue),
        confirmedRevenue: formatCurrency(confirmedRevenue),
        projectedRevenue: formatCurrency(projectedRevenue),
        outstandingRevenue: formatCurrency(outstandingRevenue),
        bookingsToday,
        pendingJobs,
        revenueMonth: formatCurrency(monthlyRevenue)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalCustomers: 0,
        activeCustomers: 0,
        monthlyRevenue: 'UGX 0',
        confirmedRevenue: 'UGX 0',
        projectedRevenue: 'UGX 0',
        outstandingRevenue: 'UGX 0',
        bookingsToday: 0,
        pendingJobs: 0,
        revenueMonth: 'UGX 0'
      };
    }
  },

  async getRevenueStats(): Promise<RevenueStats> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_amount, created_at, status')
        .eq('status', 'Completed');

      if (error) throw error;

      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = bookings?.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }).reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      // Group by month for chart data
      const revenueByMonth = bookings?.reduce((acc: any[], booking) => {
        const date = new Date(booking.created_at);
        const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        
        const existing = acc.find(item => item.month === monthYear);
        if (existing) {
          existing.revenue += booking.total_amount || 0;
        } else {
          acc.push({ month: monthYear, revenue: booking.total_amount || 0 });
        }
        return acc;
      }, []) || [];

      return {
        totalRevenue,
        monthlyRevenue,
        revenueByMonth: revenueByMonth.slice(-6) // Last 6 months
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenueByMonth: []
      };
    }
  },

  async getUpcomingBookings() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_reference,
          date,
          time,
          status,
          customers (
            name
          )
        `)
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) throw error;

      return bookings?.map(booking => ({
        id: booking.id,
        customerName: booking.customers?.name || 'Unknown',
        service: 'Service Details', // Could be enhanced to show actual services
        time: booking.time,
        status: booking.status
      })) || [];
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      return [];
    }
  }
};
