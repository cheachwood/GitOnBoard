import { useEffect } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { JOB_BOARD_ADDRESS, JOB_BOARD_ABI, CHAIN_ID } from '../lib/contracts';
import type { Job, JobStatus } from '../components/job';

// Type pour les données brutes du smart contract
type ContractJob = {
  id: number;
  creationDate: number;
  dailyRate: number;
  status: number;
  isActive: boolean;
  author: `0x${string}`;
  candidate: `0x${string}`;
  candidateName: string;
  candidateEmail: string;
  description: string;
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

export const useJobBoard = (connectedAddress?: `0x${string}`) => {
  // Lecture des jobs
  const {
    data: contractJobs,
    isLoading,
    error,
    refetch: refetchAll,
  } = useReadContract({
    address: JOB_BOARD_ADDRESS,
    abi: JOB_BOARD_ABI,
    functionName: 'getAllJobs',
    chainId: CHAIN_ID,
  });

  // Hook pour createJob
  const { mutate: writeContractCreate, isPending: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError } = useWriteContract();

  // Hook pour updateJob
  const { mutate: writeContractUpdate, isPending: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useWriteContract();

  // Hook pour assignCandidate
  const { mutate: writeContractAssign, isPending: isAssigning, isSuccess: isAssignSuccess, isError: isAssignError, error: assignError } = useWriteContract();

  // Hook pour changeStatus
  const { mutate: writeContractChangeStatus, isPending: isChangingStatus, isSuccess: isChangeStatusSuccess, isError: isChangeStatusError, error: changeStatusError } = useWriteContract();

  // Hook pour toggleActive
  const { mutate: writeContractToggle, isPending: isToggling, isSuccess: isToggleSuccess, isError: isToggleError, error: toggleError } = useWriteContract();

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
        isOwner: connectedAddress ? job.author.toLowerCase() === connectedAddress.toLowerCase() : false,
      }))
    : [];

  // Recharger automatiquement après création réussie
  useEffect(() => {
    if (isCreateSuccess) {
      console.log('🔄 Reloading jobs after successful creation...');
      refetchAll();
    }
  }, [isCreateSuccess, refetchAll]);

  // Recharger après modification réussie
  useEffect(() => {
    if (isUpdateSuccess) {
      console.log('🔄 Reloading jobs after successful update...');
      refetchAll();
    }
  }, [isUpdateSuccess, refetchAll]);

  // Recharger après assignation réussie
  useEffect(() => {
    if (isAssignSuccess) {
      console.log('🔄 Reloading jobs after successful assignment...');
      refetchAll();
    }
  }, [isAssignSuccess, refetchAll]);

  // Recharger après changement de statut réussi
  useEffect(() => {
    if (isChangeStatusSuccess) {
      console.log('🔄 Reloading jobs after successful status change...');
      refetchAll();
    }
  }, [isChangeStatusSuccess, refetchAll]);

  // Recharger après toggle réussi
  useEffect(() => {
    if (isToggleSuccess) {
      console.log('🔄 Reloading jobs after successful toggle...');
      refetchAll();
    }
  }, [isToggleSuccess, refetchAll]);

  // Fonction pour créer un job
  const createJob = (dailyRate: number, description: string) => {
    console.log('🚀 Calling createJob with:', { dailyRate, description });
    console.log('📍 Contract address:', JOB_BOARD_ADDRESS);
    console.log('⛓️  Chain ID:', CHAIN_ID);

    writeContractCreate(
      {
        address: JOB_BOARD_ADDRESS,
        abi: JOB_BOARD_ABI,
        functionName: 'createJob',
        args: [dailyRate, description],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => {
          console.log('✅ Transaction success:', data);
        },
        onError: (error) => {
          console.error('❌ Transaction error:', error);
        },
      }
    );

    console.log('📤 writeContract called');
  };

  // Fonction pour modifier un job
  const updateJob = (jobId: number, dailyRate: number, description: string) => {
    console.log('✏️ Updating job:', { jobId, dailyRate, description });

    writeContractUpdate(
      {
        address: JOB_BOARD_ADDRESS,
        abi: JOB_BOARD_ABI,
        functionName: 'updateJob',
        args: [jobId, dailyRate, description],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => console.log('✅ Update success:', data),
        onError: (error) => console.error('❌ Update error:', error),
      }
    );
  };

  // Fonction pour assigner un candidat
  const assignCandidate = (jobId: number, candidateName: string, candidateEmail: string) => {
    console.log('👤 Assigning candidate:', { jobId, candidateName, candidateEmail });

    writeContractAssign(
      {
        address: JOB_BOARD_ADDRESS,
        abi: JOB_BOARD_ABI,
        functionName: 'assigneCandidate',
        args: [jobId, candidateName, candidateEmail],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => console.log('✅ Assign success:', data),
        onError: (error) => console.error('❌ Assign error:', error),
      }
    );
  };

  // Fonction pour changer le statut
  const changeJobStatus = (jobId: number, newStatus: number) => {
    console.log('🔄 Changing status:', { jobId, newStatus });

    writeContractChangeStatus(
      {
        address: JOB_BOARD_ADDRESS,
        abi: JOB_BOARD_ABI,
        functionName: 'changeJobStatus',
        args: [jobId, newStatus],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => console.log('✅ Status change success:', data),
        onError: (error) => console.error('❌ Status change error:', error),
      }
    );
  };

  // Fonction pour toggle active
  const toggleJobActive = (jobId: number) => {
    console.log('🔀 Toggling active:', { jobId });

    writeContractToggle(
      {
        address: JOB_BOARD_ADDRESS,
        abi: JOB_BOARD_ABI,
        functionName: 'toggleJobActive',
        args: [jobId],
        chainId: CHAIN_ID,
      },
      {
        onSuccess: (data) => console.log('✅ Toggle success:', data),
        onError: (error) => console.error('❌ Toggle error:', error),
      }
    );
  };

  return {
    // Lecture
    jobs,
    isLoading,
    error,

    // Création
    createJob,
    isCreating,
    isCreateSuccess,
    isCreateError,
    createError,

    // Modification
    updateJob,
    isUpdating,
    isUpdateSuccess,
    isUpdateError,
    updateError,

    // Assignation
    assignCandidate,
    isAssigning,
    isAssignSuccess,
    isAssignError,
    assignError,

    // Changement de statut
    changeJobStatus,
    isChangingStatus,
    isChangeStatusSuccess,
    isChangeStatusError,
    changeStatusError,

    // Toggle active
    toggleJobActive,
    isToggling,
    isToggleSuccess,
    isToggleError,
    toggleError,
  };
};
