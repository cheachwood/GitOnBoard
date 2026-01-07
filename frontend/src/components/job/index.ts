export interface Job {
  id: number;
  description: string;
  author: string;
  dailyRate: number;
  candidate: string;
  isActive: boolean;
  creationDate: number;
  isOwner: boolean;
  status: JobTypeValue;
}

export type JobTypeValue = (typeof JOB_TYPE_OPTIONS)[number]['value'];

export const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'All Jobs' },
  { value: 'Open', label: 'Open' },
  { value: 'InProgress', label: 'InProgress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
] as const;

export interface JobProps {
  job: Job;
}

export const statusColors = {
  Open: 'bg-blue-500',
  InProgress: 'bg-yellow-500',
  Completed: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

export interface JobListProps {
  jobs: Job[];
  connectedAddress?: string;
  isLoading?: boolean;
}
