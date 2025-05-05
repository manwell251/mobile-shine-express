
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, User, Phone, Mail, Calendar, MapPin, Download, Plus, FileSpreadsheet } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bookings: number;
  totalSpent: string;
  lastBooking: string;
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - would come from backend API
  const customers: Customer[] = [
    {
      id: 'C001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+256 700 123 456',
      location: 'Kampala, Nakasero',
      bookings: 3,
      totalSpent: 'UGX 110,000',
      lastBooking: '2025-05-05'
    },
    {
      id: 'C002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+256 780 567 890',
      location: 'Kampala, Kololo',
      bookings: 1,
      totalSpent: 'UGX 70,000',
      lastBooking: '2025-05-06'
    },
    {
      id: 'C003',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+256 712 345 678',
      location: 'Kampala, Bugolobi',
      bookings: 5,
      totalSpent: 'UGX 175,000',
      lastBooking: '2025-05-04'
    },
    {
      id: 'C004',
      name: 'Emily Brown',
      email: 'emily.b@example.com',
      phone: '+256 756 789 012',
      location: 'Kampala, Ntinda',
      bookings: 2,
      totalSpent: 'UGX 200,000',
      lastBooking: '2025-05-07'
    }
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm) ||
      customer.location.toLowerCase().includes(searchLower)
    );
  });

  const handleExportToExcel = () => {
    console.log('Exporting customer data to Excel...');
    // In a real app, this would connect to a backend API to generate and download an Excel file
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
            <p className="text-2xl font-bold">{customers.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Active This Month</p>
            <p className="text-2xl font-bold">6</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">UGX 555,000</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Avg. Bookings/Customer</p>
            <p className="text-2xl font-bold">2.75</p>
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
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-1 text-gray-500" />
                        {customer.email}
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
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{customer.bookings}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      {customer.lastBooking}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Customers;
