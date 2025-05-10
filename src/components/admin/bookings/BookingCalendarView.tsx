
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookingWithDetails } from '@/services/bookings';
import { format, startOfWeek, addDays, parse } from 'date-fns';

interface BookingCalendarViewProps {
  bookings: BookingWithDetails[];
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ bookings }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Generate week days from current week start
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(currentWeekStart, i);
    return {
      date: day,
      name: format(day, 'EEEE'),
      dateStr: format(day, 'yyyy-MM-dd')
    };
  });
  
  // Time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  
  // Find bookings for a specific day and time
  const getBookingsForSlot = (dateStr: string, timeStr: string) => {
    return bookings.filter(booking => {
      // Normalize the booking time to AM/PM format for comparison
      const bookingDate = booking.date;
      let bookingTime = booking.time;
      
      // If booking time is in 24h format (HH:MM:SS), convert to AM/PM
      if (bookingTime.includes(':') && !bookingTime.includes(' ')) {
        try {
          const timeObj = parse(bookingTime, 'HH:mm:ss', new Date());
          bookingTime = format(timeObj, 'hh:mm a').toUpperCase();
        } catch (error) {
          console.error("Error parsing booking time:", error);
        }
      }
      
      return bookingDate === dateStr && bookingTime.includes(timeStr);
    });
  };
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevDate => addDays(prevDate, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentWeekStart(prevDate => addDays(prevDate, 7));
  };
  
  // Get status class for booking
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Weekly Calendar View</h3>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousWeek}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Previous Week
          </button>
          <div className="px-3 py-1 bg-blue-50 rounded">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
          </div>
          <button 
            onClick={goToNextWeek}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Next Week
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Calendar header with days */}
          <div className="grid grid-cols-8 gap-2 border-b pb-2 mb-2">
            <div className="font-medium"></div>
            {weekDays.map((day, index) => (
              <div key={index} className="font-medium text-center">
                <div>{day.name}</div>
                <div className="text-sm text-gray-500">{format(day.date, 'MMM d')}</div>
              </div>
            ))}
          </div>
          
          {/* Time slots and bookings */}
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 gap-2 border-b py-2">
              <div className="text-sm text-gray-600">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const dayBookings = getBookingsForSlot(day.dateStr, time);
                const hasBookings = dayBookings.length > 0;
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`min-h-10 rounded-md border ${
                      hasBookings ? 'border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    {hasBookings && (
                      <div className="p-1 text-xs">
                        {dayBookings.map((booking, i) => (
                          <div 
                            key={i} 
                            className={`mb-1 p-1 rounded ${getStatusClass(booking.status)}`}
                            title={`${booking.customerName} - ${booking.services.join(', ')}`}
                          >
                            {booking.customerName.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BookingCalendarView;
