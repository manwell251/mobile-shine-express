
export type BookingStatus = 'Draft' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  services: string[];
  date: string;
  time: string;
  status: BookingStatus;
  totalAmount: string;
}
