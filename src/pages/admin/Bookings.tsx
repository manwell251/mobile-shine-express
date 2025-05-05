
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BookingForm from '@/components/admin/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import BookingListView from '@/components/admin/bookings/BookingListView';
import BookingCalendarView from '@/components/admin/bookings/BookingCalendarView';
import BookingFilters from '@/components/admin/bookings/BookingFilters';
import { Booking } from '@/types/booking';

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
          <BookingFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Bookings Table */}
          <BookingListView 
            bookings={filteredBookings} 
            getStatusClass={getStatusClass} 
          />
        </TabsContent>
        
        <TabsContent value="calendar">
          <BookingCalendarView bookings={bookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
