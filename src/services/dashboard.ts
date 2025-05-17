
import { supabase } from '@/lib/supabase';
import { format, parse, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: string;
  weeklyBookings: number[];
  weekDays: string[];
  topServices: {
    name: string;
    count: number;
  }[];
  upcomingBookings: {
    id: string;
    customer: string;
    service: string;
    date: string;
    time: string;
    status: string;
  }[];
}

interface RevenueStats {
  actual: string;
  projected: string;
  percentChange: string;
  breakdown: {
    labels: string[];
    actual: number[];
    projected: number[];
  };
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      // Total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Completed bookings
      const { count: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed');

      // Cancelled bookings
      const { count: cancelledBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Cancelled');

      // Total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Active customers (customers with at least one booking in the last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('customer_id')
        .gte('date', format(ninetyDaysAgo, 'yyyy-MM-dd'));
      
      // Get unique customer IDs from recent bookings
      const activeCustomerIds = [...new Set(recentBookings?.map(booking => booking.customer_id))];
      const activeCustomers = activeCustomerIds.length;

      // Monthly revenue
      const startOfCurrentMonth = startOfMonth(new Date());
      const endOfCurrentMonth = endOfMonth(new Date());
      
      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .in('status', ['Completed', 'InProgress'])
        .gte('date', format(startOfCurrentMonth, 'yyyy-MM-dd'))
        .lte('date', format(endOfCurrentMonth, 'yyyy-MM-dd'));
      
      const monthlyRevenue = monthlyBookings && monthlyBookings.length > 0 ? 
        monthlyBookings.reduce((sum, booking: any) => sum + (booking?.total_amount || 0), 0) : 0;

      // Weekly bookings
      const startDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // 0 is Sunday
      const endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
      const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
      
      const { data: weeklyBookingsData } = await supabase
        .from('bookings')
        .select('date, id')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));

      // Initialize array for each day of the week
      const weeklyBookingCounts = Array(7).fill(0);
      
      // Count bookings for each day
      weeklyBookingsData?.forEach((booking: any) => {
        const bookingDate = parse(booking.date, 'yyyy-MM-dd', new Date());
        const dayIndex = bookingDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        weeklyBookingCounts[dayIndex]++;
      });

      // Get top services
      const { data: serviceBookings } = await supabase
        .from('booking_services')
        .select(`
          service_id,
          services ( name )
        `)
        .limit(50); // Get a reasonable sample

      // Count occurrences of each service
      const serviceCounts: Record<string, { name: string; count: number }> = {};
      
      serviceBookings?.forEach((item: any) => {
        const serviceId = item.service_id;
        const serviceName = item.services?.name || 'Unknown';
        
        if (!serviceCounts[serviceId]) {
          serviceCounts[serviceId] = { name: serviceName, count: 0 };
        }
        serviceCounts[serviceId].count++;
      });
      
      // Convert to array and sort
      const topServices = Object.values(serviceCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Get top 5

      // Get upcoming bookings
      const today = new Date();
      const { data: upcomingBookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          date,
          time,
          status,
          customers (name),
          booking_services (
            services (name)
          )
        `)
        .gte('date', format(today, 'yyyy-MM-dd'))
        .in('status', ['Draft', 'Scheduled'])
        .order('date', { ascending: true })
        .limit(5);

      const upcomingBookings = upcomingBookingsData?.map((booking: any) => ({
        id: booking.id,
        customer: booking.customers?.name || 'Unknown',
        service: booking.booking_services?.[0]?.services?.name || 'Unknown',
        date: booking.date,
        time: booking.time,
        status: booking.status
      })) || [];

      // Format weekly days
      const formattedWeekDays = weekDays.map(day => format(day, 'EEE'));

      // Format currency
      const formattedRevenue = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
      }).format(monthlyRevenue);

      return {
        totalBookings: totalBookings || 0,
        completedBookings: completedBookings || 0,
        cancelledBookings: cancelledBookings || 0,
        totalCustomers: totalCustomers || 0,
        activeCustomers: activeCustomers || 0,
        monthlyRevenue: formattedRevenue,
        weeklyBookings: weeklyBookingCounts,
        weekDays: formattedWeekDays,
        topServices,
        upcomingBookings
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
        weeklyBookings: [0, 0, 0, 0, 0, 0, 0],
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        topServices: [],
        upcomingBookings: []
      };
    }
  },

  async getRevenueStats(): Promise<RevenueStats> {
    try {
      // Actual revenue (from Completed and InProgress bookings)
      const { data: actualBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .in('status', ['Completed', 'InProgress']);

      const actualRevenue = actualBookings?.reduce((sum, booking) => 
        sum + (booking.total_amount || 0), 0) || 0;

      // Projected revenue (include Scheduled bookings)
      const { data: projectedBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .in('status', ['Completed', 'InProgress', 'Scheduled', 'Draft']);

      const projectedRevenue = projectedBookings?.reduce((sum, booking) => 
        sum + (booking.total_amount || 0), 0) || 0;

      // Calculate percent change
      const percentChange = actualRevenue > 0 ? 
        ((projectedRevenue - actualRevenue) / actualRevenue * 100).toFixed(1) : '0';

      // Get monthly breakdown
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const actualByMonth = Array(12).fill(0);
      const projectedByMonth = Array(12).fill(0);

      // Get all bookings for the current year
      const currentYear = new Date().getFullYear();
      const { data: yearBookings } = await supabase
        .from('bookings')
        .select('date, total_amount, status');

      // Process bookings by month
      yearBookings?.forEach((booking) => {
        const bookingDate = parse(booking.date, 'yyyy-MM-dd', new Date());
        const bookingYear = bookingDate.getFullYear();
        
        // Only consider bookings from the current year
        if (bookingYear === currentYear) {
          const monthIndex = bookingDate.getMonth();
          
          // Add to projected revenue
          projectedByMonth[monthIndex] += (booking.total_amount || 0);
          
          // Add to actual revenue if completed or in progress
          if (booking.status === 'Completed' || booking.status === 'InProgress') {
            actualByMonth[monthIndex] += (booking.total_amount || 0);
          }
        }
      });

      // Format currency
      const formatter = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
      });

      return {
        actual: formatter.format(actualRevenue),
        projected: formatter.format(projectedRevenue),
        percentChange: `${percentChange}%`,
        breakdown: {
          labels: months,
          actual: actualByMonth,
          projected: projectedByMonth
        }
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        actual: 'UGX 0',
        projected: 'UGX 0',
        percentChange: '0%',
        breakdown: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          projected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      };
    }
  }
};
