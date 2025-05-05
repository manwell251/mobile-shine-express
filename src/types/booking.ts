
export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  services: string[];
  date: string;
  time: string;
  status: 'Draft' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  totalAmount: string;
}
