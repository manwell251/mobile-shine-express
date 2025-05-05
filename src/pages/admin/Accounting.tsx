
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Download, Filter, Calendar as CalendarIcon, ChevronDown, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for the financial records
interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  date: string;
  amount: string;
  method: 'Cash' | 'Mobile Money' | 'Card' | 'Bank Transfer';
  status: 'Paid' | 'Pending' | 'Cancelled';
}

interface Invoice {
  id: string;
  bookingId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Mock data - would come from backend API
  const payments: Payment[] = [
    {
      id: 'PAY001',
      bookingId: 'BK001',
      customerName: 'John Doe',
      date: '2025-05-05',
      amount: 'UGX 25,000',
      method: 'Mobile Money',
      status: 'Paid'
    },
    {
      id: 'PAY002',
      bookingId: 'BK003',
      customerName: 'Robert Johnson',
      date: '2025-05-04',
      amount: 'UGX 35,000',
      method: 'Cash',
      status: 'Paid'
    },
    {
      id: 'PAY003',
      bookingId: 'BK004',
      customerName: 'Emily Brown',
      date: '2025-05-07',
      amount: 'UGX 150,000',
      method: 'Card',
      status: 'Pending'
    }
  ];

  const invoices: Invoice[] = [
    {
      id: 'INV001',
      bookingId: 'BK001',
      customerName: 'John Doe',
      issueDate: '2025-05-05',
      dueDate: '2025-05-12',
      amount: 'UGX 25,000',
      status: 'Paid'
    },
    {
      id: 'INV002',
      bookingId: 'BK003',
      customerName: 'Robert Johnson',
      issueDate: '2025-05-04',
      dueDate: '2025-05-11',
      amount: 'UGX 35,000',
      status: 'Paid'
    },
    {
      id: 'INV003',
      bookingId: 'BK004',
      customerName: 'Emily Brown',
      issueDate: '2025-05-07',
      dueDate: '2025-05-14',
      amount: 'UGX 150,000',
      status: 'Unpaid'
    }
  ];

  const getPaymentStatusClass = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInvoiceStatusClass = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Unpaid': return 'bg-blue-100 text-blue-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter payments based on status and search term
  const filteredPayments = payments.filter(payment => {
    return (paymentFilter === 'all' || payment.status === paymentFilter) &&
      (payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => {
    return invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Accounting</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button>
            <Download size={16} className="mr-2" /> Export Data
          </Button>
          <Button variant="outline">
            <Printer size={16} className="mr-2" /> Print Report
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">UGX 2,350,000</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending Payments</p>
          <p className="text-2xl font-bold">UGX 150,000</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold">UGX 210,000</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Outstanding Invoices</p>
          <p className="text-2xl font-bold">1</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search payments or invoices..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <Filter size={16} className="mr-2" />
            Filters
            <ChevronDown size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="flex items-center">
            <CalendarIcon size={16} className="mr-2" />
            Date Range
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payments" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          {/* Payment Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={paymentFilter === 'all' ? "default" : "ghost"} 
              onClick={() => setPaymentFilter('all')}
              className="text-sm h-8"
            >
              All
            </Button>
            <Button 
              variant={paymentFilter === 'Paid' ? "default" : "ghost"} 
              onClick={() => setPaymentFilter('Paid')}
              className="text-sm h-8"
            >
              Paid
            </Button>
            <Button 
              variant={paymentFilter === 'Pending' ? "default" : "ghost"} 
              onClick={() => setPaymentFilter('Pending')}
              className="text-sm h-8"
            >
              Pending
            </Button>
            <Button 
              variant={paymentFilter === 'Cancelled' ? "default" : "ghost"} 
              onClick={() => setPaymentFilter('Cancelled')}
              className="text-sm h-8"
            >
              Cancelled
            </Button>
          </div>

          {/* Payments Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.bookingId}</TableCell>
                      <TableCell>{payment.customerName}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Receipt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          {/* Invoices Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.bookingId}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getInvoiceStatusClass(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer size={14} className="mr-1" /> Print
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
