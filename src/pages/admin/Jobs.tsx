
import React, { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import JobsFilterBar from '@/components/admin/jobs/JobsFilterBar';
import JobsStatusFilter from '@/components/admin/jobs/JobsStatusFilter';
import JobsTable from '@/components/admin/jobs/JobsTable';

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
      <JobsFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Status quick filters */}
      <JobsStatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* Jobs Table */}
      <JobsTable jobs={filteredJobs} />
    </div>
  );
};

export default Jobs;
