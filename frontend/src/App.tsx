import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { useConnection } from 'wagmi';
import Header from './components/layout/Header';
import JobList from './components/job/JobList';
import { Toaster } from 'sonner';
import type { JobCallbacks, JobStatus } from './components/job';
import { useJobBoard } from './hooks/useJobBoard';
import './lib/appkit';

const queryClient = new QueryClient();

// Composant qui utilise les hooks Wagmi (doit être DANS WagmiProvider)
function AppContent() {
  const { address, isConnected } = useConnection();

  // Hook personnalisé pour gérer les jobs
  const { jobs, isLoading, error, createJob, updateJob, assignCandidate, changeJobStatus, toggleJobActive } = useJobBoard(address);

  // Logs de debug
  console.log('Connected:', isConnected);
  console.log('Address:', address);
  console.log('Jobs from contract:', jobs);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Handlers
  const handleCreateJob = (newJobData: { author: string; description: string; dailyRate: number }) => {
    createJob(newJobData.dailyRate, newJobData.description);
  };

  const handleEditJob = (updatedJob: { id: number; author: string; description: string; dailyRate: number }) => {
    updateJob(updatedJob.id, updatedJob.dailyRate, updatedJob.description);
  };

  const handleDeleteJob = (jobId: number) => {
    toggleJobActive(jobId);
  };

  const handleCandidateJob = (candidateJob: { id: number; candidateName: string; candidateMail: string; candidateWallet?: string }) => {
    assignCandidate(candidateJob.id, candidateJob.candidateName, candidateJob.candidateMail);
  };

  const handleStatusChanged = (jobId: number, newStatus: JobStatus) => {
    // Convertir le status string en number pour le contrat
    const statusMap: Record<JobStatus, number> = {
      Open: 0,
      InProgress: 1,
      Completed: 2,
      Cancelled: 3,
    };

    changeJobStatus(jobId, statusMap[newStatus]);
  };

  const jobCallbacks: JobCallbacks = {
    onEditJob: handleEditJob,
    onCandidateJob: handleCandidateJob,
    onStatusChanged: handleStatusChanged,
    onDeleteJob: handleDeleteJob,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onCreateJob={handleCreateJob} />

      {isConnected && address ? (
        <JobList jobs={jobs} isLoading={isLoading} callbacks={jobCallbacks} />
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <p>Connecte ton wallet pour voir les offres</p>
        </div>
      )}

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

// Composant App qui wrap tout avec les providers
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
