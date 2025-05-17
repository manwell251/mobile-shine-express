
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardService } from '@/services/dashboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { jobsService } from '@/services/jobs';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    monthlyRevenue: 'UGX 0'
  });
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Auto-create jobs from any scheduled bookings without jobs
        try {
          const jobsCreated = await jobsService.autoCreateJobsFromScheduledBookings();
          if (jobsCreated > 0) {
            toast({
              title: "Jobs Created",
              description: `${jobsCreated} new job(s) created from scheduled bookings.`
            });
          }
        } catch (error) {
          console.error('Error creating jobs from bookings:', error);
        }
        
        // Fetch stats
        const dashboardStats = await dashboardService.getStats();
        setStats({
          totalBookings: dashboardStats.totalBookings,
          completedBookings: dashboardStats.completedBookings,
          cancelledBookings: dashboardStats.cancelledBookings,
          totalCustomers: dashboardStats.totalCustomers,
          activeCustomers: dashboardStats.activeCustomers,
          monthlyRevenue: dashboardStats.monthlyRevenue
        });

        // Fetch upcoming bookings
        setUpcomingBookings(dashboardStats.upcomingBookings || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsItems = [
    { title: 'Total Bookings', value: stats.totalBookings.toString(), icon: <Calendar className="text-brand-blue" size={24} /> },
    { title: 'Completed Jobs', value: stats.completedBookings.toString(), icon: <Clock className="text-amber-500" size={24} /> },
    { title: 'Monthly Revenue', value: stats.monthlyRevenue, icon: <DollarSign className="text-green-500" size={24} /> },
    { title: 'Total Customers', value: stats.totalCustomers.toString(), icon: <Users className="text-purple-500" size={24} /> }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>
      
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
            <Card key={index} className="p-6 flex flex-row items-center">
              <div className="mr-4 bg-gray-100 p-4 rounded-full">
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
                  <TableRow key={booking.id} className="cursor-pointer hover:bg-gray-50" 
                    onClick={() => navigate(`/admin/bookings?edit=${booking.id}`)}>
                    <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
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
      
      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/bookings')}>
          <h3 className="font-bold text-lg mb-2">Manage Bookings</h3>
          <p className="text-gray-600">View and manage all customer bookings</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/jobs')}>
          <h3 className="font-bold text-lg mb-2">Manage Jobs</h3>
          <p className="text-gray-600">Track and update job statuses</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/customers')}>
          <h3 className="font-bold text-lg mb-2">View Customers</h3>
          <p className="text-gray-600">Access your customer database</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
