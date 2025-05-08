
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { format } from 'date-fns';

export type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export interface InvoiceWithDetails {
  id: string;
  invoice_number: string;
  job_id: string;
  job_reference?: string;
  customer_id: string;
  customerName: string;
  booking_id?: string;
  booking_reference?: string;
  issue_date: string;
  due_date: string;
  amount: string;
  tax_amount: string;
  total_amount: string;
  payment_status: string;
  payment_date?: string;
  payment_method?: string;
  notes?: string;
}

export const invoicesService = {
  async getAll(): Promise<InvoiceWithDetails[]> {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        jobs (
          job_reference,
          booking_id,
          bookings (
            booking_reference
          )
        ),
        customers (
          name
        )
      `);

    if (error) throw error;

    return invoices.map(invoice => {
      const formattedAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.amount);

      const formattedTaxAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.tax_amount);

      const formattedTotalAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.total_amount);

      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        job_id: invoice.job_id || '',
        job_reference: invoice.jobs?.job_reference,
        customer_id: invoice.customer_id || '',
        customerName: invoice.customers?.name || 'Unknown',
        booking_id: invoice.jobs?.booking_id,
        booking_reference: invoice.jobs?.bookings?.booking_reference,
        issue_date: format(new Date(invoice.issue_date), 'yyyy-MM-dd'),
        due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
        amount: formattedAmount,
        tax_amount: formattedTaxAmount,
        total_amount: formattedTotalAmount,
        payment_status: invoice.payment_status,
        payment_date: invoice.payment_date ? format(new Date(invoice.payment_date), 'yyyy-MM-dd') : undefined,
        payment_method: invoice.payment_method || undefined,
        notes: invoice.notes || undefined
      };
    });
  },

  async getByStatus(status: string): Promise<InvoiceWithDetails[]> {
    if (status === 'all') {
      return this.getAll();
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        jobs (
          job_reference,
          booking_id,
          bookings (
            booking_reference
          )
        ),
        customers (
          name
        )
      `)
      .eq('payment_status', status);

    if (error) throw error;

    return invoices.map(invoice => {
      const formattedAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.amount);

      const formattedTaxAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.tax_amount);

      const formattedTotalAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.total_amount);

      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        job_id: invoice.job_id || '',
        job_reference: invoice.jobs?.job_reference,
        customer_id: invoice.customer_id || '',
        customerName: invoice.customers?.name || 'Unknown',
        booking_id: invoice.jobs?.booking_id,
        booking_reference: invoice.jobs?.bookings?.booking_reference,
        issue_date: format(new Date(invoice.issue_date), 'yyyy-MM-dd'),
        due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
        amount: formattedAmount,
        tax_amount: formattedTaxAmount,
        total_amount: formattedTotalAmount,
        payment_status: invoice.payment_status,
        payment_date: invoice.payment_date ? format(new Date(invoice.payment_date), 'yyyy-MM-dd') : undefined,
        payment_method: invoice.payment_method || undefined,
        notes: invoice.notes || undefined
      };
    });
  },

  async getById(id: string): Promise<InvoiceWithDetails | null> {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        jobs (
          job_reference,
          booking_id,
          bookings (
            booking_reference
          )
        ),
        customers (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!invoice) return null;

    const formattedAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(invoice.amount);

    const formattedTaxAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(invoice.tax_amount);

    const formattedTotalAmount = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(invoice.total_amount);

    return {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      job_id: invoice.job_id || '',
      job_reference: invoice.jobs?.job_reference,
      customer_id: invoice.customer_id || '',
      customerName: invoice.customers?.name || 'Unknown',
      booking_id: invoice.jobs?.booking_id,
      booking_reference: invoice.jobs?.bookings?.booking_reference,
      issue_date: format(new Date(invoice.issue_date), 'yyyy-MM-dd'),
      due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
      amount: formattedAmount,
      tax_amount: formattedTaxAmount,
      total_amount: formattedTotalAmount,
      payment_status: invoice.payment_status,
      payment_date: invoice.payment_date ? format(new Date(invoice.payment_date), 'yyyy-MM-dd') : undefined,
      payment_method: invoice.payment_method || undefined,
      notes: invoice.notes || undefined
    };
  },

  async create(invoice: InvoiceInsert): Promise<InvoiceRow> {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, invoice: InvoiceUpdate): Promise<InvoiceRow> {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async recordPayment(id: string, paymentMethod: string, paymentDate: string): Promise<InvoiceRow> {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        payment_status: 'Paid',
        payment_method: paymentMethod,
        payment_date: paymentDate
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(searchTerm: string): Promise<InvoiceWithDetails[]> {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        jobs (
          job_reference,
          booking_id,
          bookings (
            booking_reference
          )
        ),
        customers (
          name
        )
      `)
      .or(`
        invoice_number.ilike.%${searchTerm}%,
        jobs.job_reference.ilike.%${searchTerm}%,
        jobs.bookings.booking_reference.ilike.%${searchTerm}%,
        customers.name.ilike.%${searchTerm}%
      `);

    if (error) throw error;

    return invoices.map(invoice => {
      const formattedAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.amount);

      const formattedTaxAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.tax_amount);

      const formattedTotalAmount = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(invoice.total_amount);

      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        job_id: invoice.job_id || '',
        job_reference: invoice.jobs?.job_reference,
        customer_id: invoice.customer_id || '',
        customerName: invoice.customers?.name || 'Unknown',
        booking_id: invoice.jobs?.booking_id,
        booking_reference: invoice.jobs?.bookings?.booking_reference,
        issue_date: format(new Date(invoice.issue_date), 'yyyy-MM-dd'),
        due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
        amount: formattedAmount,
        tax_amount: formattedTaxAmount,
        total_amount: formattedTotalAmount,
        payment_status: invoice.payment_status,
        payment_date: invoice.payment_date ? format(new Date(invoice.payment_date), 'yyyy-MM-dd') : undefined,
        payment_method: invoice.payment_method || undefined,
        notes: invoice.notes || undefined
      };
    });
  }
};
