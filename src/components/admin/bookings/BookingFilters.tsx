
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <>
      {/* Main Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setStatusFilter('all')}
          >
            <Filter size={16} className="mr-2" />
            Status: {statusFilter === 'all' ? 'All' : statusFilter}
            <ChevronDown size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="flex items-center">
            <CalendarIcon size={16} className="mr-2" />
            Date Range
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Quick Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={statusFilter === 'all' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('all')}
          className="text-sm h-8"
        >
          All
        </Button>
        <Button 
          variant={statusFilter === 'Draft' ? "default" : "ghost"} 
          onClick={() => setStatusFilter('Draft')}
          className="text-sm h-8"
        >
          Draft
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
    </>
  );
};

export default BookingFilters;
