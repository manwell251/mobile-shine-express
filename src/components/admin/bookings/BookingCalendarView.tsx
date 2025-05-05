
import React from 'react';
import { Card } from '@/components/ui/card';
import { Booking } from '@/types/booking';

interface BookingCalendarViewProps {
  bookings: Booking[];
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ bookings }) => {
  // Calendar view placeholder data
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
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
  );
};

export default BookingCalendarView;
