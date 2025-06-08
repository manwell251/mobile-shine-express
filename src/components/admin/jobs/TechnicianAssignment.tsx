
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { techniciansService, Technician } from '@/services/technicians';
import { jobsService } from '@/services/jobs';
import { useToast } from '@/hooks/use-toast';
import { UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TechnicianAssignmentProps {
  jobId: string;
  currentTechnicianId?: string;
  onAssignmentUpdate?: () => void;
  isFromBooking?: boolean;
}

const TechnicianAssignment: React.FC<TechnicianAssignmentProps> = ({
  jobId,
  currentTechnicianId,
  onAssignmentUpdate,
  isFromBooking = false
}) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>(currentTechnicianId || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    setSelectedTechnicianId(currentTechnicianId || '');
  }, [currentTechnicianId]);

  const fetchTechnicians = async () => {
    try {
      const data = await techniciansService.getActive();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleAssignment = async () => {
    if (!selectedTechnicianId) return;

    try {
      setIsUpdating(true);

      if (isFromBooking) {
        // This is a booking shown as a job, extract booking ID
        const bookingId = jobId.replace('booking-', '');
        await jobsService.updateBookingTechnician(
          bookingId, 
          selectedTechnicianId === 'unassigned' ? null : selectedTechnicianId
        );
      } else {
        // This is an actual job
        await jobsService.update(jobId, { 
          technician_id: selectedTechnicianId === 'unassigned' ? null : selectedTechnicianId 
        });
      }
      
      toast({
        title: "Success",
        description: selectedTechnicianId === 'unassigned' 
          ? "Technician unassigned from job" 
          : "Technician assigned to job successfully"
      });
      
      if (onAssignmentUpdate) {
        onAssignmentUpdate();
      }
    } catch (error) {
      console.error('Error updating job assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update technician assignment",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select technician" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {technicians.map((technician) => (
            <SelectItem key={technician.id} value={technician.id}>
              {technician.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleAssignment}
        disabled={isUpdating || selectedTechnicianId === currentTechnicianId}
        size="sm"
      >
        <UserCheck size={16} className="mr-1" />
        {isUpdating ? 'Updating...' : 'Assign'}
      </Button>
    </div>
  );
};

export default TechnicianAssignment;
