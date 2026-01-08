export interface Job {
  id: number;
  description: string;
  author: string;
  dailyRate: number;
  candidat: Candidat;
  isActive: boolean;
  creationDate: number;
  isOwner: boolean;
  status: JobTypeValue;
}

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
  onCandidateJob: (candidateJob: { id: number; candidatNom: string; candidatMail: string; candidatWallet?: string }) => void;
}
