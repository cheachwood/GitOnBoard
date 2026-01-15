import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { useConnection } from 'wagmi';
import Header from './components/layout/Header';
import JobList from './components/job/JobList';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import type { JobCallbacks, JobStatus } from './components/job';
import { useJobBoard } from './hooks/useJobBoard';
import './lib/appkit';

const queryClient = new QueryClient();

// Composant qui utilise les hooks Wagmi (doit être DANS WagmiProvider)
function AppContent() {
  const { address, isConnected } = useConnection();

  // ✅ Hook personnalisé pour lire les jobs
  const { jobs, isLoading, error } = useJobBoard();

  // 🔍 Logs de debug
  console.log('🔌 Connected:', isConnected);
  console.log('👤 Address:', address);
  console.log('📦 Jobs from contract:', jobs);
  console.log('⏳ Loading:', isLoading);
  console.log('❌ Error:', error);

  // UI loading (garde pour l'instant)
  const [isLoadingUI, setIsLoadingUI] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingUI(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Handlers temporaires (juste des logs pour l'instant)
  const handleCreateJob = (newJobData: { author: string; description: string; dailyRate: number }) => {
    console.log('TODO: Create job on-chain', newJobData);
  };

  const handleEditJob = (updatedJob: { id: number; author: string; description: string; dailyRate: number }) => {
    console.log('TODO: Edit job on-chain', updatedJob);
  };

  const handleDeleteJob = (jobId: number) => {
    console.log('TODO: Delete job on-chain', jobId);
  };

  const handleCandidateJob = (candidateJob: { id: number; candidateName: string; candidateMail: string; candidateWallet?: string }) => {
    console.log('TODO: Assign candidate on-chain', candidateJob);
  };

  const handleStatusChanged = (jobId: number, newStatus: JobStatus) => {
    console.log('TODO: Change status on-chain', jobId, newStatus);
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
