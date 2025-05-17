
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BookingWithDetails } from '@/services/bookings';
import { Card } from '@/components/ui/card';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer
const localizer = momentLocalizer(moment);

interface BookingCalendarViewProps {
  bookings: BookingWithDetails[];
  onBookingClick?: (bookingId: string) => void;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ bookings, onBookingClick }) => {
  // Transform bookings into events for the calendar
  const events = bookings.map(booking => {
    // Parse date and time from booking
    const [year, month, day] = booking.date.split('-').map(Number);
    const [hours, minutes] = booking.time.split(':').map(Number);
    
    // Create start date
    const start = new Date(year, month - 1, day, hours, minutes);
    
    // Assume services take 1 hour unless duration is provided
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    // Colors based on status
    let backgroundColor;
    switch (booking.status) {
      case 'Draft':
        backgroundColor = '#f3f4f6'; // gray-100
        break;
      case 'Scheduled':
        backgroundColor = '#dbeafe'; // blue-100
        break;
      case 'InProgress':
        backgroundColor = '#fef3c7'; // amber-100
        break;
      case 'Completed':
        backgroundColor = '#d1fae5'; // green-100
        break;
      case 'Cancelled':
        backgroundColor = '#fee2e2'; // red-100
        break;
      default:
        backgroundColor = '#f3f4f6'; // gray-100
    }
    
    return {
      id: booking.id,
      title: `${booking.customerName} - ${booking.services.join(', ')}`,
      start,
      end,
      allDay: false,
      resource: booking,
      backgroundColor
    };
  });

  // Customize how events are rendered
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: '#000',
        border: '1px solid #ccc',
        padding: '2px 5px',
        fontSize: '0.85em',
      }
    };
  };

  // Handle clicking on an event
  const handleEventClick = (event: any) => {
    if (onBookingClick && event.id) {
      onBookingClick(event.id);
    }
  };

  return (
    <Card className="p-4 h-[700px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        tooltipAccessor={(event: any) => `${event.title} (${event.resource.status})`}
      />
    </Card>
  );
};

export default BookingCalendarView;
