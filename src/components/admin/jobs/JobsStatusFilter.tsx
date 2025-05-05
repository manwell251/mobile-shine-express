
import React from 'react';
import { Button } from '@/components/ui/button';

interface JobsStatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const JobsStatusFilter: React.FC<JobsStatusFilterProps> = ({
  statusFilter,
  setStatusFilter
}) => {
  return (
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
  );
};

export default JobsStatusFilter;
