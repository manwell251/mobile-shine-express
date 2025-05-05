
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Booking } from '@/types/booking';

interface BookingListViewProps {
  bookings: Booking[];
  getStatusClass: (status: string) => string;
}

const BookingListView: React.FC<BookingListViewProps> = ({ 
  bookings,
  getStatusClass
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
            {bookings.map((booking) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default BookingListView;
