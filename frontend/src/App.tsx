import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { useConnection } from 'wagmi';
import Header from './components/layout/Header';
import JobList from './components/job/JobList';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import type { Job, JobCallbacks, JobStatus } from './components/job';
import { MOCK_JOBS } from './lib/mockData';
import './lib/appkit';

const queryClient = new QueryClient();

// Composant qui utilise les hooks Wagmi (doit être DANS WagmiProvider)
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const { address, isConnected } = useConnection();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateJob = (newJobData: { author: string; description: string; dailyRate: number }) => {
    const newJob: Job = {
      id: jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1,
      author: newJobData.author,
      description: newJobData.description,
      dailyRate: newJobData.dailyRate,
      candidat: {
        candidateName: '',
        candidateMail: '',
        candidateWallet: '',
      },
      isActive: true,
      creationDate: Date.now(),
      isOwner: true,
      status: 'Open',
    };

    setJobs([...jobs, newJob]);
  };

  const handleEditJob = (updatedJob: { id: number; author: string; description: string; dailyRate: number }) => {
    setJobs(jobs.map((jobToUpdate) => (jobToUpdate.id === updatedJob.id ? { ...jobToUpdate, ...updatedJob } : jobToUpdate)));
  };

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const handleCandidateJob = (candidateJob: { id: number; candidateName: string; candidateMail: string; candidateWallet?: string }) => {
    setJobs(
      jobs.map((jobToUpdate) =>
        jobToUpdate.id === candidateJob.id
          ? {
              ...jobToUpdate,
              candidat: {
                candidateName: candidateJob.candidateName,
                candidateMail: candidateJob.candidateMail,
                candidateWallet: candidateJob.candidateWallet,
              },
            }
          : jobToUpdate
      )
    );
  };

  const handleStatusChanged = (jobId: number, newStatus: JobStatus) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)));
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
