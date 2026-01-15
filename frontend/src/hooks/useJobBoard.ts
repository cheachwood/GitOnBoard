import { useReadContract } from 'wagmi';
import { JOB_BOARD_ADDRESS, JOB_BOARD_ABI, CHAIN_ID } from '../lib/contracts';
import type { Job, JobStatus } from '../components/job';

// Type pour les données brutes du smart contract
type ContractJob = {
  id: number;
  author: `0x${string}`;
  candidate: `0x${string}`;
  candidateName: string;
  candidateEmail: string;
  description: string;
  dailyRate: number;
  status: number;
  isActive: boolean;
  creationDate: number;
};

// Helper pour formater le statut
const formatStatus = (statusEnum: number): JobStatus => {
  switch (statusEnum) {
    case 0:
      return 'Open';
    case 1:
      return 'InProgress';
    case 2:
      return 'Completed';
    default:
      return 'Open';
  }
};

export const useJobBoard = () => {
  const {
    data: contractJobs,
    isLoading,
    error,
  } = useReadContract({
    address: JOB_BOARD_ADDRESS,
    abi: JOB_BOARD_ABI,
    functionName: 'getAllJobs',
    chainId: CHAIN_ID,
  });

  console.log('📦 Raw contract data:', contractJobs);

  // Transformer les données
  const jobs: Job[] = contractJobs
    ? contractJobs.map((job: ContractJob) => ({
        id: job.id,
        author: job.author,
        description: job.description,
        dailyRate: job.dailyRate,
        candidat: {
          candidateName: job.candidateName,
          candidateMail: job.candidateEmail,
          candidateWallet: job.candidate,
        },
        status: formatStatus(job.status),
        isActive: job.isActive,
        creationDate: job.creationDate,
        isOwner: false,
      }))
    : [];

  return {
    jobs,
    isLoading,
    error,
  };
};
