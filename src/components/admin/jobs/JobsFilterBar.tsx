
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface JobsFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const JobsFilterBar: React.FC<JobsFilterBarProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
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
  );
};

export default JobsFilterBar;
