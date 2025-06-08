
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { invoicesService, InvoiceWithDetails } from '@/services/invoices';
import { dashboardService, DashboardStats } from '@/services/dashboard';
import { exportToExcel } from '@/utils/export';
import { DollarSign, TrendingUp, AlertCircle, Download, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Accounting = () => {
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [revenueStats, setRevenueStats] = useState<DashboardStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccountingData();
  }, [statusFilter]);

  const fetchAccountingData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch invoices based on status filter
      const invoiceData = await invoicesService.getByStatus(statusFilter);
      setInvoices(invoiceData);
      
      // Fetch revenue statistics
      const stats = await dashboardService.getStats();
      setRevenueStats(stats);
      
    } catch (error) {
      console.error('Error fetching accounting data:', error);
      toast({
        title: "Error",
        description: "Failed to load accounting data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = invoices.map(invoice => ({
        'Invoice Number': invoice.invoice_number,
        'Job Reference': invoice.job_reference || 'N/A',
        'Booking Reference': invoice.booking_reference || 'N/A',
        'Customer': invoice.customerName,
        'Issue Date': invoice.issue_date,
        'Due Date': invoice.due_date,
        'Amount': invoice.amount,
        'Tax Amount': invoice.tax_amount,
        'Total Amount': invoice.total_amount,
        'Payment Status': invoice.payment_status,
        'Payment Date': invoice.payment_date || 'N/A',
        'Payment Method': invoice.payment_method || 'N/A'
      }));

      exportToExcel({
        fileName: 'Accounting_Report',
        sheets: [
          {
            name: 'Invoices',
            data: exportData
          }
        ]
      });
      
      toast({
        title: "Export Successful",
        description: "Accounting data has been exported to Excel.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
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

  const revenueInsights = revenueStats ? [
    { 
      title: 'Confirmed Revenue', 
      value: revenueStats.confirmedRevenue, 
      description: 'From paid invoices', 
      icon: <DollarSign className="text-green-500" size={24} />,
      trend: 'positive'
    },
    { 
      title: 'Outstanding Revenue', 
      value: revenueStats.outstandingRevenue, 
      description: 'Pending payments', 
      icon: <AlertCircle className="text-amber-500" size={24} />,
      trend: 'neutral'
    },
    { 
      title: 'Projected Revenue', 
      value: revenueStats.projectedRevenue, 
      description: 'From active bookings', 
      icon: <TrendingUp className="text-blue-500" size={24} />,
      trend: 'positive'
    }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Accounting & Financial Reports</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button onClick={handleExportData}>
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                <div className="mr-4 bg-gray-100 p-3 rounded-full animate-pulse h-12 w-12"></div>
                <div className="w-full">
                  <div className="h-5 bg-gray-200 w-32 animate-pulse rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 w-24 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 w-28 animate-pulse rounded"></div>
            </Card>
          ))
        ) : (
          revenueInsights.map((insight, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                <div className="mr-4 bg-gray-100 p-3 rounded-full">
                  {insight.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">{insight.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{insight.description}</p>
            </Card>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium">Filter by Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Job Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-28 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No invoices found for the selected filter.</p>
                    <p className="text-sm text-gray-400">Invoices will appear here as jobs are completed and invoiced.</p>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.job_reference || 'N/A'}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.issue_date}</TableCell>
                    <TableCell>{invoice.due_date}</TableCell>
                    <TableCell>{invoice.total_amount}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusClass(invoice.payment_status)}`}>
                        {invoice.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.payment_date || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Financial Summary */}
      {!isLoading && revenueStats && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{revenueStats.totalBookings}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Completed Bookings</p>
                <p className="text-2xl font-bold text-green-600">{revenueStats.completedBookings}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Pending Jobs</p>
                <p className="text-2xl font-bold text-amber-600">{revenueStats.pendingJobs}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{revenueStats.monthlyRevenue}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Accounting;
