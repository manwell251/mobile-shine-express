import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JobWithDetails, jobsService } from '@/services/jobs';
import { useNavigate } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';
import TechnicianAssignment from './TechnicianAssignment';
import { supabase } from '@/integrations/supabase/client';

interface JobsTableProps {
  jobs: JobWithDetails[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, isLoading = false, onRefresh }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'InProgress': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        // Only delete actual jobs, not bookings shown as jobs
        if (!jobToDelete.startsWith('booking-')) {
          await jobsService.delete(jobToDelete);
          toast({
            title: "Success",
            description: "Job deleted successfully"
          });
        } else {
          toast({
            title: "Info",
            description: "Cannot delete booking-based jobs. Change booking status instead."
          });
        }
        setDeleteDialogOpen(false);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast({
          title: "Error",
          description: "Failed to delete job",
          variant: "destructive"
        });
      } finally {
        setJobToDelete(null);
      }
    }
  };

  const handleUpdateStatus = async (jobId: string, status: string) => {
    setStatusUpdateLoading(jobId);
    try {
      if (jobId.startsWith('booking-')) {
        // This is a booking shown as a job - update the booking status
        const bookingId = jobId.replace('booking-', '');
        const { error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', bookingId);
        
        if (error) throw error;
      } else {
        // This is an actual job
        await jobsService.updateStatus(jobId, status);
      }
      
      toast({
        title: "Status Updated",
        description: `Job status changed to ${status}`
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleViewJob = (jobId: string) => {
    // Navigate to job details page only for actual jobs
    if (!jobId.startsWith('booking-')) {
      navigate(`/admin/jobs/${jobId}`);
    } else {
      toast({
        title: "Info",
        description: "This is a booking shown as a job. View details in Bookings section."
      });
    }
  };

  return (
    <>
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
                    <TableCell className="font-medium">
                      {job.job_reference}
                      {job.isFromBooking && <span className="text-xs text-blue-500 ml-1">(Booking)</span>}
                    </TableCell>
                    <TableCell>{job.bookingId}</TableCell>
                    <TableCell>{job.customerName}</TableCell>
                    <TableCell>
                      {job.services.map((service, idx) => (
                        <div key={idx} className="text-sm">{service}</div>
                      ))}
                    </TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell>
                      <TechnicianAssignment 
                        jobId={job.id}
                        currentTechnicianId={job.technician_id}
                        onAssignmentUpdate={onRefresh}
                        isFromBooking={job.isFromBooking}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={job.status}
                        onValueChange={(value) => handleUpdateStatus(job.id, value)}
                        disabled={statusUpdateLoading === job.id}
                      >
                        <SelectTrigger className={`w-[130px] ${getStatusClass(job.status)}`}>
                          <SelectValue placeholder={job.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="InProgress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{job.amount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewJob(job.id)}
                          disabled={job.isFromBooking}
                        >
                          <Edit size={16} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          disabled={job.isFromBooking}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this job.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JobsTable;
