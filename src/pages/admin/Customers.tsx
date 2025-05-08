
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, User, Phone, Mail, Calendar, MapPin, FileSpreadsheet } from 'lucide-react';
import { customersService, CustomerWithStats } from '@/services/customers';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/utils/export';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeThisMonth: 0,
    totalRevenue: 'UGX 0',
    avgBookings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        searchCustomers(searchTerm);
      } else {
        fetchCustomers();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customersService.getAll();
      setCustomers(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customer data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchCustomers = async (term: string) => {
    try {
      setIsLoading(true);
      const data = await customersService.search(term);
      setCustomers(data);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast({
        title: "Error",
        description: "Failed to search customers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (customerData: CustomerWithStats[]) => {
    // Count total customers
    const totalCustomers = customerData.length;

    // Calculate total revenue (removing UGX and commas from the string)
    let totalRevenue = 0;
    customerData.forEach(customer => {
      const revenue = parseInt(customer.totalSpent.replace(/[^0-9]/g, '')) || 0;
      totalRevenue += revenue;
    });

    // Calculate total bookings
    const totalBookings = customerData.reduce((sum, customer) => sum + customer.bookings, 0);

    // Calculate average bookings per customer
    const avgBookings = totalCustomers > 0 ? (totalBookings / totalCustomers).toFixed(2) : '0';

    // Count active customers this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const activeThisMonth = customerData.filter(customer => {
      if (!customer.lastBooking) return false;
      const bookingDate = new Date(customer.lastBooking);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    }).length;

    // Format total revenue
    const formattedRevenue = new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(totalRevenue);

    setStats({
      totalCustomers,
      activeThisMonth,
      totalRevenue: formattedRevenue,
      avgBookings: parseFloat(avgBookings)
    });
  };

  const handleExportToExcel = () => {
    try {
      const exportData = customers.map(customer => ({
        'Customer ID': customer.id,
        'Name': customer.name,
        'Email': customer.email || 'N/A',
        'Phone': customer.phone,
        'Location': customer.location || 'N/A',
        'Bookings': customer.bookings,
        'Total Spent': customer.totalSpent,
        'Last Booking': customer.lastBooking || 'N/A'
      }));

      exportToExcel({
        fileName: 'Customer_Data',
        sheets: [
          {
            name: 'Customers',
            data: exportData
          }
        ]
      });

      toast({
        title: "Export Successful",
        description: "Customer data has been exported to Excel"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export customer data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button>
            <User className="mr-2" size={18} />
            Add New Customer
          </Button>
          <Button variant="outline" onClick={handleExportToExcel}>
            <FileSpreadsheet className="mr-2" size={18} />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search customers by name, email, phone..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Active This Month</p>
            <p className="text-2xl font-bold">{stats.activeThisMonth}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">{stats.totalRevenue}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Avg. Bookings/Customer</p>
            <p className="text-2xl font-bold">{stats.avgBookings}</p>
          </Card>
        </div>
      </div>

      {/* Customer Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><div className="h-5 bg-gray-200 w-14 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 w-32 animate-pulse rounded"></div>
                        <div className="h-4 bg-gray-200 w-24 animate-pulse rounded"></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-28 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-10 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-8 bg-gray-200 w-40 animate-pulse rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No customers found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id.substring(0, 8)}...</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          {customer.email || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        {customer.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{customer.bookings}</TableCell>
                    <TableCell>{customer.totalSpent}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        {customer.lastBooking || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          Book Service
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
    </div>
  );
};

export default Customers;
