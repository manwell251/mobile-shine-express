
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, ChevronDown, Filter, Plus, Search, 
  Calendar as CalendarIcon, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import BookingForm from '@/components/admin/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

// Types for our bookings
interface Booking {
  id: string;
  customerName: string;
  phone: string;
  services: string[];
  date: string;
  time: string;
  status: 'Draft' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  totalAmount: string;
}

const Bookings = () => {
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Mock data - would come from backend API
  const bookings: Booking[] = [
    {
      id: 'BK001',
      customerName: 'John Doe',
      phone: '+256 700 123 456',
      services: ['Basic Wash Package'],
      date: '2025-05-05',
      time: '10:00 AM',
      status: 'Scheduled',
      totalAmount: 'UGX 25,000'
    },
    {
      id: 'BK002',
      customerName: 'Jane Smith',
      phone: '+256 780 567 890',
      services: ['Premium Detail Package', 'Headlight Restoration'],
      date: '2025-05-06',
      time: '2:00 PM',
      status: 'Draft',
      totalAmount: 'UGX 70,000'
    },
    {
      id: 'BK003',
      customerName: 'Robert Johnson',
      phone: '+256 712 345 678',
      services: ['Full-Service Wash Package'],
      date: '2025-05-04',
      time: '11:30 AM',
      status: 'Completed',
      totalAmount: 'UGX 35,000'
    },
    {
      id: 'BK004',
      customerName: 'Emily Brown',
      phone: '+256 756 789 012',
      services: ['Complete Detailing Package'],
      date: '2025-05-07',
      time: '9:00 AM',
      status: 'InProgress',
      totalAmount: 'UGX 150,000'
    }
  ];

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'InProgress': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    return (statusFilter === 'all' || booking.status === statusFilter) &&
      (booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.id.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Calendar view placeholder data
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Bookings</h1>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setShowAddBooking(true)}
        >
          <Plus size={16} className="mr-2" /> Add Booking
        </Button>
      </div>

      {showAddBooking && (
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">New Booking</h2>
          <BookingForm onCancel={() => setShowAddBooking(false)} />
        </Card>
      )}

      {/* View Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search bookings..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setStatusFilter('all')}
              >
                <Filter size={16} className="mr-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
                <ChevronDown size={16} className="ml-2" />
              </Button>
              <Button variant="outline" className="flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                Date Range
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Status quick filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={statusFilter === 'all' ? "default" : "ghost"} 
              onClick={() => setStatusFilter('all')}
              className="text-sm h-8"
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'Draft' ? "default" : "ghost"} 
              onClick={() => setStatusFilter('Draft')}
              className="text-sm h-8"
            >
              Draft
            </Button>
            <Button 
              variant={statusFilter === 'Scheduled' ? "default" : "ghost"} 
              onClick={() => setStatusFilter('Scheduled')}
              className="text-sm h-8"
            >
              Scheduled
            </Button>
            <Button 
              variant={statusFilter === 'InProgress' ? "default" : "ghost"} 
              onClick={() => setStatusFilter('InProgress')}
              className="text-sm h-8"
            >
              In Progress
            </Button>
            <Button 
              variant={statusFilter === 'Completed' ? "default" : "ghost"} 
              onClick={() => setStatusFilter('Completed')}
              className="text-sm h-8"
            >
              Completed
            </Button>
          </div>

          {/* Bookings Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>List of all bookings</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.services.map((service, idx) => (
                          <div key={idx} className="text-sm">
                            {service}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <Calendar size={14} className="mr-1 text-gray-500" />
                            {booking.date}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock size={14} className="mr-1 text-gray-500" />
                            {booking.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>{booking.totalAmount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Weekly Calendar View</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-8 gap-2 border-b pb-2 mb-2">
                  <div className="font-medium"></div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="font-medium text-center">
                      {day}
                    </div>
                  ))}
                </div>
                {timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="grid grid-cols-8 gap-2 border-b py-2">
                    <div className="text-sm text-gray-600">{time}</div>
                    {weekDays.map((_, dayIndex) => {
                      const hasBooking = bookings.some(
                        b => b.time.includes(time.replace(' ', '')) && 
                        dayIndex === new Date(b.date).getDay() - 1
                      );
                      return (
                        <div 
                          key={dayIndex} 
                          className={`h-10 rounded-md border text-center ${
                            hasBooking ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                          }`}
                        >
                          {hasBooking && <div className="text-xs p-1">Booked</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
