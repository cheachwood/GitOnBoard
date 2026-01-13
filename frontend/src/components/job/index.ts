export interface Candidat {
  candidateName: string;
  candidateMail: string;
  candidateWallet?: string;
}

export type JobTypeValue = (typeof JOB_TYPE_OPTIONS)[number]['value'];

export const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'All Jobs' },
  { value: 'Open', label: 'Open' },
  { value: 'InProgress', label: 'InProgress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
] as const;

export type JobStatus = Exclude<JobTypeValue, 'all'>;

export interface Job {
  id: number;
  description: string;
  author: string;
  dailyRate: number;
  candidat: Candidat;
  isActive: boolean;
  creationDate: number;
  isOwner: boolean;
  status: JobStatus;
}

export const statusColors = {
  Open: 'bg-blue-500',
  InProgress: 'bg-yellow-500',
  Completed: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

// Dans index.ts
export interface JobCallbacks {
  onEditJob: (updatedJob: { id: number; author: string; description: string; dailyRate: number }) => void;
  onCandidateJob: (candidateJob: { id: number; candidateName: string; candidateMail: string; candidateWallet?: string }) => void;
  onStatusChanged: (jobId: number, newStatus: JobStatus) => void;
  onDeleteJob: (jobId: number) => void;
}

export interface JobListProps {
  jobs: Job[];
  connectedAddress?: string;
  isLoading?: boolean;
  callbacks: JobCallbacks;
}

export interface JobProps {
  job: Job;
  callbacks: JobCallbacks;
}

export interface JobDialogProps {
  onCreateJob: (newJob: { author: string; description: string; dailyRate: number }) => void;
}

export interface EditJobDialogProps {
  job: Job;
  open: boolean;
  onClose: () => void;
  onEditJob: (updatedJob: { id: number; author: string; description: string; dailyRate: number }) => void;
}

export interface AssignCandidateDialogProps {
  job: Job;
  open: boolean;
  onClose: () => void;
  onCandidateJob: (candidateJob: { id: number; candidateName: string; candidateMail: string; candidateWallet?: string }) => void;
}

export interface ChangeStatusDialogProps {
  job: Job;
  open: boolean;
  onClose: () => void;
  onStatusChanged: (jobId: number, newStatus: JobStatus) => void;
}
