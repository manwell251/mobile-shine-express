
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { BookingWithDetails } from '@/services/bookings';

interface BookingListViewProps {
  bookings: BookingWithDetails[];
  getStatusClass: (status: string) => string;
  isLoading?: boolean;
}

const BookingListView: React.FC<BookingListViewProps> = ({ 
  bookings,
  getStatusClass,
  isLoading = false
}) => {
  return (
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
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><div className="h-5 bg-gray-200 w-14 animate-pulse rounded"></div></TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 w-24 animate-pulse rounded"></div>
                      <div className="h-3 bg-gray-200 w-20 animate-pulse rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-28 animate-pulse rounded"></div></TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 w-20 animate-pulse rounded"></div>
                      <div className="h-3 bg-gray-200 w-16 animate-pulse rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-8 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                </TableRow>
              ))
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No bookings found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.booking_reference}</TableCell>
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
                        <CalendarIcon size={14} className="mr-1 text-gray-500" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default BookingListView;
