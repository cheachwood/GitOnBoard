import { useState } from 'react';
import { JOB_TYPE_OPTIONS, type JobListProps } from '.';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import JobCard from './JobCard';

const JobList = ({ jobs, connectedAddress, isLoading, callbacks }: JobListProps) => {
  console.log('isLoading:', isLoading);
  const [jobType, setJobType] = useState('all');
  const filteredJobs = jobType === 'all' ? jobs : jobs.filter((job) => job.status === jobType);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96 rounded-xl bg-gray-700" />
        <Skeleton className="h-96 rounded-xl bg-gray-700" />
        <Skeleton className="h-96 rounded-xl bg-gray-700" />
      </div>
    );
  }
  if (connectedAddress === '') {
    return <div className="text-center text-gray-400 text-xl py-16">Veuillez vous connecter pour interagir avec l'application!</div>;
  }
  if (jobs.length === 0) {
    return <div className="text-center text-gray-400 text-xl py-16">Il n'y a actuellement aucune offre à vous proposer!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Select value={jobType} onValueChange={(value) => setJobType(value)}>
        <SelectTrigger className="w-64 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 mb-8">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {JOB_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700 cursor-pointer">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} callbacks={callbacks} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
