
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isToday } from 'date-fns';
import { BookingWithDetails } from '@/services/bookings';
import { cn } from '@/lib/utils';

interface BookingCalendarViewProps {
  bookings: BookingWithDetails[];
  onBookingClick: (bookingId: string) => void;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ bookings, onBookingClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  const startingDayOfWeek = getDay(firstDayOfMonth); // 0 = Sunday, 1 = Monday, etc.
  
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Group bookings by date
  const bookingsByDate: Record<string, BookingWithDetails[]> = {};
  
  bookings.forEach(booking => {
    const dateKey = booking.date;
    if (!bookingsByDate[dateKey]) {
      bookingsByDate[dateKey] = [];
    }
    bookingsByDate[dateKey].push(booking);
  });
  
  // Days of the week header
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={previousMonth}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {weekdays.map(day => (
          <div key={day} className="text-center font-medium text-sm py-1">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 p-1 border rounded bg-gray-50"></div>
        ))}
        
        {/* Days of the month */}
        {daysInMonth.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayBookings = bookingsByDate[dateKey] || [];
          
          return (
            <div 
              key={dateKey} 
              className={cn(
                "h-24 p-1 border rounded overflow-y-auto",
                isToday(day) ? "border-blue-400 bg-blue-50" : "bg-white"
              )}
            >
              <div className="text-right mb-1">
                <span className={cn(
                  "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs",
                  isToday(day) ? "bg-blue-500 text-white" : "text-gray-700"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              
              {/* Bookings for this day */}
              <div className="space-y-1">
                {dayBookings.map(booking => (
                  <div 
                    key={booking.id} 
                    className={cn(
                      "text-xs p-1 rounded cursor-pointer hover:opacity-80",
                      getStatusClass(booking.status)
                    )}
                    onClick={() => onBookingClick(booking.id)}
                  >
                    <div className="font-medium truncate">{format(parseISO(`${booking.date}T${booking.time}`), 'h:mm a')}</div>
                    <div className="truncate">{booking.customerName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BookingCalendarView;
