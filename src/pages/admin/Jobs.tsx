
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Filter, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// Job types
interface Job {
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

const Jobs = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - would come from backend API
  const jobs: Job[] = [
    {
      id: 'J001',
      bookingId: 'BK001',
      customerName: 'John Doe',
      services: ['Basic Wash Package'],
      date: '2025-05-05',
      status: 'Scheduled',
      amount: 'UGX 25,000',
      technician: 'Michael K.',
      location: 'Kampala, Nakasero'
    },
    {
      id: 'J002',
      bookingId: 'BK003',
      customerName: 'Robert Johnson',
      services: ['Full-Service Wash Package'],
      date: '2025-05-04',
      status: 'Completed',
      amount: 'UGX 35,000',
      technician: 'James M.',
      location: 'Kampala, Bugolobi'
    },
    {
      id: 'J003',
      bookingId: 'BK004',
      customerName: 'Emily Brown',
      services: ['Complete Detailing Package'],
      date: '2025-05-07',
      status: 'InProgress',
      amount: 'UGX 150,000',
      technician: 'David N.',
      location: 'Kampala, Kololo'
    }
  ];

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'InProgress': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    return (statusFilter === 'all' || job.status === statusFilter) &&
      (job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.bookingId.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Jobs Management</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Select defaultValue="sorted">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search jobs..." 
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

      {/* Status quick filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={statusFilter === 'all' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('all')}
          className="text-sm h-8"
        >
          All Jobs
        </Button>
        <Button 
          variant={statusFilter === 'Scheduled' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('Scheduled')}
          className="text-sm h-8"
        >
          Scheduled
        </Button>
        <Button 
          variant={statusFilter === 'InProgress' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('InProgress')}
          className="text-sm h-8"
        >
          In Progress
        </Button>
        <Button 
          variant={statusFilter === 'Completed' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('Completed')}
          className="text-sm h-8"
        >
          Completed
        </Button>
      </div>

      {/* Jobs Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>{job.bookingId}</TableCell>
                  <TableCell>{job.customerName}</TableCell>
                  <TableCell>
                    {job.services.map((service, idx) => (
                      <div key={idx} className="text-sm">{service}</div>
                    ))}
                  </TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell>{job.technician}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(job.status)}`}>
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>{job.amount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm">
                        View
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

export default Jobs;
