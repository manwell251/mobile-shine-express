
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_reference: string
          customer_id: string | null
          date: string
          time: string
          location: string
          notes: string | null
          status: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_reference?: string
          customer_id?: string | null
          date: string
          time: string
          location: string
          notes?: string | null
          status: string
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_reference?: string
          customer_id?: string | null
          date?: string
          time?: string
          location?: string
          notes?: string | null
          status?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      booking_services: {
        Row: {
          booking_id: string
          service_id: string
          quantity: number | null
          price_at_booking: number
        }
        Insert: {
          booking_id: string
          service_id: string
          quantity?: number | null
          price_at_booking: number
        }
        Update: {
          booking_id?: string
          service_id?: string
          quantity?: number | null
          price_at_booking?: number
        }
      }
      technicians: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          job_reference: string
          booking_id: string | null
          technician_id: string | null
          date: string
          status: string
          start_time: string | null
          end_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_reference?: string
          booking_id?: string | null
          technician_id?: string | null
          date: string
          status: string
          start_time?: string | null
          end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_reference?: string
          booking_id?: string | null
          technician_id?: string | null
          date?: string
          status?: string
          start_time?: string | null
          end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          job_id: string | null
          customer_id: string | null
          issue_date: string
          due_date: string
          amount: number
          tax_amount: number
          total_amount: number
          payment_status: string
          payment_date: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number?: string
          job_id?: string | null
          customer_id?: string | null
          issue_date: string
          due_date: string
          amount: number
          tax_amount?: number
          total_amount: number
          payment_status: string
          payment_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          job_id?: string | null
          customer_id?: string | null
          issue_date?: string
          due_date?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          payment_status?: string
          payment_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          category: string
          name: string
          value: Json | null
          description: string | null
          updated_at: string
        }
        Insert: {
          id: string
          category: string
          name: string
          value?: Json | null
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          name?: string
          value?: Json | null
          description?: string | null
          updated_at?: string
        }
      }
    }
  }
}
