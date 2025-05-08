
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JobWithDetails } from '@/services/jobs';
import { useNavigate } from 'react-router-dom';

interface JobsTableProps {
  jobs: JobWithDetails[];
  isLoading?: boolean;
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, isLoading = false }) => {
  const navigate = useNavigate();
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'InProgress': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleUpdateStatus = (jobId: string) => {
    // Implementation will be added
    console.log("Update status for job", jobId);
  };

  const handleViewJob = (jobId: string) => {
    // Navigate to job details page
    // This will be implemented when we create the job details page
    console.log("View job", jobId);
  };

  return (
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
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><div className="h-5 bg-gray-200 w-14 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-16 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-32 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-20 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 w-24 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-8 bg-gray-200 w-32 animate-pulse rounded"></div></TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  No jobs found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.job_reference}</TableCell>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(job.id)}
                      >
                        Update Status
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewJob(job.id)}
                      >
                        View
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
  );
};

export default JobsTable;
