
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, Calendar as CalendarIcon, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: (range: { start: string | null; end: string | null }) => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStart, setTempStart] = useState<Date | undefined>(
    dateRange.start ? new Date(dateRange.start) : undefined
  );
  const [tempEnd, setTempEnd] = useState<Date | undefined>(
    dateRange.end ? new Date(dateRange.end) : undefined
  );

  const applyDateFilter = () => {
    setDateRange({
      start: tempStart ? format(tempStart, 'yyyy-MM-dd') : null,
      end: tempEnd ? format(tempEnd, 'yyyy-MM-dd') : null
    });
    setIsCalendarOpen(false);
  };

  const clearDateFilter = () => {
    setTempStart(undefined);
    setTempEnd(undefined);
    setDateRange({ start: null, end: null });
    setIsCalendarOpen(false);
  };

  const getDateButtonLabel = () => {
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
    }
    return 'Date Range';
  };

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
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center"
              >
                <Filter size={16} className="mr-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                {["all", "Draft", "Scheduled", "InProgress", "Completed", "Cancelled"].map((status) => (
                  <Button 
                    key={status}
                    variant={statusFilter === status ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setStatusFilter(status);
                    }}
                  >
                    {status === 'all' ? 'All' : status}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                {getDateButtonLabel()}
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <h4 className="font-medium text-sm">Start Date</h4>
                    <Calendar 
                      mode="single"
                      selected={tempStart}
                      onSelect={setTempStart}
                      disabled={(date) => tempEnd ? date > tempEnd : false}
                    />
                  </div>
                  <div className="grid gap-1">
                    <h4 className="font-medium text-sm">End Date</h4>
                    <Calendar 
                      mode="single"
                      selected={tempEnd}
                      onSelect={setTempEnd}
                      disabled={(date) => tempStart ? date < tempStart : false}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearDateFilter}
                      className="w-24"
                    >
                      <X size={14} className="mr-1" /> Clear
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={applyDateFilter}
                      disabled={!tempStart || !tempEnd}
                      className="w-24"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
