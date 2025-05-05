
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  // This would be fetched from your backend in a real implementation
  const stats = [
    { title: 'Bookings Today', value: '8', icon: <Calendar className="text-brand-blue" size={24} /> },
    { title: 'Pending Jobs', value: '12', icon: <Clock className="text-amber-500" size={24} /> },
    { title: 'Revenue (Month)', value: 'UGX 2.5M', icon: <DollarSign className="text-green-500" size={24} /> },
    { title: 'Total Customers', value: '145', icon: <Users className="text-purple-500" size={24} /> }
  ];

  // Upcoming bookings - would be fetched from backend
  const upcomingBookings = [
    { id: 'B123', customerName: 'John Doe', service: 'Premium Detail', date: '2025-05-05', time: '09:00 AM', status: 'Scheduled' },
    { id: 'B124', customerName: 'Jane Smith', service: 'Basic Wash', date: '2025-05-05', time: '11:30 AM', status: 'Scheduled' },
    { id: 'B125', customerName: 'Robert Johnson', service: 'Headlight Restoration', date: '2025-05-06', time: '10:00 AM', status: 'Scheduled' },
    { id: 'B126', customerName: 'Mary Williams', service: 'Full-Service Wash', date: '2025-05-06', time: '02:00 PM', status: 'Scheduled' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 flex flex-row items-center">
            <div className="mr-4 bg-gray-100 p-3 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </Card>
        ))}
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
              {upcomingBookings.map((booking) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Recent Activities & Performance Charts would be added here */}
    </div>
  );
};

export default Dashboard;
