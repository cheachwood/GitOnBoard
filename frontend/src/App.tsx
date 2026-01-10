import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Header from './components/layout/Header';
import JobList from './components/job/JobList';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import type { Job } from './components/job';
import { MOCK_JOBS } from './lib/mockData';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [connectedAddress] = useState<string>('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900">
          <Header />
          <JobList jobs={jobs} connectedAddress={connectedAddress} isLoading={isLoading} />
          <Toaster position="top-center" theme="dark" />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
