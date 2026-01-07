export interface Job {
  id: number;
  description: string;
  author: string;
  dailyRate: number;
  candidate: string;
  isActive: boolean;
  creationDate: number;
  isOwner: boolean;
  status: 'Open' | 'InProgress' | 'Completed' | 'Cancelled';
}

export interface JobProps {
  job: Job;
}

export const statusColors = {
  Open: 'bg-blue-500',
  InProgress: 'bg-yellow-500',
  Completed: 'bg-green-500',
  Cancelled: 'bg-red-500',
};
