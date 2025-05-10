
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

export interface BookingInsert {
  booking_reference: string;
  customer_id?: string | null;
  date: string;
  time: string;
  location: string;
  notes?: string | null;
  status: BookingStatus;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingUpdate {
  booking_reference?: string;
  customer_id?: string | null;
  date?: string;
  time?: string;
  location?: string;
  notes?: string | null;
  status?: BookingStatus;
  total_amount?: number;
  updated_at?: string;
}
