
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardService } from '@/services/dashboard';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    bookingsToday: 0,
    pendingJobs: 0,
    revenueMonth: 'UGX 0',
    totalCustomers: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch stats
        const dashboardStats = await dashboardService.getStats();
        setStats({
          bookingsToday: dashboardStats.bookingsToday,
          pendingJobs: dashboardStats.pendingJobs,
          revenueMonth: dashboardStats.revenueMonth,
          totalCustomers: dashboardStats.totalCustomers
        });

        // Fetch upcoming bookings
        const bookings = await dashboardService.getUpcomingBookings();
        setUpcomingBookings(bookings);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsItems = [
    { title: 'Bookings Today', value: stats.bookingsToday.toString(), icon: <Calendar className="text-brand-blue" size={24} /> },
    { title: 'Pending Jobs', value: stats.pendingJobs.toString(), icon: <Clock className="text-amber-500" size={24} /> },
    { title: 'Revenue (Month)', value: stats.revenueMonth, icon: <DollarSign className="text-green-500" size={24} /> },
    { title: 'Total Customers', value: stats.totalCustomers.toString(), icon: <Users className="text-purple-500" size={24} /> }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          // Loading skeleton for stats
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="p-4 flex flex-row items-center">
              <div className="mr-4 bg-gray-100 p-3 rounded-full animate-pulse h-12 w-12"></div>
              <div className="w-full">
                <p className="text-sm text-gray-500 bg-gray-200 h-4 w-3/4 animate-pulse mb-1 rounded"></p>
                <h3 className="h-7 bg-gray-200 w-1/2 animate-pulse rounded"></h3>
              </div>
            </Card>
          ))
        ) : (
          statsItems.map((stat, index) => (
            <Card key={index} className="p-4 flex flex-row items-center">
              <div className="mr-4 bg-gray-100 p-3 rounded-full">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Upcoming Bookings */}
      <h2 className="text-xl font-bold mb-4">Today's Bookings</h2>
      <Card className="mb-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton for bookings
                Array(4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium"><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-32 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">No bookings for today</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Recent Activities & Performance Charts would be added here */}
    </div>
  );
};

export default Dashboard;
