
import React, { useState, useEffect } from 'react';
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
import { invoicesService, InvoiceWithDetails } from '@/services/invoices';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, printElement } from '@/utils/export';

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState({
    totalRevenue: 'UGX 0',
    pendingPayments: 'UGX 0',
    thisMonth: 'UGX 0',
    outstandingInvoices: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, [paymentFilter]);

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInvoices();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      let fetchedInvoices;
      
      if (searchTerm) {
        fetchedInvoices = await invoicesService.search(searchTerm);
      } else {
        fetchedInvoices = await invoicesService.getByStatus(paymentFilter);
      }
      
      setInvoices(fetchedInvoices);
      calculateFinancialSummary(fetchedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load accounting data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFinancialSummary = (invoiceData: InvoiceWithDetails[]) => {
    // Remove currency formatting and convert to numbers for calculations
    const getTotalAmount = (str: string) => {
      return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    };

    let totalRevenue = 0;
    let pendingPayments = 0;
    let thisMonth = 0;
    let outstandingInvoices = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    invoiceData.forEach(invoice => {
      const amount = getTotalAmount(invoice.total_amount);
      
      // Add to total revenue if paid
      if (invoice.payment_status === 'Paid') {
        totalRevenue += amount;
      }
      
      // Add to pending payments if not paid
      if (invoice.payment_status === 'Pending' || invoice.payment_status === 'Overdue') {
        pendingPayments += amount;
        outstandingInvoices++;
      }
      
      // Check if invoice is from current month
      const invoiceDate = new Date(invoice.issue_date);
      if (invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear) {
        thisMonth += amount;
      }
    });

    setFinancialSummary({
      totalRevenue: new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(totalRevenue),
      pendingPayments: new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(pendingPayments),
      thisMonth: new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(thisMonth),
      outstandingInvoices
    });
  };

  const handleExportData = () => {
    try {
      const exportData = invoices.map(invoice => ({
        'Invoice Number': invoice.invoice_number,
        'Job Reference': invoice.job_reference || 'N/A',
        'Customer': invoice.customerName,
        'Issue Date': invoice.issue_date,
        'Due Date': invoice.due_date,
        'Amount': invoice.amount,
        'Tax': invoice.tax_amount,
        'Total': invoice.total_amount,
        'Status': invoice.payment_status,
        'Payment Date': invoice.payment_date || 'N/A',
        'Payment Method': invoice.payment_method || 'N/A'
      }));

      exportToExcel({
        fileName: 'Accounting_Data',
        sheets: [
          {
            name: 'Invoices',
            data: exportData
          }
        ]
      });
      
      toast({
        title: "Export Successful",
        description: "Accounting data has been exported to Excel."
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive"
      });
    }
  };

  const handlePrintReport = () => {
    printElement('accounting-summary');
    
    toast({
      title: "Print Initiated",
      description: "The accounting report print dialog has been opened."
    });
  };

  const getPaymentStatusClass = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      case 'Cancelled': return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="container mx-auto px-4 py-6" id="accounting-summary">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Accounting</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button onClick={handleExportData}>
            <Download size={16} className="mr-2" /> Export Data
          </Button>
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer size={16} className="mr-2" /> Print Report
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          {isLoading ? (
            <div className="h-7 bg-gray-200 w-28 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold">{financialSummary.totalRevenue}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending Payments</p>
          {isLoading ? (
            <div className="h-7 bg-gray-200 w-28 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold">{financialSummary.pendingPayments}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">This Month</p>
          {isLoading ? (
            <div className="h-7 bg-gray-200 w-28 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold">{financialSummary.thisMonth}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Outstanding Invoices</p>
          {isLoading ? (
            <div className="h-7 bg-gray-200 w-16 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold">{financialSummary.outstandingInvoices}</p>
          )}
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search invoices..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select 
            defaultValue="all"
            value={paymentFilter}
            onValueChange={setPaymentFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center">
            <CalendarIcon size={16} className="mr-2" />
            Date Range
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          {/* Invoices Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Job/Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, index) => (
                      <TableRow key={`invoice-loading-${index}`}>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-8 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                      </TableRow>
                    ))
                  ) : invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        No invoices found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.job_reference || (invoice.booking_reference || 'N/A')}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{invoice.issue_date}</TableCell>
                        <TableCell>{invoice.due_date}</TableCell>
                        <TableCell>{invoice.total_amount}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getInvoiceStatusClass(invoice.payment_status)}`}>
                            {invoice.payment_status}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          {/* Payments Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice/Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, index) => (
                      <TableRow key={`payment-loading-${index}`}>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-8 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        Payments data will be available when invoices have associated payments.
                      </TableCell>
                    </TableRow>
                  )}
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
