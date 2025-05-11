
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';
import { BookingWithDetails } from '@/services/bookings';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from '@/types/booking';

interface BookingListViewProps {
  bookings: BookingWithDetails[];
  getStatusClass: (status: string) => string;
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: string) => Promise<void>;
  onEdit?: (id: string) => void;
}

const BookingListView: React.FC<BookingListViewProps> = ({ 
  bookings,
  getStatusClass,
  isLoading = false,
  onDelete,
  onStatusChange,
  onEdit
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  const statusOptions: BookingStatus[] = ["Draft", "Scheduled", "InProgress", "Completed", "Cancelled"];

  const handleDelete = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (bookingToDelete && onDelete) {
      await onDelete(bookingToDelete);
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (onStatusChange) {
      setStatusUpdateLoading(id);
      try {
        await onStatusChange(id, status);
      } finally {
        setStatusUpdateLoading(null);
      }
    }
  };

  return (
    <>
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
                      {onStatusChange ? (
                        <Select 
                          defaultValue={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value)}
                          disabled={statusUpdateLoading === booking.id}
                        >
                          <SelectTrigger className={`w-[130px] ${getStatusClass(booking.status)}`}>
                            <SelectValue placeholder={booking.status} />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{booking.totalAmount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {onEdit && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onEdit(booking.id)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this booking and associated services.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingListView;
