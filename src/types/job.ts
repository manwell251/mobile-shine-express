
export interface Job {
  id: string;
  bookingId: string;
  customerName: string;
  services: string[];
  date: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  amount: string;
  technician: string;
  location: string;
}
