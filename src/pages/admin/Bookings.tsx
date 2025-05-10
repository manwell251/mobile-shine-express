
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BookingForm from '@/components/admin/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import BookingListView from '@/components/admin/bookings/BookingListView';
import BookingCalendarView from '@/components/admin/bookings/BookingCalendarView';
import BookingFilters from '@/components/admin/bookings/BookingFilters';
import { bookingsService, BookingWithDetails } from '@/services/bookings';
import { useToast } from '@/hooks/use-toast';

const Bookings = () => {
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBookings();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      let fetchedBookings;
      
      if (searchTerm) {
        fetchedBookings = await bookingsService.search(searchTerm);
      } else {
        fetchedBookings = await bookingsService.getByStatus(statusFilter);
      }
      
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleBookingSuccess = () => {
    setShowAddBooking(false);
    fetchBookings();
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await bookingsService.delete(id);
      toast({
        title: "Success",
        description: "Booking deleted successfully"
      });
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          <BookingForm 
            onCancel={() => setShowAddBooking(false)} 
            onSuccess={handleBookingSuccess}
          />
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
            bookings={bookings} 
            getStatusClass={getStatusClass}
            isLoading={isLoading}
            onDelete={handleDeleteBooking}
            onStatusChange={async (id: string, status: string) => {
              try {
                await bookingsService.updateStatus(id, status as any);
                toast({
                  title: "Status Updated",
                  description: `Booking status changed to ${status}`
                });
                fetchBookings();
              } catch (error) {
                console.error('Error updating status:', error);
                toast({
                  title: "Error",
                  description: "Failed to update booking status",
                  variant: "destructive"
                });
              }
            }}
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
