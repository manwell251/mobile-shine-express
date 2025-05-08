
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import JobsFilterBar from '@/components/admin/jobs/JobsFilterBar';
import JobsStatusFilter from '@/components/admin/jobs/JobsStatusFilter';
import JobsTable from '@/components/admin/jobs/JobsTable';
import { jobsService } from '@/services/jobs';
import { exportToExcel } from '@/utils/export';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      let fetchedJobs;
      
      if (searchTerm) {
        fetchedJobs = await jobsService.search(searchTerm);
      } else {
        fetchedJobs = await jobsService.getByStatus(statusFilter);
      }
      
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply sorting to the jobs array
    const sortedJobs = [...jobs].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount-asc':
          return parseInt(a.amount.replace(/[^0-9]/g, '')) - parseInt(b.amount.replace(/[^0-9]/g, ''));
        case 'amount-desc':
          return parseInt(b.amount.replace(/[^0-9]/g, '')) - parseInt(a.amount.replace(/[^0-9]/g, ''));
        default:
          return 0;
      }
    });
    
    setJobs(sortedJobs);
  }, [sortBy]);

  // Handle search
  useEffect(() => {
    // Debounce search
    const handler = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleExportData = () => {
    try {
      const exportData = jobs.map(job => ({
        'Job ID': job.job_reference,
        'Booking ID': job.bookingId,
        'Customer': job.customerName,
        'Services': job.services.join(', '),
        'Date': job.date,
        'Technician': job.technician,
        'Status': job.status,
        'Amount': job.amount,
        'Location': job.location
      }));

      exportToExcel({
        fileName: 'Jobs_Export',
        sheets: [
          {
            name: 'Jobs',
            data: exportData
          }
        ]
      });
      
      toast({
        title: "Export Successful",
        description: "Jobs data has been exported to Excel.",
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

  // Filter jobs based on search term (we handle this on the server now)
  const filteredJobs = jobs;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Jobs Management</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Select 
            value={sortBy}
            onValueChange={setSortBy}
          >
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
          <Button onClick={handleExportData}>Export Data</Button>
        </div>
      </div>

      {/* Filters */}
      <JobsFilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      {/* Status quick filters */}
      <JobsStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      {/* Jobs Table */}
      <JobsTable 
        jobs={filteredJobs} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Jobs;
